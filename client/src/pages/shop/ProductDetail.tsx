import { useParams } from 'react-router-dom';
import { useProductById } from '../../api/products';
import { Spinner } from '@heroui/spinner';
import ErrorMessage from '../../components/ErrorMessage';

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id as string;
  const { data: product, isPending, error } = useProductById(productId);
  if (!productId) {
    return <p>Product ID is required.</p>;
  }
  return (
    <div className=''>
      {isPending && <Spinner title='Loading product...' />}
      {error && <ErrorMessage description={error.message} />}
      {!isPending && product && (
        <div className='max-w-2xl mx-auto p-4'>
          <h1 className='text-2xl font-bold mb-4'>{product.name}</h1>
          <hr className='my-5'/>
          <img
            alt={product.name}
            className='w-8/12 h-auto mb-4'
            src={product.image}
          />
          <p className='text-lg mb-4'>{product.description}</p>
          <p className='text-xl font-semibold text-yellow-600'>
            ${product.price.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
