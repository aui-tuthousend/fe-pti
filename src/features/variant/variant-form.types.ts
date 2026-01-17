import type { VariantRequest } from './types'

// Pending image types
export interface PendingVariantImage {
    file: File
    alt_text?: string
}

export interface PendingDeleteVariantImage {
    uuid: string
    url: string
}

// Variant image type (moved from product-form.types)
export interface VariantImage {
    url: string
    alt_text?: string
    position?: number
}

// Variant form data (moved from product-form.types)
export interface VariantFormData {
    uuid?: string
    productId?: string
    title: string
    price: number
    sku: string
    inventory_policy: string
    option1: string
    available: number
    cost: number
    images?: VariantImage[]
}

// Variant form modal props (untuk standalone form jika diperlukan)
export interface VariantFormModalProps {
    title: string
    variant?: any
    onClose: () => void
    onSubmit: (data: VariantRequest) => any
    isLoading: boolean
    onReload?: () => Promise<void>
}

// Image gallery props
export interface VariantImageGalleryProps {
    images: VariantImage[]
    onRemove: (index: number) => void
    onSetFeatured?: (index: number) => Promise<void>
    variantTitle?: string
}

// Image uploader props
export interface VariantImageUploaderProps {
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    uploadId: string
}

// Pending images list props
export interface PendingVariantImagesListProps {
    pendingUploads: PendingVariantImage[]
    pendingDeletes: PendingDeleteVariantImage[]
    onRemovePending: (index: number) => void
    onUndoDelete: (index: number) => void
    variantTitle?: string
}

// Basic info form props
export interface VariantBasicInfoFormProps {
    formData: VariantFormData
    onUpdate: (field: string, value: any) => void
}

// Variant image manager props
export interface VariantImageManagerProps {
    images: VariantImage[]
    pendingImages: PendingVariantImage[]
    pendingDeletes: PendingDeleteVariantImage[]
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    onRemove: (index: number) => void
    onRemovePending: (index: number) => void
    onUndoDelete: (index: number) => void
    onSetFeatured: (index: number) => Promise<void>
    isUploading: boolean
}

// Variant form props (moved from product-form.types)
export interface VariantFormProps {
    variant: VariantFormData
    index: number
    canRemove: boolean
    onUpdate: (index: number, field: string, value: any) => void
    onRemove: (index: number) => void
    variantImages: VariantImage[]
    pendingImages: PendingVariantImage[]
    pendingDeletes: PendingDeleteVariantImage[]
    onImageUpload: (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => void
    onImageRemove: (variantIndex: number, imageIndex: number) => void
    onRemovePendingImage: (variantIndex: number, imageIndex: number) => void
    onUndoDeleteImage: (variantIndex: number, imageIndex: number) => void
    onSetFeaturedImage: (variantIndex: number, imageIndex: number) => Promise<void>
    isUploading: boolean
    product?: any
    auth?: any
    onReload?: () => Promise<void>
}
