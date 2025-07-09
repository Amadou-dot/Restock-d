import { body } from 'express-validator';

// Security-focused validators - let Mongoose handle data validation
const validateProductName = body('name').trim().escape(); // Security: prevent XSS

const validateProductPrice = body('price').trim().escape(); // Security: prevent XSS

const validateProductDescription = body('description').trim().escape(); // Security: prevent XSS

const validateImage = body('image')
  .optional()
  .custom((value, { req }) => {
    // For file uploads, the image will be in req.file, not req.body.image
    if (req.file) {
      return true; // File upload is present
    }
    if (req.body.image && typeof req.body.image === 'string') {
      return true; // URL is present
    }
    throw new Error('Image is required');
  });

export const validateDeleteProduct = [
  body('id').trim().escape(), // Security: prevent XSS
];

export const validateProduct = [
  validateProductName,
  validateProductPrice,
  validateProductDescription,
  validateImage,
];

export const validateEditProduct = [
  validateProductName,
  validateProductPrice,
  validateProductDescription,
  validateImage,
  body('_id').trim().escape(), // Security: prevent XSS
];
