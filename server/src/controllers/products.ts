import { Request, Response, Router } from 'express';
import { Product } from '../models/product.js';
import { PRODUCTS_PER_PAGE } from '../utils/constants.js';
import { NotFoundError, sendErrorResponse } from '../utils/errors.js';
import { MESSAGES, sendSuccessResponse } from '../utils/responses.js';

const router = Router();

router.get('/getProducts', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;

  try {
    const totalProducts = await Product.countDocuments({});
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
    
    const products = await Product.find({})
      .skip(page > 0 ? (page - 1) * PRODUCTS_PER_PAGE : 0)
      .limit(PRODUCTS_PER_PAGE)
      .sort({ createdAt: -1 });

    const response = {
      products,
      totalPages: totalPages > 0 ? totalPages : 0,
      totalProducts,
      currentPage: page,
    };

    return sendSuccessResponse(res, MESSAGES.PRODUCTS_RETRIEVED, response);
  } catch (error) {
    return sendErrorResponse(error, res, 'fetching products');
  }
});

router.get('/getProduct/:id', async (req: Request, res: Response) => {
  const productId = req.params.id;

  try {
    if (!productId) throw new NotFoundError('Product ID is required');
    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError(`Product not found`);

    return sendSuccessResponse(res, MESSAGES.PRODUCT_RETRIEVED, product);
  } catch (error) {
    return sendErrorResponse(error, res, 'fetching product');
  }
});
export const productsRouter = router;
