import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface OrderSearchFilterProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  paymentStatusFilter: string
  onPaymentStatusFilterChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

const OrderSearchFilter = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  paymentStatusFilter,
  onPaymentStatusFilterChange,
  onClearFilters,
  hasActiveFilters,
}: OrderSearchFilterProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Cari berdasarkan order number, nama, email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Status Pesanan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="paid">Dibayar</SelectItem>
            <SelectItem value="processing">Diproses</SelectItem>
            <SelectItem value="shipped">Dikirim</SelectItem>
            <SelectItem value="delivered">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Status Filter */}
        <Select value={paymentStatusFilter} onValueChange={onPaymentStatusFilterChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Status Pembayaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="unpaid">Belum Bayar</SelectItem>
            <SelectItem value="paid">Lunas</SelectItem>
            <SelectItem value="refunded">Refund</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="flex items-center gap-2"
          >
            <X size={16} />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Info */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Filter aktif:{' '}
          {searchQuery && <span className="font-medium">"{searchQuery}"</span>}
          {statusFilter && statusFilter !== 'all' && (
            <span className="font-medium ml-2">Status: {statusFilter}</span>
          )}
          {paymentStatusFilter && paymentStatusFilter !== 'all' && (
            <span className="font-medium ml-2">Pembayaran: {paymentStatusFilter}</span>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderSearchFilter
