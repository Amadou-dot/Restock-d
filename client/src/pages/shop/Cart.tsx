import { Spinner } from '@heroui/spinner';
import type { PopulatedCartItem } from '../../types/Cart';
import { useCart } from '../../api/cart';
import Alert from '../../components/Alert';
import CartItemCard from '../../components/CartItemCard';
import CheckoutPageLink from '../../components/ui/CheckoutPageLink';
import ClearCartBtn from '../../components/ui/ClearCartBtn';
import { AuthProtected } from '../../utils/authUtils';

export default function Cart() {
  const { data: cart, isLoading, error } = useCart();
  return (
    <>
      <title>Cart</title>
      <meta content='Your shopping cart' name='description' />
      <AuthProtected title='Cart'>
        {isLoading && <Spinner title='Loading cart...' />}
        {error && <Alert description={error.message} title='Error' />}{' '}
        {!isLoading && cart && (
          <div className='max-w-4xl mx-auto p-6'>
            {cart.items.length === 0 ? (
              <div className='text-center'>
                <Alert color='primary' description='Your cart is empty.' />
              </div>
            ) : (
              <div>
                {' '}
                <div className='mb-6 flex items-center justify-between'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Shopping Cart ({cart.items.length}{' '}
                    {cart.items.length === 1 ? 'item' : 'items'})
                  </h2>
                  <div className='text-right'>
                    <p className='text-sm text-gray-500'>Total</p>
                    <p className='text-2xl font-bold text-gray-900'>
                      ${cart.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <CartList cartItems={cart.items} />
                <div className='mt-8 p-6 bg-gray-50 rounded-lg'>
                  <div className='flex gap-3'>
                    <ClearCartBtn />
                    <CheckoutPageLink />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </AuthProtected>
    </>
  );
}

export const CartList = ({ cartItems, canModify }: { cartItems: PopulatedCartItem[], canModify?: boolean }) => {
  return (
    <div className='space-y-3'>
      {cartItems.map(item => (
        <CartItemCard key={item.productId.toString()} canModify={canModify} item={item} />
      ))}
    </div>
  );
};
