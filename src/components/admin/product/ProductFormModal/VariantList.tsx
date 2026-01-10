import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import VariantForm from './VariantForm'
import type { VariantListProps } from '@/features/product/product-form.types'

export default function VariantList({
    variants,
    onUpdate,
    onAdd,
    onRemove,
    pendingVariantImages,
    pendingDeleteVariantImages,
    onImageUpload,
    onImageRemove,
    onRemovePendingImage,
    onUndoDeleteImage,
    onSetFeaturedImage,
    isUploading,
    product,
    auth,
    onReload
}: VariantListProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Variants</h3>
                <Button type="button" onClick={onAdd} size="sm" variant="outline">
                    <Plus size={16} className="mr-2" />
                    Add Variant
                </Button>
            </div>

            {variants.map((variant, index) => (
                <VariantForm
                    key={index}
                    variant={variant}
                    index={index}
                    canRemove={variants.length > 1}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    variantImages={variant.images || []}
                    pendingImages={pendingVariantImages[index] || []}
                    pendingDeletes={pendingDeleteVariantImages[index] || []}
                    onImageUpload={onImageUpload}
                    onImageRemove={onImageRemove}
                    onRemovePendingImage={onRemovePendingImage}
                    onUndoDeleteImage={onUndoDeleteImage}
                    onSetFeaturedImage={onSetFeaturedImage}
                    isUploading={isUploading}
                    product={product}
                    auth={auth}
                    onReload={onReload}
                />
            ))}
        </div>
    )
}
