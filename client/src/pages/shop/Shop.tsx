import { Pagination } from '@heroui/pagination';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../api/products';
import ErrorMessage from '../../components/ErrorMessage';
import PageLayout from '../../components/layouts/PageLayout';
import LoadingCards from '../../components/LoadingCards';
import Message from '../../components/Message';
import ProductCard from '../../components/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');

  const { data: productsData, isPending, error } = useProducts(currentPage);

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
      <title>Shop</title>
      <meta content='Browse our products' name='description' />
      <PageLayout title='Shop'>
        <div className='flex flex-wrap gap-12'>
          {!isPending && !error && products && products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product._id.toString()} product={product} />
            ))
          ) : (
            <>
              {isPending && <LoadingCards />}
              {error && <ErrorMessage description={error.message} />}

              {!isPending && products.length === 0 && !error && (
                <Message title='No Products Found' />
              )}
            </>
          )}
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
      </PageLayout>
    </>
  );
}
