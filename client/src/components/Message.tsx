import { Alert, type AlertProps } from '@heroui/alert';

export default function Message(props?: AlertProps) {
  return <Alert {...props} color='primary' />;
}
