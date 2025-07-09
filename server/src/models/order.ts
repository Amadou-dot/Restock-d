import mongoose, { type Document } from 'mongoose';
import type { IOrder } from '../../../types/Order.js';

const Schema = mongoose.Schema;

export interface IOrderDocument extends IOrder, Document {}

const orderSchema = new Schema<IOrderDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  items: [
    {
      productName: {
        type: String,
        required: true,
      },
      productPrice: {
        type: Number,
        required: true,
      },
      image_url: {
        type: String,
        required: true,
      },
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
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  invoiceUrl: {
    type: String,
    required: false, // Optional field for invoice URL
  },
});

export const Order = mongoose.model('Order', orderSchema);
