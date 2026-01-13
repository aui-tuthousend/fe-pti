import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { checkAuth } from '@/routes/login/-server'
import { User as UserType } from '@/routes/login/-utils'
import { useGetAdminOrders } from './-hooks'
import { AdminOrderResponse } from './-types'
import { Package } from 'lucide-react'
import OrderTable from '@/components/admin/order/OrderTable'
import OrderDetailModal from '@/components/admin/order/OrderDetailModal'
import OrderSearchFilter from '@/components/admin/order/OrderSearchFilter'

export const Route = createFileRoute('/admin/order/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [user, setUser] = useState<UserType | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderResponse | null>(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      const auth = await checkAuth()
      if (auth?.user) {
        setUser(auth.user)
      }
    }
    fetchUser()
  }, [])

  // Fetch admin orders with pagination
  const { data: ordersData, isLoading } = useGetAdminOrders(
    user?.token ?? null,
    currentPage,
    itemsPerPage
  )

  // Client-side filtering
  const filteredOrders = ordersData?.data.filter(order => {
    const matchesSearch = !searchQuery ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPaymentStatus = paymentStatusFilter === 'all' || order.payment_status === paymentStatusFilter

    return matchesSearch && matchesStatus && matchesPaymentStatus
  }) || []

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (ordersData?.pagination.totalPages || 1)) {
      setCurrentPage(newPage)
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setPaymentStatusFilter('all')
  }

  const hasActiveFilters =
    searchQuery !== '' ||
    (statusFilter !== 'all' && statusFilter !== '') ||
    (paymentStatusFilter !== 'all' && paymentStatusFilter !== '')

  const handleViewDetails = (order: AdminOrderResponse) => {
    setSelectedOrder(order)
  }

  const handleCloseDetails = () => {
    setSelectedOrder(null)
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Manajemen Pesanan</h1>
            <p className="text-muted-foreground">
              Kelola semua pesanan pelanggan
              {ordersData && ` (${ordersData.pagination.total} total pesanan)`}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <OrderSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        paymentStatusFilter={paymentStatusFilter}
        onPaymentStatusFilterChange={setPaymentStatusFilter}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Orders Table */}
      <OrderTable
        orders={filteredOrders}
        loading={isLoading}
        pagination={ordersData?.pagination || {
          page: 1,
          limit: itemsPerPage,
          total: 0,
          totalPages: 1
        }}
        onViewDetails={handleViewDetails}
        onPageChange={handlePageChange}
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  )
}
