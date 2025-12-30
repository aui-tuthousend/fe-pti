import { API_BASE_URL } from '../../config/env';
import { ProductResponse, ProductRequest, PaginatedProductsResponse } from './types';

export class ProductService {
    private readonly baseUrl = `${API_BASE_URL}/api/products`;

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

    async updateProduct(uuid: string, product: Partial<ProductRequest>, token: string): Promise<ProductResponse> {
        const response = await fetch(`${this.baseUrl}/${uuid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(product),
        });

        if (!response.ok) {
            throw new Error(`Failed to update product: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    }

    async deleteProduct(uuid: string, token: string): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/${uuid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete product: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    }

    async getProductDetail(uuid: string): Promise<ProductResponse> {
        const response = await fetch(`${this.baseUrl}/${uuid}/detail`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch product detail: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    }
}

export const productService = new ProductService();