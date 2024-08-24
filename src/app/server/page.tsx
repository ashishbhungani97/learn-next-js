// app/products/page.tsx

import pool from "@/lib/db";

// Define the Product interface
interface Product {
    id: number; // Assuming id is a number. Change to `string` if it's a string.
    name: string;
}

// Fetch products from the database
async function getProducts(): Promise<Product[]> {
    const [rows] = await pool.query('SELECT * FROM nfts');
    return rows as Product[]; // Type casting to ensure TypeScript understands the data structure
}

// Server Component to render the products
export default async function ProductsPage() {
    const products = await getProducts(); // Fetch products

    return (
        <div>
            <h1>Products</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
