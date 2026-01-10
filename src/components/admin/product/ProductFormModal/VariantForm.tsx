import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ImageGallery from '@/components/admin/product/ImageManager/ImageGallery'
import ImageUploader from '@/components/admin/product/ImageManager/ImageUploader'
import PendingImagesList from '@/components/admin/product/ImageManager/PendingImagesList'
import type { VariantFormProps } from '@/features/product/product-form.types'
import { toast } from 'sonner'
import { urlBuilder } from '@/lib/utils'

export default function VariantForm({
    variant,
    index,
    canRemove,
    onUpdate,
    onRemove,
    variantImages,
    pendingImages,
    pendingDeletes,
    onImageUpload,
    onImageRemove,
    onRemovePendingImage,
    onUndoDeleteImage,
    onSetFeaturedImage,
    isUploading,
    product,
    auth,
    onReload
}: VariantFormProps) {
    const handleSetFeatured = async (imageIndex: number) => {
        try {
            // Move this image to position 0 (featured)
            const newImages = [...variantImages]
            const [movedImage] = newImages.splice(imageIndex, 1)
            newImages.unshift(movedImage)

            // Update positions
            const updatedImages = newImages.map((img, idx) => ({
                ...img,
                position: idx + 1
            }))

            // Call parent handler to update formData
            await onSetFeaturedImage(index, imageIndex)

            // If product exists, update backend using reorder endpoint
            if (product?.uuid && auth?.user?.token && variant.uuid) {
                // Find original variant images with UUIDs
                const originalVariant = product.variants?.find((v: any) => v.uuid === variant.uuid)
                const originalImages = originalVariant?.images || []

                // Create reorder payload with ALL images
                const reorderItems = updatedImages.map((img, idx) => {
                    const originalImg = originalImages.find((orig: any) => orig.url === img.url)
                    return {
                        imageId: originalImg?.uuid,
                        position: idx // 0-indexed, cover is position 0
                    }
                }).filter(item => item.imageId) // Only include images with UUID

                // Call reorder endpoint
                const response = await fetch(urlBuilder(`/variants/${variant.uuid}/images/reorder`), {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${auth.user.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ items: reorderItems })
                })

                if (!response.ok) {
                    throw new Error('Failed to reorder variant images')
                }

                toast.success('Featured variant image updated')

                // Reload to get fresh data
                if (onReload) {
                    await onReload()
                }
            } else {
                toast.success('Set as featured variant image')
            }
        } catch (error: any) {
            console.error('Error setting featured variant image:', error)
            toast.error('Failed to set featured variant image')
        }
    }

    return (
        <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
            <div className="flex justify-between items-center">
                <h4 className="font-medium">Variant {index + 1}</h4>
                {canRemove && (
                    <Button
                        type="button"
                        onClick={() => onRemove(index)}
                        size="sm"
                        variant="ghost"
                    >
                        <Trash2 size={16} className="text-red-500" />
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Variant Title *</label>
                    <input
                        type="text"
                        value={variant.title}
                        onChange={(e) => onUpdate(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="e.g. Small / Red"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Option (e.g. Size) *</label>
                    <input
                        type="text"
                        value={variant.option1}
                        onChange={(e) => onUpdate(index, 'option1', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="e.g. Small"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Price *</label>
                    <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => onUpdate(index, 'price', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="0"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">SKU *</label>
                    <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => onUpdate(index, 'sku', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="e.g. PROD-S-RED"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Inventory Policy *</label>
                    <select
                        value={variant.inventory_policy}
                        onChange={(e) => onUpdate(index, 'inventory_policy', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        required
                    >
                        <option value="deny">Deny (Stop selling when out of stock)</option>
                        <option value="continue">Continue (Allow overselling)</option>
                    </select>
                </div>
            </div>

            {/* Inventory Item */}
            <div className="border-t pt-3 mt-3">
                <h5 className="text-sm font-medium mb-2">Inventory Details</h5>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Available Quantity *</label>
                        <input
                            type="number"
                            value={variant.available}
                            onChange={(e) => onUpdate(index, 'available', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            placeholder="0"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Cost *</label>
                        <input
                            type="number"
                            value={variant.cost}
                            onChange={(e) => onUpdate(index, 'cost', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Variant Images */}
            <div className="border-t pt-3 mt-3">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h5 className="text-sm font-semibold text-purple-900 dark:text-purple-100">Variant Images</h5>
                            <p className="text-xs text-purple-700 dark:text-purple-300">Images specific to this variant</p>
                        </div>
                    </div>

                    {/* Existing variant images */}
                    <ImageGallery
                        images={variantImages}
                        onRemove={(imgIndex) => onImageRemove(index, imgIndex)}
                        onSetFeatured={handleSetFeatured}
                        imageType="variant"
                        variantTitle={variant.title || `Variant ${index + 1}`}
                    />

                    {/* Pending variant images */}
                    <PendingImagesList
                        pendingUploads={pendingImages}
                        pendingDeletes={pendingDeletes}
                        onRemovePending={(imgIndex) => onRemovePendingImage(index, imgIndex)}
                        onUndoDelete={(imgIndex) => onUndoDeleteImage(index, imgIndex)}
                        imageType="variant"
                        variantTitle={variant.title || `Variant ${index + 1}`}
                    />

                    {/* Upload new variant images */}
                    <ImageUploader
                        onUpload={(e) => onImageUpload(index, e)}
                        disabled={isUploading}
                        imageType="variant"
                        uploadId={`variant-image-upload-${index}`}
                    />
                </div>
            </div>
        </div>
    )
}
