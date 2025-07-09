import ProductSkeleton from './ProductSkeleton';

export default function LoadingCards() {
  return Array.from({ length: 4 }).map((_, index) => (
    <ProductSkeleton key={index} />
  ));
}
