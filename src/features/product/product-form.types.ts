import type { ProductRequest } from '@/features/product/types'

// Pending image upload type
export interface PendingImage {
    file: File
    alt_text?: string
}

// Pending image deletion type
export interface PendingDeleteImage {
    uuid: string
    url: string
}

// Product image type
export interface ProductImage {
    url: string
    alt_text?: string
    position?: number
}

// Variant image type
export interface VariantImage {
    url: string
    alt_text?: string
    position?: number
}

// Variant form data
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

// Product form data
export interface ProductFormData extends Omit<ProductRequest, 'variants'> {
    variants: VariantFormData[]
}

// Product form modal props
export interface ProductFormModalProps {
    title: string
    product?: any
    onClose: () => void
    onSubmit: (data: ProductRequest) => any
    isLoading: boolean
    onReload?: () => Promise<void>
}

// Image gallery props
export interface ImageGalleryProps {
    images: ProductImage[]
    onRemove: (index: number) => void
    onSetFeatured?: (index: number) => Promise<void>
    imageType: 'product' | 'variant'
    variantTitle?: string
}

// Image uploader props
export interface ImageUploaderProps {
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    imageType: 'product' | 'variant'
    uploadId: string
}

// Pending images list props
export interface PendingImagesListProps {
    pendingUploads: PendingImage[]
    pendingDeletes: PendingDeleteImage[]
    onRemovePending: (index: number) => void
    onUndoDelete: (index: number) => void
    imageType: 'product' | 'variant'
    variantTitle?: string
}

// Basic info form props
export interface BasicInfoFormProps {
    formData: ProductFormData
    onUpdate: (field: string, value: any) => void
    tagsInput: string
    onTagsChange: (tags: string) => void
}

// Product image manager props
export interface ProductImageManagerProps {
    images: ProductImage[]
    pendingImages: PendingImage[]
    pendingDeletes: PendingDeleteImage[]
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    onRemove: (index: number) => void
    onRemovePending: (index: number) => void
    onUndoDelete: (index: number) => void
    onSetFeatured: (index: number) => Promise<void>
    isUploading: boolean
}

// Variant form props
export interface VariantFormProps {
    variant: VariantFormData
    index: number
    canRemove: boolean
    onUpdate: (index: number, field: string, value: any) => void
    onRemove: (index: number) => void
    variantImages: VariantImage[]
    pendingImages: PendingImage[]
    pendingDeletes: PendingDeleteImage[]
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

// Variant list props
export interface VariantListProps {
    variants: VariantFormData[]
    onUpdate: (index: number, field: string, value: any) => void
    onAdd: () => void
    onRemove: (index: number) => void
    pendingVariantImages: Record<number, PendingImage[]>
    pendingDeleteVariantImages: Record<number, PendingDeleteImage[]>
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

// Product table props
export interface ProductTableProps {
    products: any[]
    loading: boolean
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
    onEdit: (uuid: string) => void
    onDelete: (uuid: string, title: string) => void
    onPageChange: (page: number) => void
    isFetchingDetail: boolean
    isDeleting: boolean
    onCreateNew: () => void
}
