import { Button } from '@heroui/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@heroui/modal';
import { FaTrash } from 'react-icons/fa6';
import { useClearCart } from '../../api/cart';
import ErrorMessage from '../ErrorMessage';
import { useNavigate } from 'react-router-dom';

export default function ClearCartBtn() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { mutate: clearCart, isPending, error } = useClearCart();
  const handleClearCart = () => {
    clearCart(void 0, {
      onSuccess: () => {
        onOpenChange(); // Close the modal after clearing cart
        navigate('/'); // Redirect to home after clearing cart
      },
    });
  };
  return (
    <>
      <Button
        color='danger'
        radius='sm'
        size='lg'
        startContent={<FaTrash />}
        variant='ghost'
        onPress={onOpen}>
        Clear cart
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            <h2 className='text-lg font-semibold'>Clear Cart</h2>
          </ModalHeader>
          <ModalBody>
            <p className='mb-4'>Are you sure you want to clear your cart?</p>
            {error && <ErrorMessage description={error.message} />}
            <div className='flex justify-end gap-2'>
              <Button
                color='secondary'
                isDisabled={isPending}
                variant='light'
                onPress={onOpenChange}>
                Cancel
              </Button>
              <Button
                color='primary'
                isLoading={isPending}
                variant='solid'
                onPress={handleClearCart}>
                Yes, clear cart
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
