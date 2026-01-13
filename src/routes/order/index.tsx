import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/Footer'
import { checkAuth } from '../login/-server'
import { User as UserType } from '../login/-utils'
import { useGetUserOrders } from '../admin/order/-hooks'
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react'
import { getImageUrl } from '@/config/env'

export const Route = createFileRoute('/order/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [user, setUser] = useState<UserType | null>(null)

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

  // Fetch user's orders
  const { data: orders, isLoading } = useGetUserOrders(user?.token ?? null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Menunggu Pembayaran',
      paid: 'Dibayar',
      processing: 'Diproses',
      shipped: 'Dikirim',
      delivered: 'Selesai',
      cancelled: 'Dibatalkan'
    }
    return statusMap[status] || status
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Memuat...</h2>
            <p className="text-muted-foreground">Mohon tunggu sebentar</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary mb-1">Pesanan Saya</h1>
              <p className="text-muted-foreground">Lihat semua pesanan Anda</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        </div>

        {/* Orders List */}
        {!orders || !Array.isArray(orders) || orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Belum ada pesanan</h2>
            <p className="text-muted-foreground">Anda belum memiliki pesanan apapun</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.uuid} className="bg-card border border-primary/20 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(order.status)}
                      <h3 className="font-bold text-foreground">Order #{order.orderNumber}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                      }`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => {
                    const imageUrl = item.variant.images && item.variant.images.length > 0
                      ? getImageUrl(item.variant.images[0].url) ?? '/user/modelhijab.jpg'
                      : '/user/modelhijab.jpg'

                    return (
                      <div key={item.uuid} className="flex gap-4 items-center">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={imageUrl}
                            alt={item.variant_title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.product_title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.variant_title} • Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{formatPrice(item.subtotal)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Order Summary */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>Pengiriman: {formatPrice(order.shipping_cost)}</p>
                      {order.tracking_number && (
                        <p className="mt-1">Resi: <span className="font-mono text-foreground">{order.tracking_number}</span></p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Total Pesanan</p>
                      <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
