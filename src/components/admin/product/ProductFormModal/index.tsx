import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useProductStore } from '@/features/product/hooks'
import { uploadVariantImage } from '@/features/variant/hooks'
import { urlBuilder } from '@/lib/utils'
import BasicInfoForm from './BasicInfoForm'
import ProductImageManager from './ProductImageManager'
import VariantList from './VariantList'
import type {
    ProductFormModalProps,
    ProductFormData,
    PendingImage,
    PendingDeleteImage
} from '@/features/product/product-form.types'
import type { ProductRequest } from '@/features/product/types'

export default function ProductFormModal({
    title,
    product,
    onClose,
    onSubmit,
    isLoading,
    onReload
}: ProductFormModalProps) {
    const [formData, setFormData] = useState<ProductFormData>({
        title: product?.title || '',
        description: product?.description || '',
        product_type: product?.product_type || '',
        vendor: product?.vendor || '',
        tags: product?.tags || [],
        status: product?.status || 'draft',
        // Filter to only show product-level images (variantId === null or undefined)
        images: product?.images?.filter((img: any) => !img.variantId).map((img: any) => ({
            url: img.url,
            alt_text: img.alt_text,
            position: img.position
        })) || [],
        variants: product?.variants?.map((v: any) => ({
            uuid: v.uuid,
            productId: product.uuid,
            title: v.title || '',
            price: v.price || 0,
            sku: v.sku || '',
            inventory_policy: v.inventory_policy || 'deny',
            option1: v.option1 || '',
            available: v.available ?? v.inventory_quantity ?? 0,
            cost: v.cost || 0,
            images: v.images?.map((img: any) => ({
                url: img.url,
                alt_text: img.alt_text,
                position: img.position
            })) || [],
        })) || [{
            title: '',
            price: 0,
            sku: '',
            inventory_policy: 'deny',
            option1: '',
            available: 0,
            cost: 0,
            images: [],
        }],
    })

    const [tagsInput, setTagsInput] = useState(product?.tags?.join(', ') || '')
    const [isUploading, setIsUploading] = useState(false)

    // Pending product images to upload
    const [pendingProductImages, setPendingProductImages] = useState<PendingImage[]>([])

    // Pending variant images to upload (indexed by variant index)
    const [pendingVariantImages, setPendingVariantImages] = useState<Record<number, PendingImage[]>>({})

    // Images marked for deletion
    const [pendingDeleteProductImages, setPendingDeleteProductImages] = useState<PendingDeleteImage[]>([])
    const [pendingDeleteVariantImages, setPendingDeleteVariantImages] = useState<Record<number, PendingDeleteImage[]>>({})

    const { UploadFileAndGetUrl } = useProductStore()

    // Get auth from context - we'll need to pass this through props or use context
    // For now, we'll access it via window or pass it as prop
    const getAuth = () => {
        // This is a workaround - ideally auth should be passed as prop or via context
        return (window as any).__routeContext?.auth
    }

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const updateVariant = (index: number, field: string, value: any) => {
        const newVariants = [...formData.variants]

        // safe number conversion
        if (typeof value === 'number' && isNaN(value)) {
            value = 0
        }

        newVariants[index] = { ...newVariants[index], [field]: value }
        setFormData(prev => ({ ...prev, variants: newVariants }))
    }

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, {
                title: '',
                price: 0,
                sku: '',
                inventory_policy: 'deny',
                option1: '',
                available: 0,
                cost: 0,
                images: [],
            }]
        }))
    }

    const removeVariant = (index: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }))
    }

    // Product image handlers
    const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return
        const files = Array.from(e.target.files)

        const newPendingImages = files.map((file) => ({
            file,
            alt_text: '',
        }))
        setPendingProductImages(prev => [...prev, ...newPendingImages])
    }

    const removeProductImage = (index: number) => {
        const imageToRemove = formData.images?.[index]
        if (!imageToRemove) return

        // Only search in product-level images (not variant images)
        const originalImage = product?.images?.filter((img: any) => !img.variantId).find((img: any) => img.url === imageToRemove.url)

        if (originalImage && originalImage.uuid) {
            setPendingDeleteProductImages(prev => [...prev, { uuid: originalImage.uuid, url: originalImage.url }])
            toast.info('Image marked for deletion. Click "Update Product" to confirm.')
        }

        setFormData(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
        }))
    }

    const undoDeleteProductImage = (index: number) => {
        const imageToRestore = pendingDeleteProductImages[index]
        if (!imageToRestore) return

        // Only search in product-level images (not variant images)
        const originalImage = product?.images?.filter((img: any) => !img.variantId).find((img: any) => img.url === imageToRestore.url)

        if (originalImage) {
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), {
                    url: originalImage.url,
                    alt_text: originalImage.alt_text,
                    position: originalImage.position
                }]
            }))
        }

        setPendingDeleteProductImages(prev => prev.filter((_, i) => i !== index))
        toast.success('Image deletion cancelled')
    }

    const removePendingProductImage = (index: number) => {
        setPendingProductImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSetFeaturedProductImage = async (index: number) => {
        try {
            const auth = getAuth()

            // Move this image to position 0 (featured)
            const newImages = [...formData.images!]
            const [movedImage] = newImages.splice(index, 1)
            newImages.unshift(movedImage)

            // Update local state
            setFormData(prev => ({ ...prev, images: newImages }))

            // If product exists, update backend using reorder endpoint
            if (product?.uuid && auth?.user?.token) {
                const originalImages = product.images?.filter((img: any) => !img.variantId) || []

                const reorderItems = newImages.map((img, idx) => {
                    const originalImg = originalImages.find((orig: any) => orig.url === img.url)
                    return {
                        imageId: originalImg?.uuid,
                        position: idx
                    }
                }).filter(item => item.imageId)

                const response = await fetch(urlBuilder(`/products/${product.uuid}/images/reorder`), {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${auth.user.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ items: reorderItems })
                })

                if (!response.ok) {
                    throw new Error('Failed to reorder images')
                }

                toast.success('Featured image updated')

                if (onReload) {
                    await onReload()
                }
            } else {
                toast.success('Set as featured image')
            }
        } catch (error: any) {
            console.error('Error setting featured image:', error)
            toast.error('Failed to set featured image')
        }
    }

    // Variant image handlers
    const handleVariantImageUpload = (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return
        const files = Array.from(e.target.files)

        const newPendingImages = files.map((file) => ({
            file,
            alt_text: '',
        }))

        setPendingVariantImages(prev => ({
            ...prev,
            [variantIndex]: [...(prev[variantIndex] || []), ...newPendingImages]
        }))
    }

    const removeVariantImage = (variantIndex: number, imageIndex: number) => {
        const variant = formData.variants[variantIndex]
        const imageToRemove = variant.images?.[imageIndex]
        if (!imageToRemove) return

        const originalVariant = product?.variants?.find((v: any) => v.uuid === variant.uuid)
        const originalImage = originalVariant?.images?.find((img: any) => img.url === imageToRemove.url)

        if (originalImage && originalImage.uuid) {
            setPendingDeleteVariantImages(prev => ({
                ...prev,
                [variantIndex]: [...(prev[variantIndex] || []), { uuid: originalImage.uuid, url: originalImage.url }]
            }))
            toast.info('Variant image marked for deletion. Click "Update Product" to confirm.')
        }

        const newVariants = [...formData.variants]
        newVariants[variantIndex] = {
            ...newVariants[variantIndex],
            images: newVariants[variantIndex].images?.filter((_, i) => i !== imageIndex)
        }
        setFormData(prev => ({ ...prev, variants: newVariants }))
    }

    const undoDeleteVariantImage = (variantIndex: number, imageIndex: number) => {
        const imageToRestore = pendingDeleteVariantImages[variantIndex]?.[imageIndex]
        if (!imageToRestore) return

        const originalVariant = product?.variants?.find((v: any) => v.uuid === formData.variants[variantIndex].uuid)
        const originalImage = originalVariant?.images?.find((img: any) => img.url === imageToRestore.url)

        if (originalImage) {
            const newVariants = [...formData.variants]
            newVariants[variantIndex] = {
                ...newVariants[variantIndex],
                images: [...(newVariants[variantIndex].images || []), {
                    url: originalImage.url,
                    alt_text: originalImage.alt_text,
                    position: originalImage.position
                }]
            }
            setFormData(prev => ({ ...prev, variants: newVariants }))
        }

        setPendingDeleteVariantImages(prev => ({
            ...prev,
            [variantIndex]: prev[variantIndex].filter((_, i) => i !== imageIndex)
        }))
        toast.success('Variant image deletion cancelled')
    }

    const removePendingVariantImage = (variantIndex: number, imageIndex: number) => {
        setPendingVariantImages(prev => ({
            ...prev,
            [variantIndex]: (prev[variantIndex] || []).filter((_, i) => i !== imageIndex)
        }))
    }

    const handleSetFeaturedVariantImage = async (variantIndex: number, imageIndex: number) => {
        // This will be handled by VariantForm component
        // Just update local state here
        const newVariants = [...formData.variants]
        const newImages = [...newVariants[variantIndex].images!]
        const [movedImage] = newImages.splice(imageIndex, 1)
        newImages.unshift(movedImage)

        const updatedImages = newImages.map((img, idx) => ({
            ...img,
            position: idx + 1
        }))

        newVariants[variantIndex] = {
            ...newVariants[variantIndex],
            images: updatedImages
        }

        setFormData(prev => ({ ...prev, variants: newVariants }))
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        setIsUploading(true)

        try {
            const auth = getAuth()
            if (!auth?.user?.token) throw new Error('Unauthorized')

            const tags = tagsInput.split(',').map((tag: string) => tag.trim()).filter(Boolean)

            // Remove images from formData to avoid sending existing images
            const { images: _, ...formDataWithoutImages } = formData

            // Different workflow for CREATE vs UPDATE
            if (!product?.uuid) {
                // CREATE: Submit product first, then upload images
                const cleanedVariants = formDataWithoutImages.variants.map(({ productId, ...variant }) => ({
                    ...variant,
                    images: []
                }))

                const createPayload: ProductRequest = {
                    ...formDataWithoutImages,
                    tags,
                    images: [],
                    variants: cleanedVariants
                }

                try {
                    const response = await onSubmit(createPayload)
                    const productData = response?.data?.data || response?.data

                    if (!productData?.uuid) {
                        throw new Error('Failed to get product UUID from response')
                    }

                    const newProductUuid = productData.uuid
                    const newVariants = productData.variants || []

                    // Upload product images
                    if (pendingProductImages.length > 0) {
                        console.log('Uploading product images:', pendingProductImages.length, 'to product:', newProductUuid)
                        let successCount = 0
                        let failCount = 0

                        for (const img of pendingProductImages) {
                            try {
                                console.log('Uploading product image:', img.file.name, 'to product:', newProductUuid)
                                await UploadFileAndGetUrl(
                                    auth.user!.token,
                                    newProductUuid,
                                    img.file,
                                    img.alt_text,
                                    undefined
                                )
                                successCount++
                            } catch (error: any) {
                                console.error('Failed to upload product image:', error)
                                failCount++
                            }
                        }

                        if (successCount > 0) {
                            toast.success(`${successCount} product image(s) uploaded`)
                        }
                        if (failCount > 0) {
                            toast.warning(`${failCount} product image(s) failed to upload`)
                        }
                    }

                    // Upload variant images
                    for (let variantIndex = 0; variantIndex < formData.variants.length; variantIndex++) {
                        const pendingImages = pendingVariantImages[variantIndex] || []
                        const variantUuid = newVariants[variantIndex]?.uuid

                        if (pendingImages.length > 0 && variantUuid) {
                            console.log('Uploading variant images:', pendingImages.length, 'to variant:', variantUuid, 'index:', variantIndex)
                            let successCount = 0
                            let failCount = 0

                            for (const img of pendingImages) {
                                try {
                                    console.log('Uploading variant image:', img.file.name, 'to variant:', variantUuid)
                                    await uploadVariantImage(
                                        auth.user!.token,
                                        variantUuid,
                                        img.file,
                                        img.alt_text,
                                        undefined
                                    )
                                    successCount++
                                } catch (error: any) {
                                    console.error('Failed to upload variant image:', error)
                                    failCount++
                                }
                            }

                            if (successCount > 0) {
                                toast.success(`${successCount} variant image(s) uploaded for ${formData.variants[variantIndex].title}`)
                            }
                            if (failCount > 0) {
                                toast.warning(`${failCount} variant image(s) failed to upload`)
                            }
                        }
                    }

                    // Clear pending states
                    setPendingProductImages([])
                    setPendingVariantImages({})

                    toast.success('Product created successfully!')

                    if (onReload) {
                        await onReload()
                    }

                } catch (error: any) {
                    console.error('Create product error:', error)
                    toast.error(error?.message || 'Failed to create product')
                }

            } else {
                // UPDATE: Delete marked images, upload pending images, then submit product

                // Delete marked product images
                if (pendingDeleteProductImages.length > 0) {
                    let successCount = 0
                    let failCount = 0

                    for (const img of pendingDeleteProductImages) {
                        try {
                            const response = await fetch(`${urlBuilder(`/products/${product.uuid}/images/${img.uuid}`)}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${auth.user!.token}`,
                                    'Content-Type': 'application/json',
                                },
                            })

                            if (!response.ok) {
                                throw new Error('Failed to delete image')
                            }
                            successCount++
                        } catch (error: any) {
                            console.error('Failed to delete product image:', error)
                            failCount++
                        }
                    }

                    if (successCount > 0) {
                        toast.success(`${successCount} product image(s) deleted`)
                    }
                    if (failCount > 0) {
                        toast.warning(`${failCount} product image(s) failed to delete`)
                    }
                }

                // Delete marked variant images
                for (let variantIndex = 0; variantIndex < formData.variants.length; variantIndex++) {
                    const variant = formData.variants[variantIndex]
                    const pendingDeletes = pendingDeleteVariantImages[variantIndex] || []

                    if (pendingDeletes.length > 0 && variant.uuid) {
                        let successCount = 0
                        let failCount = 0

                        for (const img of pendingDeletes) {
                            try {
                                const response = await fetch(`${urlBuilder(`/variants/${variant.uuid}/images/${img.uuid}`)}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${auth.user!.token}`,
                                        'Content-Type': 'application/json',
                                    },
                                })

                                if (!response.ok) {
                                    throw new Error('Failed to delete variant image')
                                }
                                successCount++
                            } catch (error: any) {
                                console.error('Failed to delete variant image:', error)
                                failCount++
                            }
                        }

                        if (successCount > 0) {
                            toast.success(`${successCount} variant image(s) deleted from ${variant.title}`)
                        }
                        if (failCount > 0) {
                            toast.warning(`${failCount} variant image(s) failed to delete`)
                        }
                    }
                }

                // Upload pending product images
                if (pendingProductImages.length > 0) {
                    let successCount = 0
                    let failCount = 0

                    for (const img of pendingProductImages) {
                        try {
                            await UploadFileAndGetUrl(auth.user!.token, product.uuid, img.file, img.alt_text, undefined)
                            successCount++
                        } catch (error: any) {
                            console.error('Failed to upload product image:', error)
                            failCount++
                        }
                    }

                    if (successCount > 0) {
                        toast.success(`${successCount} product image(s) uploaded successfully`)
                    }
                    if (failCount > 0) {
                        toast.warning(`${failCount} product image(s) failed to upload`)
                    }
                }

                // Upload pending variant images
                for (let variantIndex = 0; variantIndex < formData.variants.length; variantIndex++) {
                    const pendingImages = pendingVariantImages[variantIndex] || []

                    if (pendingImages.length > 0) {
                        let successCount = 0
                        let failCount = 0

                        for (const img of pendingImages) {
                            try {
                                const variant = formData.variants[variantIndex]
                                if (variant.uuid) {
                                    await uploadVariantImage(auth.user!.token, variant.uuid, img.file, img.alt_text, undefined)
                                }
                                successCount++
                            } catch (error: any) {
                                console.error('Failed to upload variant image:', error)
                                failCount++
                            }
                        }

                        if (successCount > 0) {
                            toast.success(`${successCount} variant image(s) uploaded for ${formData.variants[variantIndex].title}`)
                        }
                        if (failCount > 0) {
                            toast.warning(`${failCount} variant image(s) failed to upload`)
                        }
                    }
                }

                // Build payload WITHOUT images field
                const cleanedVariants = formData.variants.map(({ productId, images, ...variant }) => ({
                    ...variant
                }))

                const payload: ProductRequest = {
                    ...formDataWithoutImages,
                    tags,
                    variants: cleanedVariants
                }

                // Submit to API
                await onSubmit(payload)

                // Clear pending images and reload to get fresh data
                setPendingProductImages([])
                setPendingVariantImages({})
                setPendingDeleteProductImages([])
                setPendingDeleteVariantImages({})

                if (onReload) {
                    await onReload()
                }
            }

        } catch (error: any) {
            console.error("Submit Error:", error)
            toast.error(error?.message || 'Failed to save product')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full my-8">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <BasicInfoForm
                        formData={formData}
                        onUpdate={updateField}
                        tagsInput={tagsInput}
                        onTagsChange={setTagsInput}
                    />

                    <ProductImageManager
                        images={formData.images || []}
                        pendingImages={pendingProductImages}
                        pendingDeletes={pendingDeleteProductImages}
                        onUpload={handleProductImageUpload}
                        onRemove={removeProductImage}
                        onRemovePending={removePendingProductImage}
                        onUndoDelete={undoDeleteProductImage}
                        onSetFeatured={handleSetFeaturedProductImage}
                        isUploading={isUploading}
                    />

                    <VariantList
                        variants={formData.variants}
                        onUpdate={updateVariant}
                        onAdd={addVariant}
                        onRemove={removeVariant}
                        pendingVariantImages={pendingVariantImages}
                        pendingDeleteVariantImages={pendingDeleteVariantImages}
                        onImageUpload={handleVariantImageUpload}
                        onImageRemove={removeVariantImage}
                        onRemovePendingImage={removePendingVariantImage}
                        onUndoDeleteImage={undoDeleteVariantImage}
                        onSetFeaturedImage={handleSetFeaturedVariantImage}
                        isUploading={isUploading}
                        product={product}
                        auth={getAuth()}
                        onReload={onReload}
                    />
                </form>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 p-6 border-t">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
