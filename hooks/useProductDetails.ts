// hooks/useProductDetail.ts
import { useState, useEffect } from "react";
import { getProductById, Product } from "@/services/productService";

type UseProductDetailResult = {
  product: Product | null;
  loading: boolean;
  error: Error | null;
};

export function useProductDetail(productId: number): UseProductDetailResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true; // Flag to track component mount state

    async function fetchProduct() {
      try {
        if (!productId || isNaN(productId)) {
          throw new Error("Invalid product ID");
        }

        setLoading(true);
        setError(null);

        const data = await getProductById(productId);

        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch product")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates after unmount
    };
  }, [productId]);

  return { product, loading, error };
}
