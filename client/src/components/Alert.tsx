import { Alert as HeroAlert, type AlertProps } from '@heroui/alert';

export default function Alert(props: AlertProps) {
  return <HeroAlert {...props} hideIcon />;
}
