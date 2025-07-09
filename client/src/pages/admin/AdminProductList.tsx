import { Pagination } from '@heroui/pagination';
import { useSearchParams } from 'react-router-dom';
import { useAdminProducts } from '../../api/products';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingCards from '../../components/LoadingCards';
import Message from '../../components/Message';
import { AuthProtected } from '../../utils/authUtils';
import AdminProductCard from './AdminProductCard';
export default function AdminProductList() {

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');

  const {
    data: productsData,
    isPending,
    error,
  } = useAdminProducts(currentPage);

  const products = productsData?.products || [];
  const totalPages = productsData?.totalPages || 0;

  if (currentPage > totalPages && totalPages > 0) {
    setSearchParams({ page: '1' });
  }

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };
  return (
    <>
      <title>Admin Products</title>
      <meta content='Manage your products' name='description' />
      <AuthProtected title='Admin Products'>
        <div className='flex flex-wrap gap-8'>
          {isPending && <LoadingCards />}
          {!isPending &&
            !error &&
            products &&
            products.length > 0 &&
            products.map(product => (
              <AdminProductCard
                key={product._id.toString()}
                product={product}
              />
            ))}

          {!isPending && !error && products.length === 0 && (
            <Message
              description='You have not added any products yet.'
              // title='No Products Found'
            />
          )}

          {!isPending && error && <ErrorMessage description={error.message} />}
        </div>
        {!isPending && !error && totalPages > 1 && (
          <Pagination
            showControls
            className='w-full self-center'
            isDisabled={isPending}
            page={currentPage}
            total={totalPages}
            onChange={handlePageChange}
          />
        )}
      </AuthProtected>
    </>
  );
}
