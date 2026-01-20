import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useProductStore } from '@/features/product/hooks'
import type { ProductRequest } from '@/features/product/types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import ProductTable from '@/components/admin/product/ProductTable'
import ProductFormModal from '@/components/admin/product/ProductFormModal'
import ProductSearchFilter from '@/components/admin/product/ProductSearchFilter'

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

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [productTypeFilter, setProductTypeFilter] = useState('')

  // Store auth in window for ProductFormModal to access
  // This is a workaround - ideally we'd use React Context
  useEffect(() => {
    (window as any).__routeContext = { auth }
  }, [auth])

  // Load products on mount and when search query changes
  useEffect(() => {
    // Load all products without search parameter (backend might not support it yet)
    GetPaginatedProducts('', 1, 10)
    setCurrentPage(1)
  }, [])

  // Client-side filtering for search, status and product type
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.product_type?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = !statusFilter || product.status === statusFilter
    const matchesType = !productTypeFilter || product.product_type.toLowerCase().includes(productTypeFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesType
  })

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    GetPaginatedProducts(searchQuery, page, 10)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('')
    setProductTypeFilter('')
  }

  const hasActiveFilters = searchQuery !== '' || statusFilter !== '' || productTypeFilter !== ''

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
    <div className="container mx-auto p-4 md:p-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your products, variants, and inventory</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus size={20} />
          Add Product
        </Button>
      </div>

      {/* Search and Filter */}
      <ProductSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        productTypeFilter={productTypeFilter}
        onProductTypeFilterChange={setProductTypeFilter}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Product Table */}
      <ProductTable
        products={filteredProducts}
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
            // Reload product detail for modal
            const response = await GetProductDetail(selectedProduct.uuid)
            setSelectedProduct(response.data)

            // Reload product list for table to show updated variant count
            await GetPaginatedProducts('', currentPage, 10)
          }}
        />
      )}
    </div>
  )
}
