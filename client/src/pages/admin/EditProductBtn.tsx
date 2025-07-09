import { Button } from '@heroui/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@heroui/modal';
import { IoCreateOutline } from 'react-icons/io5';
import type { Product, ProductInput } from '../../../../types/Product';
import { useEditProduct } from '../../api/products';
import ProductForm, {
  type ProductFormEditData,
} from '../../components/ProductForm';

export default function EditProductBtn({ product }: { product: Product }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { mutate: editProduct, isPending, error } = useEditProduct();

  const handleEditProduct = (
    data: FormData | ProductFormEditData | Omit<ProductInput, 'userId'>
  ) =>
    editProduct(data as Partial<Product>, {
      onSuccess: () => {
        onOpenChange();
      },
    });

  return (
    <>
      <Button
        isIconOnly
        aria-label='edit product'
        variant='light'
        onPress={onOpen}>
        <IoCreateOutline size={24} />
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
              <ModalHeader>{product.name}</ModalHeader>
              <ModalBody>
                <ProductForm
                  error={error}
                  isPending={isPending}
                  product={product}
                  showError={false}
                  submitButtonText='Save Changes'
                  onSubmit={handleEditProduct}
                />
              </ModalBody>
            </>
          }
        </ModalContent>
      </Modal>
    </>
  );
}
