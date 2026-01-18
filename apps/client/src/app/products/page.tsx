import ProductList from "@/components/ProductList";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  return (
    <div>
      <ProductList category={searchParams.category} params="products" />
    </div>
  );
}

