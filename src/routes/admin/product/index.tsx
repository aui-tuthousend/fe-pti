import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useProductStore } from '@/features/product/hooks'
import type { ProductRequest } from '@/features/product/types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import ProductTable from '@/components/admin/product/ProductTable'
import ProductFormModal from '@/components/admin/product/ProductFormModal'

export const Route = createFileRoute('/admin/product/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { auth } = Route.useRouteContext()
  const {
    list: products,
    loading: storeLoading,
    pagination,
    GetPaginatedProducts,
    CreateProduct,
    UpdateProduct,
    DeleteProduct,
    GetProductDetail
  } = useProductStore()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingDetail, setIsFetchingDetail] = useState(false)

  // Store auth in window for ProductFormModal to access
  // This is a workaround - ideally we'd use React Context
  useEffect(() => {
    (window as any).__routeContext = { auth }
  }, [auth])

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
      const response = await CreateProduct(auth.user.token, data)
      return response
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create product')
      throw error
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
      <ProductTable
        products={products}
        loading={storeLoading}
        pagination={pagination}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onPageChange={handlePageChange}
        isFetchingDetail={isFetchingDetail}
        isDeleting={isLoading}
        onCreateNew={() => setIsCreateModalOpen(true)}
      />

      {/* Create Modal */}
      {isCreateModalOpen && (
        <ProductFormModal
          title="Create New Product"
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProduct}
          isLoading={isLoading}
          onReload={async () => {
            setIsCreateModalOpen(false)
            await GetPaginatedProducts('', currentPage, 10)
          }}
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
            const response = await GetProductDetail(selectedProduct.uuid)
            setSelectedProduct(response.data)
          }}
        />
      )}
    </div>
  )
}
