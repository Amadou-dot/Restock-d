import { Button } from '@heroui/button';
import { FaTrash } from 'react-icons/fa6';
import { useRemoveFromCart } from '../../api/cart';
import { addToast } from '@heroui/toast';

export default function RemoveCartItemBtn({
  productId,
}: {
  productId: string;
}) {
  const { mutate: removeItemFromCart, isPending, error } = useRemoveFromCart();
  if (error)
    addToast({
      title: 'Error',
      description: error.message,
      color: 'warning',
    });
  return (
    <Button
      color='danger'
      isLoading={isPending}
      radius='sm'
      size='sm'
      startContent={<FaTrash />}
      variant='light'
      onPress={() => removeItemFromCart(productId)}>
      Remove
    </Button>
  );
}
