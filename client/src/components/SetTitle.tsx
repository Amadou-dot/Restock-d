import { useEffect } from 'react';

export default function SetTitle({
  title,
  cb,
}: {
  title: string;
  cb?: () => void;
}) {
  useEffect(() => {
    document.title = title;
    cb?.();
  }, [title, cb]);

  return null;
}
