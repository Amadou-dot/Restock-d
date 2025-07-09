import type { ProductInput } from '../../../../types/Product';
import { useAddProduct } from '../../api/products';
import ProductForm, {
  type ProductFormEditData,
} from '../../components/ProductForm';
import { AuthProtected } from '../../utils/authUtils';

export default function AddProduct() {
  const { mutate: addProduct, isPending, error } = useAddProduct();
  const handleSubmit = (
    data: FormData | Omit<ProductInput, 'userId'> | ProductFormEditData,
    target?: HTMLFormElement
  ) => {
    addProduct(data, {
      onSuccess: () => {
        target?.reset();
      },
    });
  };

  return (
    <>
    <title>Add Product</title>
    <meta content='Add a new product to the store' name='description' />
    <AuthProtected className='max-w-2xl mx-auto' title='Add Product'>
      <ProductForm
        requireImage
        error={error}
        isPending={isPending}
        submitButtonText='Add Product'
        onSubmit={handleSubmit}
      />
    </AuthProtected></>
  );
}
