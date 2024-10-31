// src/services/ProductService.ts
import { HttpClient } from '../../../utils/HttpClient';


export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

type CreateProductRequest = Omit<Product, 'id'>;
type UpdateProductRequest = Product;

export class ProductService {
  private httpClient: HttpClient;

  constructor(signal?: AbortSignal) {
    this.httpClient = new HttpClient({
      baseURL: 'https://fakestoreapi.com/products',
      timeout: 10000,
      signal,
    });
  }

  public async getAllProducts(): Promise<Product[]> {
    return await this.httpClient.get<Product[]>('');
  }

  public async getProductById(id: number): Promise<Product> {
    return await this.httpClient.get<Product>(`/${id}`);
  }

  public async createProduct(product: CreateProductRequest): Promise<Product> {
    return await this.httpClient.post<Product, CreateProductRequest>(
      '',
      product
    );
  }

  public async updateProduct(product: UpdateProductRequest): Promise<Product> {
    return await this.httpClient.put<Product, UpdateProductRequest>(
      `/${product.id}`,
      product
    );
  }

  public async deleteProductById(id: number): Promise<Product> {
    return await this.httpClient.delete<Product>(`/${id}`);
  }
}
