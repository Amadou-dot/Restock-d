import { Alert, type AlertProps } from '@heroui/alert';

export default function ErrorMessage(props: AlertProps) {
  return <Alert title='Error' {...props} isClosable color='danger' variant='faded'/>;
}
