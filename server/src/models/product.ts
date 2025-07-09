import mongoose from 'mongoose';
import type { IProduct } from '../../../types/Product.js';

const Schema = mongoose.Schema;

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [1, 'Product name cannot be empty'],
    maxlength: [200, 'Product name cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [1, 'Product description cannot be empty'],
    maxlength: [2000, 'Product description cannot exceed 2000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0.01, 'Price must be a positive number'],
    max: [999999.99, 'Price cannot exceed 999,999.99'],
  },
  image: {
    type: String, // S3 key for image
    required: [true, 'Image is required'],
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
  },
  //     const urlPattern = /^https?:\/\/.+\..+/;
  //     return urlPattern.test(v);
  //   },
  //   message: 'Invalid image URL format'
  // }
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
