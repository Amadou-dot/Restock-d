import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Image } from '@heroui/image';
import { Spinner } from '@heroui/spinner';
import { IoHeartOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';
import { useAuthStatus } from '../api/auth';
import AddToCartButton from './ui/AddToCartButton';

const TEXTCUT_LENGTH = 190;

interface ProductCardProps {
  product: Product;
  variant?: 'customer' | 'admin';
  adminActions?: React.ReactNode;
  onCardClick?: () => void;
}

export default function ProductCard({ 
  product, 
  variant = 'customer', 
  adminActions,
  onCardClick 
}: ProductCardProps) {
  const navigate = useNavigate();
  const { data: authData, isLoading } = useAuthStatus();
  const isLoggedIn = authData?.isLoggedIn || false;
  
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick();
    } else if (variant === 'customer') {
      navigate(`/products/${product._id}`);
    }
  };
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event
  };

  const isClickable = variant === 'customer' || !!onCardClick;

  return (
    <Card
      className='w-64 max-w-sm my-4'
      isPressable={isClickable}
      radius='none'
      shadow='sm'
      onPress={isClickable ? handleCardClick : undefined}>
      <CardHeader className='text-lg font-semibold flex flex-col items-center'>
        <h3>{product.name}</h3>
      </CardHeader>

      <CardBody>
        <Image
          alt={product.name}
          className='w-full object-cover h-80'
          radius='sm'
          shadow='sm'
          src={product.image}
          width='100%'
        />
      </CardBody>
      <CardFooter className='flex flex-col gap-2 items-center'>
        <p>{`${
          product.description.length > TEXTCUT_LENGTH
            ? `${product.description.slice(0, TEXTCUT_LENGTH)}...`
            : product.description
        }`}</p>

        <div className='flex justify-between w-full items-center'>
          <p className='text-yellow-600 font-bold text-lg'>
            ${product.price.toFixed(2)}
          </p>

          {variant === 'customer' && (
            <div className='flex gap-4' onClick={handleButtonClick}>
              {isLoading && <Spinner />}
              {isLoggedIn ? (
                <>
                  <AddToCartButton productId={product._id.toString()} />
                  <IoHeartOutline color='red' size={24} />
                </>
              ) : null}
            </div>
          )}

          {variant === 'admin' && adminActions && (
            <div onClick={handleButtonClick}>
              {adminActions}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
