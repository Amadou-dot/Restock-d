import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { usePlaceOrder } from '../../api/orders';

export default function PlaceOrderBtn() {
  const { mutate: placeOrder, isPending, error, isError } = usePlaceOrder();
  if (error) {
    addToast({
      title: 'Error placing order',
      description: error.message,
      color: 'danger',
    });
  }
  return (
    <Button
      className='flex-1 '
      color='primary'
      disabled={isError}
      isLoading={isPending}
      radius='sm'
      size='lg'
      type='submit'
      onPress={() => placeOrder()}>
      Place Order
    </Button>
  );
}
