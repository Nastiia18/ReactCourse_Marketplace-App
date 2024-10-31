// src/pages/products/ProductsPage.tsx
import { useState, useEffect } from 'react';
import { Product, ProductService } from '../services/productsService';
import { AxiosError } from 'axios';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const productService = new ProductService(signal);

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedProducts = await productService.getAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div>
      <h1>Products Page</h1>
      {loading && <p>Loading...</p>} {}
      {error && <p>Error: {error}</p>} {}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.title} - ${product.price} {}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
