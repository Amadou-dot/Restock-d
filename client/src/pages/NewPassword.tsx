import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { addToast } from '@heroui/toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useNewPassword } from '../api/auth';
import ErrorMessage from '../components/ErrorMessage';
import PageLayout from '../components/layouts/PageLayout';
import { useState } from 'react';
export default function NewPassword() {
  const { mutate: resetPassword, error, isPending } = useNewPassword();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordErrors: string[] = [];
  if (password.length < 6) {
    passwordErrors.push('Password must be 6 characters or more.');
  }
  if ((password.match(/[A-Z]/g) || []).length < 1) {
    passwordErrors.push('Password must include at least 1 upper case letter');
  }
  if ((password.match(/[^a-z0-9]/gi) || []).length < 1) {
    passwordErrors.push('Password must include at least 1 symbol.');
  }

  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as {
      password: string;
      confirmPassword: string;
    };
    if (data.password !== data.confirmPassword)
      return addToast({
        title: 'Passwords do not match',
        description: 'Please ensure both password fields match.',
        color: 'danger',
      });
    if (isPending) return;
    resetPassword(
      { ...data, token: token || '' },
      {
        onSuccess: () => navigate('/login'),
      }
    );
  };
  return (
    <PageLayout title='New Password'>
      <Form onSubmit={handleSubmit}>
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
          // errorMessage='Passwords do not match'
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
        <Button color='primary' isLoading={isPending} radius='sm' type='submit'>
          Change Password
        </Button>
        {error && <ErrorMessage description={error.message} />}
      </Form>
    </PageLayout>
  );
}
