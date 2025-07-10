import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';
import type { PopulatedCartItem } from '../types/Cart';

import { Button } from '@heroui/button';
import { useAddToCart, useRemoveFromCart } from '../api/cart';
import { FaMinus, FaPlus } from 'react-icons/fa6';

export default function CartItemCard({
  item,
  canModify = true,
}: {
  item: PopulatedCartItem;
  canModify?: boolean;
}) {
  const { mutate: addToCart, isPending: isLoading, error } = useAddToCart();
  const {
    mutate: decreaseQuantity,
    isPending: isLoading2,
    error: err,
  } = useRemoveFromCart();
  const hasError = !!error || !!err;
  if (hasError) {
    return (
      <Card
        className='hover:shadow-md transition-shadow duration-200'
        radius='none'
        shadow='sm'>
        <CardBody>
          <div className='text-red-500 text-center'>
            {error?.message || err?.message || 'An error occurred'}
          </div>
        </CardBody>
      </Card>
    );
  }
  const isPending = isLoading || isLoading2;
  const handleAddToCart = () => {
    addToCart(item.product._id.toString());
  };
  const handleDecreaseQuantity = () => {
    decreaseQuantity(item.product._id.toString());
  };
  const product = item.product;
  const totalPrice = product.price * item.quantity;
  return (
    <Card
      className='hover:shadow-md transition-shadow duration-200'
      radius='none'
      shadow='sm'>
      <CardBody>
        <div className='flex items-stretch'>
          {/* Product Image */}
          <div className='flex-shrink-0'>
            <Image
              alt={product.name}
              className='object-cover h-full'
              radius='none'
              shadow='sm'
              src={product.image}
              width={80}
            />
          </div>
          {/* Product Details */}
          <div className='flex-1 min-w-0 px-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900 truncate'>
                {product.name}
              </h3>
              <div className='flex items-center gap-2'>
                {canModify && (
                  <>
                    <Button
                      color='primary'
                      disabled={isPending}
                      size='sm'
                      onPress={handleDecreaseQuantity}>
                      <FaMinus size={12} />
                    </Button>
                    <p>{item.quantity}</p>
                    <Button
                      color='primary'
                      disabled={isPending}
                      size='sm'
                      onPress={handleAddToCart}>
                      <FaPlus size={12} />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <p className='text-sm text-gray-500 mt-1 line-clamp-2'>
              {product.description}
            </p>
            <div className='flex items-center gap-2 mt-2'>
              <span className='text-lg font-bold text-gray-900'>
                ${totalPrice.toFixed(2)}
              </span>
              {item.quantity > 1 && (
                <span className='text-sm text-gray-500'>
                  (${product.price.toFixed(2)} each)
                </span>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
