import ErrorMessage from '../../components/ErrorMessage';
import PageLayout from '../../components/layouts/PageLayout';
import Message from '../../components/Message';
import WarningMessage from '../../components/WarningMessage';

export default function ProductList() {
  return (
    <>
      <title>Products</title>
      <PageLayout title='Products'>
        <div className='flex flex-col gap-4'>
          <Message
            description='Here you can browse all available products.'
            title='Welcome to the Product List'
          />
          <WarningMessage
            description='This is a placeholder for the product list. Please implement the product fetching and display logic.'
            title='Note'
          />
          <ErrorMessage
            description='If you see this message, it means there was an issue loading the products. Please try again later.'
            title='Error'
          />
        </div>
      </PageLayout>
    </>
  );
}
