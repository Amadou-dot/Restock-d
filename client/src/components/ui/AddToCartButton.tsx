import { IoCartOutline } from 'react-icons/io5';
import { useAddToCart } from '../../api/cart';
import { Spinner } from '@heroui/spinner';
export default function AddToCartButton({ productId }: { productId: string }) {
  const { mutate: addItem, isPending } = useAddToCart();
  return isPending ? (
    <Spinner color='default'/>
  ) : (
    <IoCartOutline size={24} onClick={() => addItem(productId)} />
  );
}
