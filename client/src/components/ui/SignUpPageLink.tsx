import { Link } from 'react-router-dom';

export default function SignUpPageLink() {
  return (
    <p className='text-sm text-gray-500 mt-2'>
      Need an account?{' '}
      <Link className='text-blue-600 hover:underline' to='/signup'>
        Sign up
      </Link>
    </p>
  );
}
