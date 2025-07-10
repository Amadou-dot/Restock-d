import { Button } from '@heroui/button';
import { Link } from 'react-router-dom';
export default function CheckoutPageLink() {
  return (
    <Button
      as={Link}
      className='flex-1 '
      color='primary'
      id='checkout-button'
      radius='sm'
      size='lg'
      to='/checkout'
      type='button'>
      Go to Checkout
    </Button>
  );
}
