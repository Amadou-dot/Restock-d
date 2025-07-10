import { Spinner } from '@heroui/spinner';
import { useCart } from '../../api/cart';
import { AuthProtected } from '../../utils/authUtils';
import { Alert } from '@heroui/alert';
import { CartList } from './Cart';
import PlaceOrderBtn from '../../components/ui/PlaceOrderBtn';

export default function Checkout() {
  const { data: cart, isLoading, error } = useCart();

  return (
    <>
      <title>Checkout</title>
      <meta content='Your checkout page' name='description' />
      <AuthProtected title='Checkout'>
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
                    {cart.items.length}{' '}
                    {cart.items.length === 1 ? 'item' : 'items'}
                  </h2>
                  <div className='text-right'>
                    <p className='text-sm text-gray-500'>Total</p>
                    <p className='text-2xl font-bold text-gray-900'>
                      ${cart.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <CartList canModify={false} cartItems={cart.items} />
                <div className='mt-8 p-6 bg-gray-50 rounded-lg'>
                  <div className='flex gap-3'>
                    <PlaceOrderBtn />
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
