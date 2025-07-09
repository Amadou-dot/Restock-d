import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input, Textarea } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import type { ObjectId } from 'mongoose';
import { useState } from 'react';
import type { Product, ProductInput } from '../../../types/Product';
import ErrorMessage from './ErrorMessage';

export interface ProductFormEditData extends ProductInput {
  _id: ObjectId | string;
}
interface ProductFormProps {
  product?: Product;
  onSubmit: (
    data: Omit<ProductInput, 'userId'> | ProductFormEditData | FormData,
    target?: HTMLFormElement
  ) => void;
  isPending?: boolean;
  error?: Error | null;
  submitButtonText: string;
  showError?: boolean;
  className?: string;
  requireImage?: boolean;
}

export default function ProductForm({
  product,
  onSubmit,
  isPending = false,
  error,
  submitButtonText,
  showError = true,
  className = 'flex flex-col gap-4',
  requireImage = false,
}: ProductFormProps) {
  const [productName, setProductName] = useState(product?.name || '');
  const [productPrice, setProductPrice] = useState(product?.price || 0);
  const [productDesc, setProductDesc] = useState(product?.description || '');
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    if (isPending) return;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice.toString());
    formData.append('description', productDesc);

    if (image) {
      formData.append('image', image);
    }

    // if product is provided, we assume it's an edit operation
    if (product) {
      formData.append('_id', product._id.toString());
      formData.append('userId', product.userId);
      onSubmit(formData);
    } else {
      // otherwise, it's a create operation
      onSubmit(formData, target);
    }
  };

  return (
    <Form
      className={className}
      encType='multipart/form-data'
      onSubmit={handleSubmit}>
      {showError && error && <ErrorMessage description={error.message} />}
      <Input
        autoFocus
        isRequired
        disabled={isPending}
        errorMessage='Product name is required'
        label='Product Name'
        labelPlacement='outside'
        name='productName'
        radius='sm'
        value={productName}
        variant='bordered'
        onValueChange={setProductName}
      />
      <NumberInput
        hideStepper
        isRequired
        disabled={isPending}
        errorMessage='Product price is required and must be a number'
        isInvalid={isNaN(productPrice)}
        label='Product Price'
        labelPlacement='outside'
        minValue={0}
        name='productPrice'
        radius='sm'
        value={productPrice}
        variant='bordered'
        startContent={
          <span className='text-gray-500 pointer-events-none'>$</span>
        }
        onValueChange={setProductPrice}
      />
      <Textarea
        isRequired
        disabled={isPending}
        errorMessage='Product description is required'
        label='Product Description'
        labelPlacement='outside'
        name='productDesc'
        radius='sm'
        rows={4}
        value={productDesc}
        variant='bordered'
        onValueChange={setProductDesc}
      />
      <Input
        accept='image/jpeg,image/png,image/jpg'
        disabled={isPending}
        errorMessage='An image is required'
        isRequired={requireImage}
        label='Image'
        labelPlacement='outside'
        name='image'
        radius='sm'
        type='file'
        variant='bordered'
        onChange={handleFileChange}
      />
      <Button
        className='self-end'
        color='primary'
        isLoading={isPending}
        radius='sm'
        size='lg'
        type='submit'>
        {submitButtonText}
      </Button>
    </Form>
  );
}
