import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { checkAuth } from '@/routes/login/-server'
import { useGetAdminOrders } from './order/-hooks'
import { useProductStore } from '@/features/product/hooks'
import OrderTable from '@/components/admin/order/OrderTable'
import { Package, ShoppingBag, TrendingUp, AlertCircle } from 'lucide-react'
import { AdminOrderResponse } from '@/routes/admin/order/-types'
import OrderDetailModal from '@/components/admin/order/OrderDetailModal'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [token, setToken] = useState<string | null>(null)

  // States specific to order modal
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderResponse | null>(null)

  const { data: ordersData, isLoading: isLoadingOrders, isError: isErrorOrders } = useGetAdminOrders(token, 1, 5)

  const { pagination: productPagination, GetPaginatedProducts } = useProductStore()

  useEffect(() => {
    const init = async () => {
      const auth = await checkAuth()
      if (auth?.user?.token) {
        setToken(auth.user.token)
      }
      // Fetch product stats
      GetPaginatedProducts('', 1, 1) // limit 1 since we only need pagination.total
    }
    init()
  }, [])

  const orders = ordersData?.data || []

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas toko dan pesanan terbaru.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Products Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Produk</h3>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{productPagination.total || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Produk terdaftar di katalog
          </p>
        </div>

        {/* Total Orders Card - Might be 0 if endpoint doesn't exist */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Pesanan</h3>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">
            {isErrorOrders ? 'N/A' : (ordersData?.pagination?.total || 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isErrorOrders ? 'API pesanan belum tersedia' : 'Pesanan masuk sistem'}
          </p>
        </div>

        {/* Revenue placeholder */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Pendapatan</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">Rp 0</div>
          <p className="text-xs text-muted-foreground mt-1">
            Sedang dalam pengembangan
          </p>
        </div>
      </div>

      {isErrorOrders && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3 text-amber-800 dark:text-amber-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">Pemberitahuan Sistem</p>
            <p className="text-sm mt-1">Endpoint pesanan backend (<code>/api/admin/orders</code>) belum terimplementasi. Tabel pesanan di bawah tidak akan menampilkan data riil hingga endpoint tersebut tersedia.</p>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Pesanan Terbaru</h2>
        </div>

        <OrderTable
          orders={orders}
          loading={isLoadingOrders && !isErrorOrders}
          pagination={{
            page: 1,
            limit: 5,
            total: orders.length,
            totalPages: 1
          }}
          onViewDetails={setSelectedOrder}
          onPageChange={() => { }}
        />
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}
