import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { usePasswordReset } from '../api/auth';
import PageLayout from '../components/layouts/PageLayout';
export default function PasswordReset() {
  const { mutate: resetPassword, error, isPending } = usePasswordReset();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLFormElement;
    const email = e.currentTarget.email.value.trim();
    if (isPending) return; // Prevent multiple submissions
    resetPassword(email, {
      onSuccess: () => {
        target.reset(); // Reset the form on success
      },
    });
  };
  return (
    <PageLayout title='Reset Password'>
      <Form onSubmit={onSubmit}>
        <Input
          autoFocus
          isRequired
          autoComplete='email'
          description='A password reset link will be sent to this email address.'
          isDisabled={isPending}
          isInvalid={error ? true : false}
          label='Email Address'
          labelPlacement='outside'
          name='email'
          radius='sm'
          type='email'
          variant='bordered'
          errorMessage={
            error ? error.message : 'Please enter a valid email address'
          }
        />
        <Button color='primary' isLoading={isPending} radius='sm' type='submit'>
          Send
        </Button>
      </Form>
    </PageLayout>
  );
}
