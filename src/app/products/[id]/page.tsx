// app/products/[id]/page.tsx

"use client"; // This makes the component a Client Component

import { useParams } from 'next/navigation';

const ProductPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Product ID: {id}</h1>
      {/* Additional logic to display or fetch product details */}
    </div>
  );
};

export default ProductPage;
