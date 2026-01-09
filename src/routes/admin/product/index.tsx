import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useProductStore } from '@/features/product/hooks'
import type { ProductRequest } from '@/features/product/types'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { getImageUrl } from '@/config/env'
import { urlBuilder } from '@/lib/utils'

export const Route = createFileRoute('/admin/product/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { auth } = Route.useRouteContext()
  const { list: products, loading: storeLoading, pagination, GetPaginatedProducts, CreateProduct, UpdateProduct, DeleteProduct, GetProductDetail } = useProductStore()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingDetail, setIsFetchingDetail] = useState(false)

  // Load products on mount
  useEffect(() => {
    GetPaginatedProducts('', 1, 10)
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    GetPaginatedProducts('', page, 10)
  }

  const handleEditProduct = async (uuid: string) => {
    setIsFetchingDetail(true)
    try {
      const response = await GetProductDetail(uuid)
      setSelectedProduct(response.data)
      setIsEditModalOpen(true)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch product details')
    } finally {
      setIsFetchingDetail(false)
    }
  }

  const handleCreateProduct = async (data: ProductRequest) => {
    setIsLoading(true)
    try {
      if (!auth.user) throw new Error('Unauthorized')
      // Images are now included in the data payload
      await CreateProduct(auth.user.token, data)

      toast.success('Product created successfully!')
      setIsCreateModalOpen(false)
      GetPaginatedProducts('', currentPage, 10)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateProduct = async (uuid: string, data: Partial<ProductRequest>) => {
    setIsLoading(true)
    try {
      if (!auth.user) throw new Error('Unauthorized')
      // Images are now included in the data payload
      await UpdateProduct(auth.user.token, uuid, data)

      toast.success('Product updated successfully!')
      setIsEditModalOpen(false)
      setSelectedProduct(null)
      GetPaginatedProducts('', currentPage, 10)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (uuid: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    setIsLoading(true)
    try {
      if (!auth.user) throw new Error('Unauthorized')
      await DeleteProduct(auth.user.token, uuid)
      toast.success('Product deleted successfully!')
      GetPaginatedProducts('', currentPage, 10)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your products, variants, and inventory</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus size={20} />
          Add Product
        </Button>
      </div>

      {/* Product Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Variants</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {storeLoading && products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="text-muted-foreground">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Plus size={24} className="text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">No products found</p>
                      <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
                        Add your first product
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.uuid} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      {product.images && product.images.length > 0 && product.images[0]?.url ? (
                        <img
                          src={getImageUrl(product.images[0].url) || ''}
                          alt={product.title}
                          className="w-14 h-14 object-cover rounded-lg border shadow-sm bg-muted"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center text-xs text-muted-foreground font-medium">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{product.title}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs mt-0.5">
                        {product.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm bg-muted px-2 py-1 rounded-md">{product.product_type}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{product.vendor}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${product.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        product.status === 'draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                        {product.variants?.length || 0} variants
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product.uuid)}
                          disabled={isFetchingDetail}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.uuid, product.title)}
                          disabled={isLoading}
                          className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between bg-muted/30">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
              <span className="font-medium text-foreground">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
              <span className="font-medium text-foreground">{pagination.total}</span> products
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="min-w-[36px]"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <ProductFormModal
          title="Create New Product"
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProduct}
          isLoading={isLoading}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedProduct && (
        <ProductFormModal
          title="Edit Product"
          product={selectedProduct}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedProduct(null)
          }}
          onSubmit={(data) => handleUpdateProduct(selectedProduct.uuid, data)}
          isLoading={isLoading}
          onReload={async () => {
            await GetProductDetail(selectedProduct.uuid)
          }}
        />
      )}
    </div>
  )
}

// Product Form Modal Component
interface ProductFormModalProps {
  title: string
  product?: any
  onClose: () => void
  onSubmit: (data: ProductRequest) => void
  isLoading: boolean
  onReload?: () => Promise<void>
}

function ProductFormModal({ title, product, onClose, onSubmit, isLoading, onReload }: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductRequest>({
    title: product?.title || '',
    description: product?.description || '',
    product_type: product?.product_type || '',
    vendor: product?.vendor || '',
    tags: product?.tags || [],
    status: product?.status || 'draft',
    images: product?.images?.map((img: any) => ({
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
  const { auth } = Route.useRouteContext()
  const { UploadFileAndGetUrl } = useProductStore()
  const [isUploading, setIsUploading] = useState(false)

  // Pending product images to upload
  const [pendingProductImages, setPendingProductImages] = useState<Array<{ file: File, alt_text?: string, position?: number }>>([])

  // Pending variant images to upload (indexed by variant index)
  const [pendingVariantImages, setPendingVariantImages] = useState<Record<number, Array<{ file: File, alt_text?: string, position?: number }>>>({})

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
      }]
    }))
  }

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }))
  }

  // Helper functions for product images
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const files = Array.from(e.target.files)

    // Calculate starting position based on existing + pending images
    const existingCount = (formData.images?.length || 0)
    const pendingCount = pendingProductImages.length
    const startPosition = existingCount + pendingCount + 1

    const newPendingImages = files.map((file, idx) => ({
      file,
      alt_text: '',
      position: startPosition + idx
    }))
    setPendingProductImages(prev => [...prev, ...newPendingImages])
  }

  const removeProductImage = async (index: number) => {
    const imageToRemove = formData.images?.[index]
    console.log('Removing image at index:', index, 'Image:', imageToRemove)

    if (!imageToRemove) return

    // If we have product UUID and auth, try to delete from server
    if (product?.uuid && auth.user?.token) {
      try {
        // Find the image UUID from the original product data
        const originalImage = product.images?.find((img: any) => img.url === imageToRemove.url)

        if (originalImage && originalImage.uuid) {
          console.log('Deleting image from server:', originalImage.uuid)
          const response = await fetch(`${urlBuilder(`/products/${product.uuid}/images/${originalImage.uuid}`)}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${auth.user.token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || 'Failed to delete image from server')
          }

          toast.success('Image deleted successfully')

          // Reload product detail to get fresh data
          if (onReload) {
            await onReload()
          }
        } else {
          console.log('Image UUID not found in original product data, just removing from UI')
          // Still remove from UI even if not found on server
          setFormData(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
          }))
        }
      } catch (error: any) {
        console.error('Error deleting image:', error)
        toast.error(error.message || 'Failed to delete image')
        return // Don't remove from UI if server delete failed
      }
    } else {
      console.log('No product UUID or auth, just removing from UI')
      // Remove from local state
      setFormData(prev => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index)
      }))
    }
  }

  const removePendingProductImage = (index: number) => {
    setPendingProductImages(prev => prev.filter((_, i) => i !== index))
  }

  // Helper functions for variant images
  const handleVariantImageUpload = (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const files = Array.from(e.target.files)
    const variant = formData.variants[variantIndex]
    const existingCount = (variant.images?.length || 0) + (pendingVariantImages[variantIndex]?.length || 0)

    const newPendingImages = files.map((file, idx) => ({
      file,
      alt_text: '',
      position: existingCount + idx + 1
    }))

    setPendingVariantImages(prev => ({
      ...prev,
      [variantIndex]: [...(prev[variantIndex] || []), ...newPendingImages]
    }))
  }

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    const newVariants = [...formData.variants]
    newVariants[variantIndex] = {
      ...newVariants[variantIndex],
      images: newVariants[variantIndex].images?.filter((_, i) => i !== imageIndex)
    }
    setFormData(prev => ({ ...prev, variants: newVariants }))
  }

  const removePendingVariantImage = (variantIndex: number, imageIndex: number) => {
    setPendingVariantImages(prev => ({
      ...prev,
      [variantIndex]: (prev[variantIndex] || []).filter((_, i) => i !== imageIndex)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      if (!auth.user?.token) throw new Error('Unauthorized')

      const tags = tagsInput.split(',').map((tag: string) => tag.trim()).filter(Boolean)

      // Remove images from formData to avoid sending existing images
      const { images: _, ...formDataWithoutImages } = formData

      // Different workflow for CREATE vs UPDATE
      if (!product?.uuid) {
        // CREATE: Submit product first WITHOUT images, then upload images
        const cleanedVariants = formDataWithoutImages.variants.map(({ productId, ...variant }) => ({
          ...variant,
          images: [] // No images for create
        }))

        const createPayload: ProductRequest = {
          ...formDataWithoutImages,
          tags,
          images: [], // No images for create
          variants: cleanedVariants
        }

        await onSubmit(createPayload)

        // Note: Images will need to be uploaded after product is created
        // This would require a callback from onSubmit with the new UUID
        // For now, user needs to edit product to add images

      } else {
        // UPDATE: Upload images first, then submit with URLs

        // 1. Upload all pending product images and get URLs
        const uploadedProductImages = await Promise.all(
          pendingProductImages.map(async (img) => {
            try {
              return await UploadFileAndGetUrl(auth.user!.token, product.uuid, img.file, img.alt_text, img.position)
            } catch (error: any) {
              console.error('Failed to upload product image:', img.file.name, error)
              toast.error(`Failed to upload ${img.file.name}: ${error.message}`)
              return null
            }
          })
        )

        // Filter out failed uploads
        const validProductImages = uploadedProductImages.filter((img): img is { url: string, alt_text?: string, position?: number } => img !== null)

        if (pendingProductImages.length > 0) {
          const successCount = validProductImages.length
          const failCount = pendingProductImages.length - successCount
          if (successCount > 0) {
            toast.success(`${successCount} product image(s) uploaded successfully`)
          }
          if (failCount > 0) {
            toast.warning(`${failCount} product image(s) failed to upload`)
          }
        }

        // 2. Upload all pending variant images
        const variantsWithUploadedImages = await Promise.all(
          formData.variants.map(async (variant, index) => {
            const pendingImages = pendingVariantImages[index] || []
            if (pendingImages.length > 0) {
              const uploadedImages = await Promise.all(
                pendingImages.map(async (img) => {
                  try {
                    return await UploadFileAndGetUrl(auth.user!.token, product.uuid, img.file, img.alt_text, img.position)
                  } catch (error) {
                    console.error('Failed to upload variant image:', error)
                    return null
                  }
                })
              )
              const validImages = uploadedImages.filter((img): img is { url: string, alt_text?: string, position?: number } => img !== null)
              return {
                ...variant,
                images: [...(variant.images || []), ...validImages]
              }
            }
            return variant
          })
        )

        // 3. Build final payload
        // Clean up variants - remove productId field for update
        const cleanedVariants = variantsWithUploadedImages.map(({ productId, ...variant }) => variant)

        const payload: ProductRequest = {
          ...formDataWithoutImages,
          tags,
          // For update: Only send newly uploaded images, not existing ones
          // Existing images are already in the database
          images: validProductImages.length > 0 ? validProductImages : undefined,
          variants: cleanedVariants
        }

        // 4. Submit to API
        await onSubmit(payload)

        // 5. Clear pending images and reload to get fresh data
        setPendingProductImages([])
        setPendingVariantImages({})

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
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g. Premium Cotton T-Shirt"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Product description and details..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Type *</label>
                <input
                  type="text"
                  value={formData.product_type}
                  onChange={(e) => updateField('product_type', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. Apparel"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Vendor *</label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => updateField('vendor', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. Nike"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. clothing, summer, sale"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Images Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Product Images</h3>

            {/* Existing Images */}
            {formData.images && formData.images.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Current Images</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={getImageUrl(img.url) || ''}
                        alt={img.alt_text || 'Product'}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeProductImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      <div className="text-xs text-center mt-1 text-muted-foreground">
                        Pos: {img.position || index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Images */}
            {pendingProductImages.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Pending Upload ({pendingProductImages.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pendingProductImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(img.file)}
                        alt="Pending"
                        className="w-full h-24 object-cover rounded-md border border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => removePendingProductImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                      <div className="absolute top-1 left-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            {product?.uuid && (
              <div className="border-2 border-dashed rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleProductImageUpload}
                  className="hidden"
                  id="product-image-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="product-image-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Plus size={24} className="text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload product images
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF - Multiple files supported
                  </span>
                </label>
              </div>
            )}

            {!product?.uuid && (
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-3 rounded-md text-sm">
                💡 Save the product first to upload images
              </div>
            )}
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Variants</h3>
              <Button type="button" onClick={addVariant} size="sm" variant="outline">
                <Plus size={16} className="mr-2" />
                Add Variant
              </Button>
            </div>

            {formData.variants.map((variant, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3 bg-muted/30">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Variant {index + 1}</h4>
                  {formData.variants.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeVariant(index)}
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
                      onChange={(e) => updateVariant(index, 'title', e.target.value)}
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
                      onChange={(e) => updateVariant(index, 'option1', e.target.value)}
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
                      onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
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
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="e.g. PROD-S-RED"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Inventory Policy *</label>
                    <select
                      value={variant.inventory_policy}
                      onChange={(e) => updateVariant(index, 'inventory_policy', e.target.value)}
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
                        onChange={(e) => updateVariant(index, 'available', parseInt(e.target.value))}
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
                        onChange={(e) => updateVariant(index, 'cost', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Variant Images */}
                <div className="border-t pt-3 mt-3">
                  <h5 className="text-sm font-medium mb-2">Variant Images</h5>

                  {/* Existing variant images */}
                  {variant.images && variant.images.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground mb-1">Current Images</p>
                      <div className="flex flex-wrap gap-2">
                        {variant.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative group">
                            <img
                              src={getImageUrl(img.url) || ''}
                              alt={img.alt_text || 'Variant'}
                              className="w-16 h-16 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeVariantImage(index, imgIndex)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pending variant images */}
                  {pendingVariantImages[index] && pendingVariantImages[index].length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground mb-1">Pending Upload</p>
                      <div className="flex flex-wrap gap-2">
                        {pendingVariantImages[index].map((img, imgIndex) => (
                          <div key={imgIndex} className="relative">
                            <img
                              src={URL.createObjectURL(img.file)}
                              alt="Pending"
                              className="w-16 h-16 object-cover rounded border border-amber-500"
                            />
                            <button
                              type="button"
                              onClick={() => removePendingVariantImage(index, imgIndex)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                            >
                              <X size={12} />
                            </button>
                            <div className="absolute top-0 left-0 bg-amber-500 text-white text-[10px] px-1 rounded-br">
                              New
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload new variant images */}
                  {product?.uuid && (
                    <div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleVariantImageUpload(index, e)}
                        className="hidden"
                        id={`variant-image-upload-${index}`}
                        disabled={isUploading}
                      />
                      <label
                        htmlFor={`variant-image-upload-${index}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border rounded cursor-pointer hover:bg-muted transition-colors"
                      >
                        <Plus size={14} />
                        Upload Images
                      </label>
                    </div>
                  )}

                  {!product?.uuid && (
                    <p className="text-xs text-muted-foreground italic">
                      Save the product first to upload variant images
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
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
