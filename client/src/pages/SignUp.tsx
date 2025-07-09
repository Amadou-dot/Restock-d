import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useSignUp } from '../api/auth';
import ErrorMessage from '../components/ErrorMessage';
import PageLayout from '../components/layouts/PageLayout';
import LoginPageLink from '../components/ui/LoginPageLink';

export default function SignUp() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { mutate: signUp, isPending: isPending1, error: err1 } = useSignUp();
  const { mutate: login, isPending: isPending2, error: err2 } = useLogin();
  const passwordErrors: string[] = [];
  const isPending = isPending1 || isPending2;
  const error = err1 || err2;
  if (password.length < 6) {
    passwordErrors.push('Password must be 6 characters or more.');
  }
  if ((password.match(/[A-Z]/g) || []).length < 1) {
    passwordErrors.push('Password must include at least 1 upper case letter');
  }
  if ((password.match(/[^a-z0-9]/gi) || []).length < 1) {
    passwordErrors.push('Password must include at least 1 symbol.');
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dataObj = Object.fromEntries(formData.entries());

    signUp(
      {
        firstName: dataObj.firstName as string,
        lastName: dataObj.lastName as string,
        email: dataObj.email as string,
        password: dataObj.password as string,
        confirmPassword: dataObj.confirmPassword as string,
      },
      {
        onSuccess: () => {
          login(
            {
              email: dataObj.email as string,
              password: dataObj.password as string,
            },
            {
              onSuccess: () => {
                navigate('/');
              },
            }
          );
        },
      }
    );
  };
  return (
    <>
    <title>Sign Up</title>
    <meta content='Create a new account' name='description' />
    <PageLayout className='max-w-lg mx-auto' title='Sign Up'>
      <Form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
          <Input
            isRequired
            autoComplete='first-name'
            errorMessage='Please enter a valid name'
            label='First Name'
            labelPlacement='outside'
            name='firstName'
            radius='sm'
            variant='bordered'
          />
          <Input
            isRequired
            autoComplete='last-name'
            errorMessage='Please enter a valid name'
            label='Last Name'
            labelPlacement='outside'
            name='lastName'
            radius='sm'
            variant='bordered'
          />
        </div>
        <Input
          isRequired
          autoComplete='new-email'
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
          autoComplete='new-password'
          isInvalid={passwordErrors.length > 0}
          label='Password'
          labelPlacement='outside'
          name='password'
          radius='sm'
          type='password'
          value={password}
          variant='bordered'
          errorMessage={() => (
            <ul>
              {passwordErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
          onValueChange={setPassword}
        />
        <Input
          isRequired
          autoComplete='off'
          label='Confirm Password'
          labelPlacement='outside'
          name='confirmPassword'
          radius='sm'
          type='password'
          value={confirmPassword}
          variant='bordered'
          validate={(value: string) =>
            value === password || 'Passwords do not match'
          }
          onValueChange={setConfirmPassword}
        />
        <Button
          fullWidth
          color='primary'
          isLoading={isPending}
          radius='sm'
          type='submit'>
          {isPending ? 'Signing up...' : 'Sign up'}
        </Button>
        {error && <ErrorMessage description={error.message} />}
        {!error && <LoginPageLink />}
      </Form>
    </PageLayout></>
  );
}
