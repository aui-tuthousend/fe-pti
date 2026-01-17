import { API_BASE_URL } from '../../config/env';
import { Variant, VariantRequest } from './types';
import type { PendingVariantImage } from './variant-form.types';

export class VariantService {
    private readonly baseUrl = `${API_BASE_URL}/api/variants`;

    async createVariant(variant: VariantRequest, token: string): Promise<void> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(variant),
        });

        if (!response.ok) {
            throw new Error(`Failed to create variant: ${response.statusText}`);
        }

        return response.json();
    }

    async updateVariant(uuid: string, variant: Partial<VariantRequest>, token: string): Promise<Variant> {
        const response = await fetch(`${this.baseUrl}/${uuid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(variant),
        });

        if (!response.ok) {
            throw new Error(`Failed to update variant: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    }

    async getVariantDetail(uuid: string): Promise<Variant> {
        const response = await fetch(`${this.baseUrl}/${uuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch variant detail: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    }

    /**
     * Upload variant image
     */
    async uploadVariantImage(
        variantUuid: string,
        file: File,
        token: string,
        alt_text?: string,
        position?: number
    ): Promise<{ url: string; alt_text?: string; position?: number }> {
        const formData = new FormData();
        formData.append('image', file);
        if (alt_text) formData.append('alt_text', alt_text);
        if (position !== undefined && !isNaN(position)) formData.append('position', position.toString());

        const response = await fetch(`${this.baseUrl}/${variantUuid}/images/upload`, {
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
     * Create multiple variants and return their titles
     */
    async createVariantsBatch(
        variants: VariantRequest[],
        token: string
    ): Promise<{ successTitles: string[]; errors: Array<{ title: string; error: string }> }> {
        const successTitles: string[] = [];
        const errors: Array<{ title: string; error: string }> = [];

        for (const variant of variants) {
            try {
                await this.createVariant(variant, token);
                successTitles.push(variant.title);
            } catch (error: any) {
                errors.push({
                    title: variant.title,
                    error: error.message || 'Unknown error'
                });
            }
        }

        return { successTitles, errors };
    }

    /**
     * Upload images for newly created variants
     * Matches variants by title and uploads pending images
     */
    async uploadImagesForNewVariants(
        formVariants: Array<{ uuid?: string; title: string }>,
        freshProductVariants: Array<{ uuid: string; title: string }>,
        pendingImages: Record<number, PendingVariantImage[]>,
        createdVariantTitles: string[],
        token: string
    ): Promise<{ successCount: number; failCount: number; results: Array<{ variantTitle: string; success: number; failed: number }> }> {
        let totalSuccess = 0;
        let totalFail = 0;
        const results: Array<{ variantTitle: string; success: number; failed: number }> = [];

        for (let variantIndex = 0; variantIndex < formVariants.length; variantIndex++) {
            const formVariant = formVariants[variantIndex];

            // Skip if variant already had UUID (existing variant)
            if (formVariant.uuid) continue;

            // Find matching variant in fresh product data by title
            const matchingVariant = freshProductVariants.find(
                (v) => v.title === formVariant.title && createdVariantTitles.includes(v.title)
            );

            if (!matchingVariant) continue;

            // Upload pending images for this variant
            const variantPendingImages = pendingImages[variantIndex] || [];
            if (variantPendingImages.length > 0) {
                let successCount = 0;
                let failCount = 0;

                for (const img of variantPendingImages) {
                    try {
                        await this.uploadVariantImage(matchingVariant.uuid, img.file, token, img.alt_text, undefined);
                        successCount++;
                        totalSuccess++;
                    } catch (error: any) {
                        console.error('Failed to upload variant image:', error);
                        failCount++;
                        totalFail++;
                    }
                }

                results.push({
                    variantTitle: formVariant.title,
                    success: successCount,
                    failed: failCount
                });
            }
        }

        return { successCount: totalSuccess, failCount: totalFail, results };
    }
}

export const variantService = new VariantService();
