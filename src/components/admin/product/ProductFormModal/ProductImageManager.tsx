import ImageGallery from '@/components/admin/product/ImageManager/ImageGallery'
import ImageUploader from '@/components/admin/product/ImageManager/ImageUploader'
import PendingImagesList from '@/components/admin/product/ImageManager/PendingImagesList'
import type { ProductImageManagerProps } from '@/features/product/product-form.types'

export default function ProductImageManager({
    images,
    pendingImages,
    pendingDeletes,
    onUpload,
    onRemove,
    onRemovePending,
    onUndoDelete,
    onSetFeatured,
    isUploading
}: ProductImageManagerProps) {
    return (
        <div className="space-y-4 border-t pt-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Product Images</h3>
                        <p className="text-xs text-blue-700 dark:text-blue-300">Main images for this product</p>
                    </div>
                </div>

                {/* Existing Images */}
                <ImageGallery
                    images={images}
                    onRemove={onRemove}
                    onSetFeatured={onSetFeatured}
                    imageType="product"
                />

                {/* Pending Images */}
                <PendingImagesList
                    pendingUploads={pendingImages}
                    pendingDeletes={pendingDeletes}
                    onRemovePending={onRemovePending}
                    onUndoDelete={onUndoDelete}
                    imageType="product"
                />

                {/* Upload New Product Images */}
                <ImageUploader
                    onUpload={onUpload}
                    disabled={isUploading}
                    imageType="product"
                    uploadId="product-image-upload"
                />
            </div>
        </div>
    )
}
