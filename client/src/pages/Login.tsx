import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../api/auth';
import ErrorMessage from '../components/ErrorMessage';
import PageLayout from '../components/layouts/PageLayout';
import ResetPageLink from '../components/ui/ResetPageLink';
import SignUpPageLink from '../components/ui/SignUpPageLink';

export default function Login() {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dataObj = Object.fromEntries(formData.entries());

    if (isPending) return; // Prevent multiple submissions

    login(dataObj as { email: string; password: string }, {
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <>
      <title>Login</title>
      <meta content='Login to your account' name='description' />
      <PageLayout className='max-w-lg mx-auto' title='Login'>
        <Form onSubmit={handleSubmit}>
          <Input
            isRequired
            autoComplete='email'
            errorMessage='Please enter a valid email address'
            label='Email Address'
            labelPlacement='outside'
            name='email'
            radius='sm'
            type='email'
            variant='bordered'
          />
          <Input
            isRequired
            autoComplete='current-password'
            label='Password'
            labelPlacement='outside'
            name='password'
            radius='sm'
            type='password'
            variant='bordered'
          />
          <Button
            fullWidth
            className='mt-4'
            color='primary'
            isLoading={isPending}
            radius='sm'
            type='submit'>
            {isPending ? 'Signing in...' : 'Login'}
          </Button>
          {error && <ErrorMessage description={error.message} />}
          <div className='flex justify-between mt-4 w-full'>
            {!error && <ResetPageLink />}
            {!error && <SignUpPageLink />}
          </div>
        </Form>
      </PageLayout>
    </>
  );
}
