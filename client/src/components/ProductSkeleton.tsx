import { Card } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';

export default function ProductSkeleton() {
  return (
    <Card className='w-[200px] space-y-5 p-4' radius='sm'>
      <Skeleton className='rounded-sm'>
        <div className='h-24 rounded-sm bg-default-300' />
      </Skeleton>
      <div className='space-y-3'>
        <Skeleton className='w-3/5 rounded-sm'>
          <div className='h-3 w-3/5 rounded-sm bg-default-200' />
        </Skeleton>
        <Skeleton className='w-4/5 rounded-sm'>
          <div className='h-3 w-4/5 rounded-sm bg-default-200' />
        </Skeleton>
        <Skeleton className='w-2/5 rounded-sm'>
          <div className='h-3 w-2/5 rounded-sm bg-default-300' />
        </Skeleton>
      </div>
    </Card>
  );
}
