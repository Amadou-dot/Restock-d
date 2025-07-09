import { Alert, type AlertProps } from '@heroui/alert';

export default function WarningMessage(props: AlertProps) {
  return <Alert {...props} color='warning' variant='faded' />;
}
