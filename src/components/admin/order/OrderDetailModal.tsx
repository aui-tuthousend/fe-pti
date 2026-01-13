import { AdminOrderResponse } from '../../../routes/admin/order/-types'
import { X, User, MapPin, Truck, Package, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getImageUrl } from '@/config/env'

interface OrderDetailModalProps {
  order: AdminOrderResponse
  onClose: () => void
}

const OrderDetailModal = ({ order, onClose }: OrderDetailModalProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      paid: 'secondary',
      processing: 'default',
      shipped: 'default',
      delivered: 'secondary',
      cancelled: 'destructive'
    }

    const labels: Record<string, string> = {
      pending: 'Menunggu Pembayaran',
      paid: 'Dibayar',
      processing: 'Diproses',
      shipped: 'Dikirim',
      delivered: 'Selesai',
      cancelled: 'Dibatalkan'
    }

    return (
      <Badge variant={variants[status] || 'default'} className="text-sm">
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Order #{order.orderNumber}</h2>
              <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status Pesanan</p>
              {getStatusBadge(order.status)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status Pembayaran</p>
              <Badge variant={order.payment_status === 'paid' ? 'secondary' : 'outline'}>
                {order.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
              </Badge>
            </div>
            {order.payment_method && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Metode Pembayaran</p>
                <p className="font-medium">{order.payment_method}</p>
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Informasi Pelanggan</h3>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Nama</p>
                <p className="font-medium">{order.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.user.email}</p>
              </div>
              {order.user.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Telepon</p>
                  <p className="font-medium">{order.user.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Alamat Pengiriman</h3>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Penerima</p>
                <p className="font-medium">{order.shipping_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telepon</p>
                <p className="font-medium">{order.shipping_phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alamat</p>
                <p className="font-medium">{order.shipping_address}</p>
                <p className="font-medium">
                  {order.shipping_city}, {order.shipping_province} {order.shipping_postcode}
                </p>
              </div>
              {order.shipping_notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Catatan</p>
                  <p className="font-medium italic">{order.shipping_notes}</p>
                </div>
              )}
              {order.tracking_number && (
                <div>
                  <p className="text-sm text-muted-foreground">Nomor Resi</p>
                  <p className="font-mono font-medium">{order.tracking_number}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Item Pesanan ({order.items.length})</h3>
            </div>
            <div className="space-y-3">
              {order.items.map((item) => {
                const imageUrl = item.variant.images && item.variant.images.length > 0
                  ? getImageUrl(item.variant.images[0].url) ?? '/user/modelhijab.jpg'
                  : '/user/modelhijab.jpg'

                return (
                  <div key={item.uuid} className="flex gap-4 items-center p-4 bg-muted/50 rounded-lg">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={item.variant_title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{item.product_title}</h4>
                      <p className="text-sm text-muted-foreground">{item.variant_title}</p>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">{formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Ringkasan Pesanan</h3>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-medium">{formatPrice(order.subtotal)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Ongkos Kirim</p>
                <p className="font-medium">{formatPrice(order.shipping_cost)}</p>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Pajak</p>
                  <p className="font-medium">{formatPrice(order.tax)}</p>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <p className="text-success">Diskon</p>
                  <p className="font-medium text-success">-{formatPrice(order.discount)}</p>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-2xl font-bold text-primary">{formatPrice(order.total)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t p-6 flex justify-end gap-3">
          <Button onClick={onClose} variant="outline">
            Tutup
          </Button>
          {/* Optional: Add status update buttons here */}
        </div>
      </div>
    </div>
  )
}

export default OrderDetailModal
