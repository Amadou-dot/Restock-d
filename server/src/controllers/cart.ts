import { json, Request, Response, Router } from 'express';
import { isAuth } from '../middleware/isAuth.js';
import { Product } from '../models/product.js';
import {
  NotFoundError,
  sendErrorResponse,
  ValidationError,
} from '../utils/errors.js';
import { getUser } from '../utils/getUser.js';
import { MESSAGES, sendSuccessResponse } from '../utils/responses.js';

const router = Router();
router.use(isAuth);

router.get('/getCart', async (req: Request, res: Response) => {
  try {
    const user = await getUser(req);
    const cart = await user.getPopulatedCart();
    sendSuccessResponse(res, MESSAGES.CART_RETRIEVED, cart);
  } catch (error) {
    return sendErrorResponse(error, res, 'retrieving cart');
  }
});

router.post('/addToCart', json(), async (req: Request, res: Response) => {
  const { productId, quantity = 1 } = req.body;
  try {
    const user = await getUser(req);
    if (quantity <= 0)
      throw new ValidationError('Quantity must be greater than 0');
    if (!productId) throw new ValidationError('Product ID is required');

    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError(`Product with not found`);
    await user.addToCart(product, quantity);
    sendSuccessResponse(
      res,
      MESSAGES.ITEM_ADDED_TO_CART,
      { productId, quantity },
      201,
      { item: { productId, quantity } }
    );
  } catch (error) {
    return sendErrorResponse(error, res, 'adding product to cart');
  }
});

router.delete(
  '/removeFromCart/:prodId',
  async (req: Request, res: Response) => {
    const { prodId } = req.params;
    try {
      const user = await getUser(req);
      if (!prodId) throw new ValidationError('Product ID is required');
      await user.deleteItemFromCart(prodId);
      sendSuccessResponse(res, MESSAGES.ITEM_REMOVED_FROM_CART, prodId, 200, {
        deletedId: prodId,
      });
    } catch (error) {
      return sendErrorResponse(error, res, 'removing product from cart');
    }
  }
);

router.delete('/clearCart', async (req: Request, res: Response) => {
  try {
    const user = await getUser(req);
    await user.clearCart();
    sendSuccessResponse(res, MESSAGES.CART_CLEARED);
  } catch (error) {
    return sendErrorResponse(error, res, 'clearing cart');
  }
});

export const cartRouter = router;
