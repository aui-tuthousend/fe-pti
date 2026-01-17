import { API_BASE_URL } from '../../config/env';
import { ProductResponse, ProductRequest, PaginatedProductsResponse } from './types';
import type { PendingImage } from './product-form.types';

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

    async createProduct(product: ProductRequest, token: string): Promise<void> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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

    /**
     * Upload product image
     */
    async uploadProductImage(
        productUuid: string,
        file: File,
        token: string,
        alt_text?: string,
        position?: number
    ): Promise<{ url: string; alt_text?: string; position?: number }> {
        const formData = new FormData();
        formData.append('image', file);
        if (alt_text) formData.append('alt_text', alt_text);
        if (position !== undefined && !isNaN(position)) formData.append('position', position.toString());

        const response = await fetch(`${this.baseUrl}/${productUuid}/images/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.errors || `Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            url: data.data.url,
            alt_text: data.data.alt_text,
            position: data.data.position,
        };
    }

    /**
     * Delete product image
     */
    async deleteProductImage(productUuid: string, imageId: string, token: string): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/${productUuid}/images/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete image: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    }

    /**
     * Upload multiple product images in batch
     */
    async uploadProductImagesBatch(
        productUuid: string,
        images: PendingImage[],
        token: string
    ): Promise<{ successCount: number; failCount: number; errors: string[] }> {
        let successCount = 0;
        let failCount = 0;
        const errors: string[] = [];

        for (const img of images) {
            try {
                await this.uploadProductImage(productUuid, img.file, token, img.alt_text, undefined);
                successCount++;
            } catch (error: any) {
                console.error('Failed to upload product image:', error);
                failCount++;
                errors.push(error.message || 'Unknown error');
            }
        }

        return { successCount, failCount, errors };
    }

    /**
     * Delete multiple product images in batch
     */
    async deleteProductImagesBatch(
        productUuid: string,
        imageIds: Array<{ uuid: string; url: string }>,
        token: string
    ): Promise<{ successCount: number; failCount: number; errors: string[] }> {
        let successCount = 0;
        let failCount = 0;
        const errors: string[] = [];

        for (const img of imageIds) {
            try {
                await this.deleteProductImage(productUuid, img.uuid, token);
                successCount++;
            } catch (error: any) {
                console.error('Failed to delete product image:', error);
                failCount++;
                errors.push(error.message || 'Unknown error');
            }
        }

        return { successCount, failCount, errors };
    }
}

export const productService = new ProductService();