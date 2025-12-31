import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useProductStore } from '@/features/product/hooks'
import type { ProductRequest } from '@/features/product/types'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { getImageUrl } from '@/config/env'

export const Route = createFileRoute('/admin/product/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { auth } = Route.useRouteContext()
  const { list, loading, pagination, GetPaginatedProducts, GetProductDetail } = useProductStore()
  const { CreateProduct } = useProductStore()
  const { UpdateProduct } = useProductStore()
  const { DeleteProduct } = useProductStore()

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
              {loading && list.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="text-muted-foreground">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : list.length === 0 ? (
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
                list.map((product) => (
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
}

function ProductFormModal({ title, product, onClose, onSubmit, isLoading }: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductRequest>({
    title: product?.title || '',
    description: product?.description || '',
    product_type: product?.product_type || '',
    vendor: product?.vendor || '',
    tags: product?.tags || [],
    status: product?.status || 'draft',
    variants: product?.variants?.map((v: any) => ({
      uuid: v.uuid, // ✅ Keep UUID for updates
      title: v.title || '',
      price: v.price || 0,
      sku: v.sku || '',
      inventory_policy: v.inventory_policy || 'deny',
      option1: v.option1 || '',
      // Use inventory_item from detail endpoint, or create default
      inventory_item: v.inventory_item ? {
        sku: v.inventory_item.sku || v.sku || '',
        tracked: v.inventory_item.tracked ?? true,
        available: v.inventory_item.available ?? v.inventory_quantity ?? 0,
        cost: v.inventory_item.cost || 0,
      } : {
        sku: v.sku || '',
        tracked: true,
        available: v.inventory_quantity || 0,
        cost: 0,
      }
    })) || [{
      title: '',
      price: 0,
      sku: '',
      inventory_policy: 'deny',
      option1: '',
      inventory_item: {
        sku: '',
        tracked: true,
        available: 0,
        cost: 0,
      }
    }],
  })

  const [tagsInput, setTagsInput] = useState(product?.tags?.join(', ') || '')

  const { auth } = Route.useRouteContext()
  const { UploadImage } = useProductStore()
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl && !imageUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl, imageUrl])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const file = e.target.files[0]
    setSelectedFile(file)
    setImageUrl('') // Clear URL if file is selected

    // Create local preview
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleUrlChange = (url: string) => {
    setImageUrl(url)
    setSelectedFile(null) // Clear file if URL is entered
    setPreviewUrl(url) // Use URL directly as preview
  }

  const handleRemoveSelectedImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setImageUrl('')
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants]
    if (field.startsWith('inventory_item.')) {
      const inventoryField = field.split('.')[1]
      newVariants[index] = {
        ...newVariants[index],
        inventory_item: {
          ...newVariants[index].inventory_item,
          [inventoryField]: value,
        }
      }
    } else {
      newVariants[index] = { ...newVariants[index], [field]: value }
    }
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
        inventory_item: {
          sku: '',
          tracked: true,
          available: 0,
          cost: 0,
        }
      }]
    }))
  }

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Deferred upload: Upload image first if file selected
    if (selectedFile && product?.uuid) {
      setIsUploading(true)
      try {
        if (!auth.user?.token) throw new Error('Unauthorized')
        await UploadImage(auth.user.token, product.uuid, selectedFile)
        toast.success('Image uploaded successfully!')
      } catch (error: any) {
        toast.error(error?.message || 'Failed to upload image')
        setIsUploading(false)
        return // Stop submission if upload fails
      } finally {
        setIsUploading(false)
      }
    }

    // Handle URL upload: fetch image from URL and upload
    if (imageUrl && !selectedFile && product?.uuid) {
      setIsUploading(true)
      try {
        if (!auth.user?.token) throw new Error('Unauthorized')

        // Fetch image from URL
        const response = await fetch(imageUrl)
        if (!response.ok) throw new Error('Failed to fetch image from URL')

        const blob = await response.blob()
        const filename = imageUrl.split('/').pop() || 'image.jpg'
        const file = new File([blob], filename, { type: blob.type || 'image/jpeg' })

        await UploadImage(auth.user.token, product.uuid, file)
        toast.success('Image uploaded successfully!')
      } catch (error: any) {
        toast.error(error?.message || 'Failed to upload image from URL')
        setIsUploading(false)
        return // Stop submission if upload fails
      } finally {
        setIsUploading(false)
      }
    }

    const tags = tagsInput.split(',').map((tag: string) => tag.trim()).filter(Boolean)

    // Send full variants including uuid (for updates) and inventory_item
    onSubmit({
      ...formData,
      tags
    })
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

          {/* Images Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Images</h3>
            {!product?.uuid ? (
              <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm">
                Please save the product first to upload images.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Existing Images from Server */}
                {product.images && product.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {product.images.map((img: any) => (
                      <div key={img.uuid} className="relative group">
                        <img
                          src={getImageUrl(img.url) || ''}
                          alt="Product"
                          className="w-full h-24 object-cover rounded-md border"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Image */}
                {!previewUrl ? (
                  <div className="border rounded-lg p-4 space-y-4">
                    <p className="text-sm font-medium">Add New Image</p>

                    {/* Tab Buttons */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setUploadMode('file')}
                        className={`px-4 py-2 text-sm rounded-md transition-colors ${uploadMode === 'file'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                          }`}
                      >
                        📁 Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMode('url')}
                        className={`px-4 py-2 text-sm rounded-md transition-colors ${uploadMode === 'url'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                          }`}
                      >
                        🔗 From URL
                      </button>
                    </div>

                    {/* File Upload */}
                    {uploadMode === 'file' && (
                      <label className={`
                        border-2 border-dashed border-gray-300 rounded-lg 
                        flex flex-col items-center justify-center 
                        h-32 cursor-pointer hover:border-primary hover:bg-muted/50 transition
                        ${isUploading ? 'opacity-50 pointer-events-none' : ''}
                      `}>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                        <Plus size={24} className="text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to select image</span>
                        <span className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</span>
                      </label>
                    )}

                    {/* URL Input */}
                    {uploadMode === 'url' && (
                      <div className="space-y-3">
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => handleUrlChange(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 border rounded-lg text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter a direct link to an image file
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Preview of Selected/Entered Image */
                  <div className="border rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium">New Image Preview</p>
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-primary"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect fill="%23f0f0f0" width="128" height="128"/><text x="50%" y="50%" font-size="12" text-anchor="middle" dy=".3em" fill="%23999">Invalid URL</text></svg>';
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleRemoveSelectedImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="flex-1 text-sm">
                        {selectedFile ? (
                          <>
                            <p className="font-medium">{selectedFile.name}</p>
                            <p className="text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                          </>
                        ) : imageUrl ? (
                          <>
                            <p className="font-medium">Image from URL</p>
                            <p className="text-muted-foreground truncate max-w-xs">{imageUrl}</p>
                          </>
                        ) : null}
                        <p className="text-xs text-amber-600 mt-2">
                          * Will be uploaded when you click "Update Product"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                      <label className="block text-sm font-medium mb-1">Inventory SKU *</label>
                      <input
                        type="text"
                        value={variant.inventory_item.sku}
                        onChange={(e) => updateVariant(index, 'inventory_item.sku', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="e.g. INV-S-RED"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Available Quantity *</label>
                      <input
                        type="number"
                        value={variant.inventory_item.available}
                        onChange={(e) => updateVariant(index, 'inventory_item.available', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Cost *</label>
                      <input
                        type="number"
                        value={variant.inventory_item.cost}
                        onChange={(e) => updateVariant(index, 'inventory_item.cost', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="flex items-center pt-6">
                      <input
                        type="checkbox"
                        checked={variant.inventory_item.tracked}
                        onChange={(e) => updateVariant(index, 'inventory_item.tracked', e.target.checked)}
                        className="mr-2"
                      />
                      <label className="text-sm font-medium">Track inventory</label>
                    </div>
                  </div>
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
