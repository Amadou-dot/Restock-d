import { AuthProtected } from '../../utils/authUtils';

export default function Checkout() {
  return <AuthProtected title='Checkout'>Checkout</AuthProtected>;
}
