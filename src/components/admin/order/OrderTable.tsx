import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Eye, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AdminOrderResponse } from '@/routes/admin/order/-types'

interface OrderTableProps {
  orders: AdminOrderResponse[]
  loading: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onViewDetails: (order: AdminOrderResponse) => void
  onPageChange: (page: number) => void
}

const OrderTable = ({
  orders,
  loading,
  pagination,
  onViewDetails,
  onPageChange,
}: OrderTableProps) => {
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
      month: 'short',
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
      pending: 'Menunggu',
      paid: 'Dibayar',
      processing: 'Diproses',
      shipped: 'Dikirim',
      delivered: 'Selesai',
      cancelled: 'Dibatalkan'
    }

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-16 bg-card border rounded-lg">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Memuat data...</h2>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-16 bg-card border rounded-lg">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Belum ada pesanan</h2>
        <p className="text-muted-foreground">Tidak ada pesanan yang ditemukan</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pembayaran</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.uuid}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewDetails(order)}
              >
                <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-sm text-muted-foreground">{order.user.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{formatDate(order.created_at)}</TableCell>
                <TableCell>{order.items.length} item(s)</TableCell>
                <TableCell className="font-semibold">{formatPrice(order.total)}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <Badge variant={order.payment_status === 'paid' ? 'secondary' : 'outline'}>
                    {order.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewDetails(order)
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
          <div className="text-sm text-muted-foreground">
            Halaman {pagination.page} dari {pagination.totalPages}
            {' '}({pagination.total} total pesanan)
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Sebelumnya
            </Button>
            <Button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              variant="outline"
              size="sm"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderTable
