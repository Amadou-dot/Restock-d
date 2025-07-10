import { Button } from '@heroui/button';
import { usePlaceOrder } from '../../api/orders';

export default function PlaceOrderBtn() {
  const { mutate: placeOrder, isPending, isError } = usePlaceOrder();
  
  const handlePlaceOrder = async () => {
    placeOrder(undefined, {
      onSuccess: (data) => {
        // Redirect to Stripe checkout URL
        if (data?.url) {
          window.location.href = data.url;
        }
      },
      onError: (error) => {
        console.error('Error placing order:', error);
      }
    });
  };

  return (
    <Button
      className='flex-1 '
      color='primary'
      disabled={isError}
      isLoading={isPending}
      radius='sm'
      size='lg'
      type='submit'
      onPress={handlePlaceOrder}>
      Place Order
    </Button>
  );
}
