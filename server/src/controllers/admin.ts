import { json, NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import {
  validateDeleteProduct,
  validateEditProduct,
  validateProduct,
} from '../middleware/adminValidators.js';
import { handleValidationErrors } from '../middleware/handleValidationErrors.js';
import { isAuth } from '../middleware/isAuth.js';
import { Product } from '../models/product.js';
import {
  deleteImageFromS3Bucket,
  uploadImageToS3Bucket,
} from '../utils/AWSBucket.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { getUser } from '../utils/getUser.js';
import { MESSAGES, sendSuccessResponse } from '../utils/responses.js';
const router = Router();
router.use(json());
router.use(isAuth);
router.use(handleValidationErrors); // Global error handling for validation errors
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (_req, file, cb) => {
    // Accept only image files
    if (ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Only image files are allowed: ${file.mimetype}`));
    }
  },
});

// returns all products created by the user
router.get(
  '/getProducts',
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    try {
      const user = await getUser(req);
      const productData = await user.getCreatedProducts(page);
      sendSuccessResponse(res, MESSAGES.PRODUCTS_RETRIEVED, productData);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/addProduct',
  upload.single('image'), // Use multer to handle file uploads
  validateProduct,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.session.user?._id;
      if (!userId) throw new ValidationError('User not authenticated');

      if (!req.file) {
        throw new ValidationError('Image file is required');
      }

      const { name, price, description } = req.body;
      const imageUrl = await uploadImageToS3Bucket(req.file); // Upload and get S3 URL
      const product = await new Product({
        name,
        price,
        description,
        image: imageUrl, // Store the S3 URL directly
        userId: userId,
      }).save();

      sendSuccessResponse(res, MESSAGES.PRODUCT_ADDED, product, 201);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/editProduct',
  upload.single('image'), // Handle optional file upload
  validateEditProduct,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id, name, price, description } = req.body;

      const updateData: any = { name, price, description };

      // If a new image file is uploaded, upload to S3 and update the URL
      if (req.file) {
        const imageUrl = await uploadImageToS3Bucket(req.file);
        updateData.image = imageUrl; // Store the S3 URL
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        { _id, userId: req.session.user?._id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        throw new NotFoundError('Product not found');
      }

      sendSuccessResponse(res, MESSAGES.PRODUCT_UPDATED, updatedProduct);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/deleteProduct/:id',
  validateDeleteProduct,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await getUser(req);
      if (!user) throw new ValidationError('User not authenticated');

      try {
        await user.deleteItemFromCart(id);
      } catch (error) {} // Ignore errors if the product is not in the cart
      const result = await Product.findByIdAndDelete({
        _id: id,
        userId: user._id,
      });
      if (!result) throw new NotFoundError('Product not found');
      await deleteImageFromS3Bucket(result.image);

      sendSuccessResponse(res, MESSAGES.PRODUCT_DELETED, result.id, 200, {
        deletedId: result.id,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const adminRouter = router;
