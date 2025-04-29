import axios from "axios";

export type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  rating?: {
    rate: number;
    count: number;
  };
};

export async function getProducts(): Promise<Product[]> {
  try {
    const apiUrl = process.env.FAKE_STORE_API_URL;
    if (!apiUrl) {
      throw new Error("API endpoint not configured");
    }

    const response = await axios.get<Product[]>(`${apiUrl}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Re-throw the error so calling code can handle it
  }
}

export async function getProductById(id: number): Promise<Product> {
  try {
    const response = await axios.get<Product>(
      `https://fakestoreapi.com/products/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error; // Re-throw the error so calling code can handle it
  }
}
