import { param } from 'express-validator';
export const validateOrderId = param('id').isMongoId().withMessage('Invalid order ID');
