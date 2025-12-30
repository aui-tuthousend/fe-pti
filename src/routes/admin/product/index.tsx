import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useProductStore } from '@/features/product/hooks'
import type { ProductRequest } from '@/features/product/types'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

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
      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Variants</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading && list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Loading products...
                  </td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                list.map((product) => (
                  <tr key={product.uuid} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{product.title}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {product.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{product.product_type}</td>
                    <td className="px-6 py-4 text-sm">{product.vendor}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{product.variants?.length || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product.uuid)}
                          disabled={isFetchingDetail}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.uuid, product.title)}
                          disabled={isLoading}
                        >
                          <Trash2 size={16} className="text-red-500" />
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
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} products
            </div>
            <div className="flex gap-2">
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
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
