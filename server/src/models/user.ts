import mongoose from 'mongoose';
import type { CartItem, PopulatedCart } from '../../../types/Cart.js';
import type { OrderItem } from '../../../types/Order.js';
import type { Product as IProduct } from '../../../types/Product.js';
import type { IUserDocument } from '../../../types/User.js';
import { Order } from './order.js';
import { Product } from './product.js';
import { PRODUCTS_PER_PAGE } from '../utils/constants.js';
import { NotFoundError } from '../utils/errors.js';

const Schema = mongoose.Schema;

const userSchema = new Schema<IUserDocument>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long'],
    maxlength: [50, 'First name cannot exceed 50 characters'],
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: 'First name must contain only letters and spaces',
    },
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters long'],
    maxlength: [50, 'Last name cannot exceed 50 characters'],
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z\s]+$/.test(v);
      },
      message: 'Last name must contain only letters and spaces',
    },
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    unique: true,
    lowercase: true, // Normalize to lowercase
    validate: {
      validator: function (v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email address format',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Do not return password in queries by default
  },
  resetToken: {
    type: String,
    select: false, // Do not return resetToken in queries by default,
  },
  resetTokenExpiration: {
    type: Date,
    select: false, // Do not return resetTokenExpiration in queries by default
  },
  // Cart structure
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        dateAdded: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
});

userSchema.methods.getCart = async function (this: IUserDocument) {
  return this.cart;
};

userSchema.methods.getPopulatedCart = async function (
  this: IUserDocument
): Promise<PopulatedCart> {
  const populatedItems = [];

  for (const item of this.cart.items) {
    const product = await Product.findById(item.productId);
    if (product) {
      populatedItems.push({
        productId: item.productId,
        product: product.toObject(),
        quantity: item.quantity,
        dateAdded: item.dateAdded,
      });
    }
    // If product is not found, we skip it (it may have been deleted)
  }

  // Recalculate totals based on existing products
  const totalQuantity = populatedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalPrice = populatedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Update the cart if totals have changed (due to missing products)
  if (
    this.cart.totalQuantity !== totalQuantity ||
    this.cart.totalPrice !== totalPrice
  ) {
    this.cart.items = populatedItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      dateAdded: item.dateAdded,
    }));
    this.cart.totalQuantity = totalQuantity;
    this.cart.totalPrice = totalPrice;
    this.cart.lastUpdated = new Date();
    await this.save();
  }

  return {
    items: populatedItems,
    totalQuantity,
    totalPrice,
    lastUpdated: this.cart.lastUpdated,
  };
};

userSchema.methods.addToCart = async function (
  this: IUserDocument,
  product: IProduct,
  quantity = 1
) {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  const itemIndex = this.cart.items.findIndex(
    (item: CartItem) => item.productId.toString() === product._id.toString()
  );

  if (itemIndex > -1) {
    // Item already exists in the cart, update quantity
    this.cart.items[itemIndex].quantity += quantity;
  } else {
    // Item does not exist, add new item
    this.cart.items.push({
      productId: new mongoose.Types.ObjectId(product._id),
      quantity,
      dateAdded: new Date(),
    });
  }

  this.cart.totalQuantity += quantity;
  this.cart.totalPrice += product.price * quantity;
  this.cart.lastUpdated = new Date();

  await this.save();
};

userSchema.methods.deleteItemFromCart = async function (
  this: IUserDocument,
  productId: string
) {
  const itemIndex = this.cart.items.findIndex(
    (item: CartItem) => item.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) throw new NotFoundError('Item not found in cart'); // Item not found in cart

  const productPrice = await Product.findById(productId).select('price');

  // if quantity is greater than 1, just reduce the quantity
  if (this.cart.items[itemIndex].quantity > 1)
    this.cart.items[itemIndex].quantity -= 1;
  // if quantity is 1, remove the item from the cart
  else this.cart.items.splice(itemIndex, 1);

  this.cart.totalQuantity -= 1;
  this.cart.totalPrice -= productPrice ? productPrice.price : 0;
  this.cart.lastUpdated = new Date();

  await this.save();
};

userSchema.methods.clearCart = async function (this: IUserDocument) {
  this.cart.items = [];
  this.cart.totalQuantity = 0;
  this.cart.totalPrice = 0;
  this.cart.lastUpdated = new Date();

  await this.save();
};

userSchema.methods.placeOrder = async function (this: IUserDocument) {
  if (!this.cart || this.cart.items.length === 0)
    throw new Error(`Cart is empty`);

  // Validate cart totals
  if (this.cart.totalQuantity <= 0 || this.cart.totalPrice <= 0)
    throw new Error(`Cart totals are invalid`);

  // Get populated cart items
  const cartItems = await this.getPopulatedCart();
  const orderItems: OrderItem[] = cartItems.items.map(
    (item: PopulatedCart['items'][number]) => ({
      productName: item.product.name,
      productPrice: item.product.price,
      image_url: String(item.product.image), // Image is an S3 URL string
      productId: item.productId,
      quantity: item.quantity,
      dateAdded: item.dateAdded,
    })
  );

  // Create a new order document
  const order = new Order({
    userId: this._id,
    items: orderItems,
    status: 'pending',
    createdAt: new Date(),
    totalPrice: this.cart.totalPrice,
  });

  // Save the order
  await order.save();

  // Clear the cart after placing order
  await this.clearCart();

  await this.save();
};

userSchema.methods.getOrders = async function (this: IUserDocument) {
  // Get orders from the Order collection for this user
  const orders = await Order.find({ userId: this._id }).exec();
  return orders;
};

userSchema.methods.getCreatedProducts = async function (
  this: IUserDocument,
  page: number = 1
) {
  // Get total count of products created by this user
  const totalProducts = await Product.find({
    userId: this._id,
  }).countDocuments();
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  // Get products created by this user for the current page
  const products = await Product.find({ userId: this._id })
    .skip(page > 0 ? (page - 1) * PRODUCTS_PER_PAGE : 0)
    .limit(PRODUCTS_PER_PAGE)
    .sort({ createdAt: -1 });

  return {
    products,
    totalPages: totalPages > 0 ? totalPages : 0,
    totalProducts,
    currentPage: page,
  };
};

export const User = mongoose.model<IUserDocument>('User', userSchema);
