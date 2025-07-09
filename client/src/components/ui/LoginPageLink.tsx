import { Link } from 'react-router-dom';

export default function LoginPageLink() {
  return (
    <p className='text-sm text-gray-500 mt-2'>
      Already have an account?{' '}
      <Link className='text-blue-600 hover:underline' to='/login'>
        Login here
      </Link>
    </p>
  );
}
