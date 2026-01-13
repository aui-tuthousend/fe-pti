# Admin Order Page - Table Layout Update

## Overview
Halaman admin order telah di-refactor dari card-based layout menjadi **table-based layout** dengan modal detail, mengikuti pattern yang sama dengan halaman `/admin/product`.

## New Components Created

### 1. **OrderTable.tsx** (`/components/admin/order/OrderTable.tsx`)
- Table layout untuk menampilkan list orders
- Kolom: Order Number, Pelanggan, Tanggal, Items, Total, Status, Pembayaran, Actions
- Badge untuk status indicators
- Pagination controls
- Click handler untuk view details
- Loading dan empty states

### 2. **OrderDetailModal.tsx** (`/components/admin/order/OrderDetailModal.tsx`)
- Modal dialog untuk menampilkan detail lengkap order
- Sections:
  - **Status**: Order status dan payment status dengan badges
  - **Customer Info**: Nama, email, telepon pelanggan
  - **Shipping Address**: Alamat pengiriman lengkap dengan nomor resi
  - **Order Items**: List produk dengan gambar, SKU, quantity, harga
  - **Order Summary**: Subtotal, ongkir, pajak, diskon, total
- Scrollable content untuk orders dengan banyak items
- Sticky header dan footer

### 3. **OrderSearchFilter.tsx** (`/components/admin/order/OrderSearchFilter.tsx`)
- Search bar untuk mencari order by:
  - Order number
  - Nama pelanggan
  - Email pelanggan
  - Shipping name
- Filter dropdown untuk:
  - **Order Status**: pending, paid, processing, shipped, delivered, cancelled
  - **Payment Status**: unpaid, paid, refunded
- Clear filters button
- Active filters indicator

### 4. **UI Components**
Created missing shadcn/ui components:
- `Badge.tsx` - Status indicators dengan variants
- `Select.tsx` - Dropdown select menggunakan Radix UI
- `Table.tsx` - Table components (Table, TableHeader, TableBody, TableRow, TableCell, dll)

## Updated Files

### `/routes/admin/order/index.tsx`
**Before**: Card-based layout dengan semua order details visible
**After**: Table layout dengan modal detail

**Key Changes**:
- Import komponen table, modal, dan filter
- Added filter states: `searchQuery`, `statusFilter`, `paymentStatusFilter`
- Client-side filtering logic
- Click handler untuk membuka modal detail
- Cleaner, more organized UI

**Features**:
- ✅ Table view dengan pagination
- ✅ Search functionality
- ✅ Status filtering (order & payment)
- ✅ Modal detail view on item click
- ✅ Consistent dengan halaman product

## User Flow

1. **Landing**: User melihat table dengan list orders
2. **Search**: User bisa search berdasarkan order number, nama, atau email
3. **Filter**: User bisa filter by status order atau payment status
4. **View Details**: Click pada row atau tombol "Eye" icon untuk membuka modal
5. **Modal**: Modal menampilkan semua detail order secara lengkap
6. **Close**: Click "Tutup" button atau X untuk menutup modal
7. **Pagination**: Navigate antar halaman jika orders > 10

## Features Comparison

| Feature | Card Layout (Old) | Table Layout (New) |
|---------|------------------|-------------------|
| **View Mode** | All details visible | Summary in table, details in modal |
| **Scan-ability** | Poor | Excellent |
| **Search** | ❌ No | ✅ Yes |
| **Filter** | ❌ No | ✅ Yes (status + payment) |
| **Space Efficiency** | Low | High |
| **Load Time** | Slower (more DOM) | Faster (less DOM) |
| **Mobile Friendly** | Medium | Better with responsive table |

## Technical Details

### Filtering Logic
```typescript
// Client-side filtering untuk optimal UX
const filteredOrders = ordersData?.data.filter(order => {
  const matchesSearch = !searchQuery ||
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user.email.toLowerCase().includes(searchQuery.toLowerCase())

  const matchesStatus = statusFilter === 'all' || order.status === statusFilter
  const matchesPaymentStatus = paymentStatusFilter === 'all' || 
    order.payment_status === paymentStatusFilter

  return matchesSearch && matchesStatus && matchesPaymentStatus
})
```

### Status Badges
Menggunakan variant colors yang konsisten:
- `pending` → outline (yellow)
- `paid` → secondary (green)
- `processing` → default (blue)
- `shipped` → default (purple)
- `delivered` → secondary (green)
- `cancelled` → destructive (red)

### Performance
- Pagination server-side (10 items per page)
- Filtering client-side untuk instant response
- Modal lazy-loaded (hanya render ketika dibuka)
- Images lazy-loaded dalam modal

## Screenshots Layout

**Table View**:
```
┌─────────────────────────────────────────────────────────────┐
│ Manajemen Pesanan (100 total pesanan)                       │
├─────────────────────────────────────────────────────────────┤
│ [Search...] [Status Filter▼] [Payment Filter▼] [Clear]     │
├─────────────────────────────────────────────────────────────┤
│ Order # │ Pelanggan │ Tanggal │ Items │ Total │ Status │...│
├─────────┼───────────┼─────────┼───────┼───────┼────────┼───┤
│ #001    │ John Doe  │ 14 Jan  │ 3     │ 500K  │ Paid   │👁 │
│ #002    │ Jane Doe  │ 13 Jan  │ 1     │ 200K  │ Pending│👁 │
└─────────────────────────────────────────────────────────────┘
```

**Modal View**:
```
┌─────────────────────────────────────────┐
│ Order #001                          [X] │
├─────────────────────────────────────────┤
│ Status Badges                           │
│ Customer Info Section                   │
│ Shipping Address Section                │
│ Order Items Section (with images)       │
│ Order Summary Section                   │
├─────────────────────────────────────────┤
│                         [Tutup Button]  │
└─────────────────────────────────────────┘
```

## Future Enhancements
- [ ] Add status update functionality in modal
- [ ] Export orders to CSV/Excel
- [ ] Date range filter
- [ ] Bulk actions (multi-select)
- [ ] Print invoice from modal
- [ ] Order timeline/history
- [ ] Real-time updates dengan WebSocket

## Migration Notes
- ✅ No breaking changes to data structure
- ✅ Uses existing hooks (`useGetAdminOrders`)
- ✅ All existing functionality preserved
- ✅ Better UX with same data
