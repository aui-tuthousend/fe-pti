import { API_BASE_URL } from '../../config/env';
import { ProductResponse, ProductRequest, PaginatedProductsResponse } from './types';

export class ProductService {
    private readonly baseUrl = `${API_BASE_URL}/api/product`;

    async getAllProduct(): Promise<ProductResponse[]> {
   const response = await fetch(this.baseUrl, {
    	method: 'GET',
    	headers: {
    	'Content-Type': 'application/json',
    	},
   });

   if (!response.ok) {
    	throw new Error(`Failed to fetch product records: ${response.statusText}`);
   }

   const data = await response.json();

   return data.data;
  }

  async getPaginatedProducts(page: number, limit: number): Promise<PaginatedProductsResponse> {
   const response = await fetch(`${this.baseUrl}?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
    	'Content-Type': 'application/json',
    },
   });

   if (!response.ok) {
    throw new Error(`Failed to fetch paginated products: ${response.statusText}`);
   }

   const data = await response.json();

   return data;
  }

		async createProduct(product: ProductRequest): Promise<void> {
			const response = await fetch(this.baseUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(product),
				});

			if (!response.ok) {
					throw new Error(`Failed to create product: ${response.statusText}`);
			}

			return response.json();
		}
}

export const productService = new ProductService();