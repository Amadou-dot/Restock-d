import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Image } from '@heroui/image';

import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@heroui/modal';
import { IoTrashOutline } from 'react-icons/io5';
import type { Product } from '../../../../types/Product';
import { useDeleteProduct } from '../../api/products';
import ErrorMessage from '../../components/ErrorMessage';
import WarningMessage from '../../components/WarningMessage';

export default function DeleteProductBtn({ product }: { product: Product }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const handleDeleteProduct = (e: React.FormEvent) => {
    e.preventDefault();
    deleteProduct(product._id.toString(), {
      onSuccess: () => {
        onOpenChange();
      },
    });
  };

  return (
    <>
      <Button
        isIconOnly
        aria-label='delete product'
        className='text-red-500 hover:text-red-700'
        variant='light'
        onPress={onOpen}>
        <IoTrashOutline size={24} />
      </Button>

      <Modal
        isOpen={isOpen}
        placement='top-center'
        radius='sm'
        size='lg'
        onOpenChange={onOpenChange}>
        <ModalContent>
          {
            <>
              <ModalHeader>
                <WarningMessage description='Are you sure you want to delete this product? This action cannot be undone' />
              </ModalHeader>
              <ModalBody>
                {/* {error && (
                  <ErrorMessage
                    description={`An error occurred while deleting the product.`}
                  />
                )} */}
                {!product && <ErrorMessage description='Product not found' />}
                {product && (
                  <Form onSubmit={handleDeleteProduct}>
                    <Card
                      className='w-64 max-w-sm mx-auto my-4'
                      radius='none'
                      shadow='sm'>
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
                          product.description.length > 190
                            ? `${product.description.slice(0, 190)}...`
                            : product.description
                        }`}</p>
                      </CardFooter>
                    </Card>
                    <div className='self-end'>
                      <Button
                        color='danger'
                        isDisabled={isPending}
                        isLoading={isPending}
                        radius='sm'
                        type='submit'>
                        Delete Product
                      </Button>
                    </div>
                  </Form>
                )}
              </ModalBody>
            </>
          }
        </ModalContent>
      </Modal>
    </>
  );
}
