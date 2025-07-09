import { Alert } from '@heroui/alert';
import { Spinner } from '@heroui/spinner';
import { useOrders } from '../../api/orders';
import ErrorMessage from '../../components/ErrorMessage';
import OrderCard from '../../components/OrderCard';
import { AuthProtected } from '../../utils/authUtils';

export default function Orders() {
  const { data: orders, isPending, error } = useOrders();

  return (
    <>
      <title>Orders</title>
      <meta content='Your order history' name='description' />
      <AuthProtected title='Orders'>
        <div className='flex flex-col items-center justify-center gap-4'>
          {isPending && <Spinner className='mt-4' />}
          {error && <ErrorMessage description={error.message} />}
          {orders && orders.length === 0 && (
            <Alert color='primary' description='No orders found.' />
          )}
          {!isPending &&
            orders &&
            orders.map(order => (
              <OrderCard key={order._id.toString()} order={order} />
            ))}
        </div>
      </AuthProtected>
    </>
  );
}
