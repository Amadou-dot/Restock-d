import dotenv from 'dotenv';
import { NextFunction, Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import Stripe from 'stripe';
import { handleValidationErrors } from '../middleware/handleValidationErrors.js';
import { isAuth } from '../middleware/isAuth.js';
import { validateOrderId } from '../middleware/orderValidators.js';
import { Order } from '../models/order.js';
import { uploadPDFToS3Bucket } from '../utils/AWSBucket.js';
import { NotFoundError, sendErrorResponse, UnauthorizedError, ValidationError } from '../utils/errors.js';
import { getUser } from '../utils/getUser.js';
import { MESSAGES, sendSuccessResponse } from '../utils/responses.js';

// Load environment variables
dotenv.config();

// Ensure environment variables are loaded
if (!process.env.STRIPE_SECRET_KEY || !process.env.CLIENT_URL) {
  throw new Error(
    'STRIPE_SECRET_KEY and CLIENT_URL environment variables are required'
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = Router();

router.use(isAuth);
router.use(handleValidationErrors);

router.post('/placeOrder', async (req: Request, res: Response) => {
  const user = await getUser(req);
  try {
    if (!user) throw new ValidationError('User not authenticated');
    const items = (await user.getPopulatedCart()).items;
    if (items.length === 0) throw new ValidationError('Cart is empty');

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,

      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            // Include images since they are valid S3 URLs
            // images: item.product.image ? [item.product.image] : [],
          },
          unit_amount: Math.round(item.product.price * 100), // Stripe expects amount in cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout/success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    return sendSuccessResponse(res, MESSAGES.ORDER_PLACED, {
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return sendErrorResponse(error, res, 'placing order');
  }
});

router.get('/getOrders', async (req: Request, res: Response) => {
  try {
    const user = await getUser(req);
    const orders = await user.getOrders();
    return sendSuccessResponse(res, MESSAGES.ORDERS_RETRIEVED, orders);
  } catch (error) {
    return sendErrorResponse(error, res, 'retrieving orders');
  }
});

router.get('/getOrder/:id', async (req: Request, res: Response) => {
  const orderId = req.params.id;

  try {
    if (!orderId) throw new Error('Order ID is required');
    const user = await getUser(req);
    const orders = await user.getOrders();
    const order = orders.find(o => o._id.toString() === orderId.toString());

    if (!order) throw new NotFoundError(`Order not found`);

    return sendSuccessResponse(res, MESSAGES.ORDER_RETRIEVED, order);
  } catch (error) {
    return sendErrorResponse(error, res, 'retrieving order');
  }
});

router.get(
  '/getInvoice/:id',
  validateOrderId,
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    try {
      const user = await getUser(req);
      const orders = await user.getOrders();
      const order = orders.find(o => o._id.toString() === orderId.toString());

      if (!order) throw new NotFoundError(`Order not found`);
      if (!order.userId.equals(new mongoose.Types.ObjectId(user.id)))
        throw new UnauthorizedError(`Unauthorized access`);

      // Check if invoice URL already exists
      if (order.invoiceUrl) {
        return sendSuccessResponse(res, 'Invoice URL retrieved', {
          invoiceUrl: order.invoiceUrl,
        });
      }

      // Generate invoice PDF as buffer
      const invoiceName = `invoice_${orderId}.pdf`;
      const pdfDoc = new PDFDocument();
      const chunks: Buffer[] = [];

      pdfDoc.on('data', chunk => chunks.push(chunk));
      pdfDoc.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);

          // Upload PDF to S3 and get the URL
          const invoiceUrl = await uploadPDFToS3Bucket(pdfBuffer, invoiceName);

          // Update the order with the invoice URL
          await Order.findByIdAndUpdate(orderId, { invoiceUrl });

          return sendSuccessResponse(res, 'Invoice generated and uploaded', {
            invoiceUrl,
          });
        } catch (uploadError) {
          console.error('Error uploading invoice:', uploadError);
          return sendErrorResponse(uploadError, res, 'uploading invoice');
        }
      });

      // Generate PDF content
      pdfDoc
        .fontSize(20)
        .text(`Invoice for Order #${orderId}`, { align: 'center' });
      pdfDoc.moveDown();
      pdfDoc.fontSize(14).text(`User: ${user.firstName} ${user.lastName}`);
      pdfDoc.moveDown();
      pdfDoc.text(
        `Order Date: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}`
      );
      pdfDoc.moveDown();
      pdfDoc.text('Items:', { underline: true });

      // Add order items
      let total = 0;
      order.items.forEach((item, index) => {
        const itemTotal = item.quantity * item.productPrice;
        total += itemTotal;
        pdfDoc.text(
          `${index + 1}. ${item.productName} - Qty: ${item.quantity} x $${item.productPrice} = $${itemTotal.toFixed(2)}`
        );
      });

      pdfDoc.moveDown();
      pdfDoc
        .fontSize(16)
        .text(`Total: $${total.toFixed(2)}`, { align: 'right' });

      pdfDoc.end();
    } catch (error) {
      next(error);
    }
  }
);

export const orderRouter = router;
