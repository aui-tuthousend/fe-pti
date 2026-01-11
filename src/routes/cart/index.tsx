import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
// import { Navbar } from '../../components/navbar'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ShoppingBag, Tag, Gift, X } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/Footer'
// import { SuccessAlert } from '@/components/ui/SuccesAlert'

export const Route = createFileRoute('/cart/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([1, 2, 3, 4]) // Default semua item dipilih
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [showMobileSummary, setShowMobileSummary] = useState(false)

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Data keranjang belanja
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Hijab Segi Empat Premium",
      price: 89000,
      originalPrice: 120000,
      quantity: 2,
      image: "/user/modelhijab.jpg",
      color: "Dusty Pink",
      size: "110cm x 110cm",
      discount: 26
    },
    {
      id: 2,
      name: "Pashmina Kasmir Elegan",
      price: 125000,
      originalPrice: 180000,
      quantity: 1,
      image: "/user/modelhijab.jpg",
      color: "Navy Blue",
      size: "75cm x 200cm",
      discount: 31
    },
    {
      id: 3,
      name: "Bergo Instant Daily",
      price: 65000,
      originalPrice: 85000,
      quantity: 3,
      image: "/user/modelhijab.jpg",
      color: "Cream",
      size: "One Size",
      discount: 24
    }, {
      id: 4,
      name: "Bergo Instant Daily",
      price: 65000,
      originalPrice: 85000,
      quantity: 3,
      image: "/user/modelhijab.jpg",
      color: "Cream",
      size: "One Size",
      discount: 24
    }, {
      id: 5,
      name: "Bergo Instant Daily",
      price: 65000,
      originalPrice: 85000,
      quantity: 3,
      image: "/user/modelhijab.jpg",
      color: "Cream",
      size: "One Size",
      discount: 24
    }, {
      id: 6,
      name: "Bergo Instant Daily",
      price: 65000,
      originalPrice: 85000,
      quantity: 3,
      image: "/user/modelhijab.jpg",
      color: "Cream",
      size: "One Size",
      discount: 24
    }
  ])

  // Fungsi untuk toggle select item
  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  // Fungsi untuk select/deselect semua item
  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cartItems.map(item => item.id))
    }
  }

  // Fungsi untuk update quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  // Fungsi untuk hapus item dengan konfirmasi
  const handleDeleteClick = (id: number) => {
    setShowDeleteConfirm(id)
  }

  const confirmDelete = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
    setSelectedItems(prev => prev.filter(itemId => itemId !== id))
    setShowDeleteConfirm(null)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  // Fungsi untuk hapus item (legacy - sekarang menggunakan konfirmasi)
  const removeItem = (id: number) => {
    handleDeleteClick(id)
  }

  // Fungsi untuk apply promo code
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'hijab10') {
      setAppliedPromo('HIJAB10')
      setPromoCode('')
    } else if (promoCode.toLowerCase() === 'newcustomer') {
      setAppliedPromo('NEWCUSTOMER')
      setPromoCode('')
    } else {
      alert('Kode promo tidak valid')
    }
  }

  // Perhitungan total
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id))
  const subtotal = selectedCartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const promoDiscount = appliedPromo === 'HIJAB10' ? subtotal * 0.1 : appliedPromo === 'NEWCUSTOMER' ? 25000 : 0
  const shippingFee = subtotal > 150000 ? 0 : 15000
  const total = subtotal - promoDiscount + shippingFee

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header - Modern Design */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary mb-1">Keranjang Belanja</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    {cartItems.length} item dalam keranjang Anda
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Subtle gradient line */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart
          (<div className="text-center py-16">
            <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Keranjang Kosong</h2>
            <p className="text-muted-foreground mb-6">Yuk, mulai belanja koleksi hijab terbaik kami!</p>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
            >
              Mulai Belanja
            </Button>
          </div>)
        ) : (
          // Cart with Items
          (<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Side - Cart Items (3/4 width) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Select All Header */}
              <div className="bg-card border border-primary rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSelectAll}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedItems.length === cartItems.length
                      ? 'bg-primary border-primary text-primary-foreground'
                      : selectedItems.length > 0
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'border-border hover:border-primary'
                      }`}
                  >
                    {selectedItems.length === cartItems.length && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {selectedItems.length > 0 && selectedItems.length < cartItems.length && (
                      <div className="w-2 h-2 bg-primary rounded-sm"></div>
                    )}
                  </button>
                  <span className="font-medium text-foreground">
                    {selectedItems.length === cartItems.length
                      ? 'Semua item dipilih'
                      : selectedItems.length === 0
                        ? 'Pilih semua item'
                        : `${selectedItems.length} dari ${cartItems.length} item dipilih`
                    }
                  </span>
                </div>
              </div>

              {cartItems.map((item) => {
                const isSelected = selectedItems.includes(item.id)
                return (
                  <div key={item.id} className={`bg-card border border-primary rounded-lg p-6 shadow-sm transition-all ${isSelected ? 'border-primary/50 bg-primary/5' : 'border-border'
                    }`}>
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <div className="flex-shrink-0 pt-1">
                        <button
                          onClick={() => toggleSelectItem(item.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                            }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                        <div className="text-sm text-muted-foreground mb-2">
                          <p>Warna: {item.color}</p>
                          <p>Ukuran: {item.size}</p>
                        </div>

                        {/* Price - Perbaikan jarak */}
                        <div className="flex items-center gap-1 mb-3">
                          <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                          <span className="text-sm text-muted-foreground line-through ml-1">
                            {formatPrice(item.originalPrice)}
                          </span>
                          <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded ml-1">
                            -{item.discount}%
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-primary flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-primary flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Item Total dan Tombol Hapus */}
                      <div className="text-right flex flex-col items-end gap-3">
                        {/* Item Total */}
                        <p className="font-bold text-lg text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </p>

                        {/* Tombol Hapus - Posisi baru di bawah total */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 transition-all duration-200 text-sm font-medium group hover:scale-105 shadow-sm hover:shadow-md"
                          title="Hapus item dari keranjang"
                        >
                          <div className="w-6 h-6 rounded-full bg-red-100 group-hover:bg-red-200 flex items-center justify-center transition-all">
                            <Trash2 size={14} className="group-hover:scale-110 transition-transform text-red-600" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Right Side - Windows */}
            <div className="lg:col-span-1">
              {/* Desktop Summary */}
              <div className="hidden lg:block bg-card border border-primary rounded-lg p-6 shadow-sm sticky top-24 self-start max-w-sm w-full">

                <h2 className="text-xl font-bold text-primary mb-6">Ringkasan Pesanan</h2>

                {/* Promo Code - Perbaikan proporsi */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Kode Promo
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-[70%]">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Masukkan kode"
                        className="w-full text-muted-foreground bg-background border border-primary rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>
                    <Button
                      onClick={applyPromoCode}
                      size="sm"
                      variant="outline"
                      className="flex-[30%] border-primary text-primary hover:text-white transition-all duration-200 hover:shadow-md hover:scale-110"
                    >
                      Apply
                    </Button>
                  </div>

                  {appliedPromo && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-success">
                      <Gift size={14} />
                      <span>Promo {appliedPromo} diterapkan</span>
                    </div>
                  )}
                </div>

                {/* Order Details - Perbaikan ruang vertikal */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({selectedCartItems.reduce((total, item) => total + item.quantity, 0)} item terpilih)
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-success">Diskon Promo</span>
                      <span className="font-medium text-success">-{formatPrice(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm pb-4">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? 'GRATIS' : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <hr className="border-border" />

                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout Button - Perbaikan ukuran dan ikon */}
                <Link
                  to="/checkout/"
                  className={selectedItems.length === 0 || subtotal === 0 ? 'pointer-events-none' : ''}
                >
                  <Button
                    disabled={selectedItems.length === 0 || subtotal === 0}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    {selectedItems.length === 0
                      ? 'Pilih item untuk checkout'
                      : `Checkout ${selectedItems.length} item`
                    }
                  </Button>
                </Link>

                {/* Additional Info */}
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  <p className="mt-1">Pembayaran aman dengan berbagai metode</p>
                </div>
              </div>
            </div>
          </div>)
        )}

        {/* Floating Toggle Button for Mobile */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowMobileSummary(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <span className="font-medium">Ringkasan Pesanan</span>
          </button>
        </div>

        {/* Mobile Summary Modal */}
        {showMobileSummary && (
          <div className="lg:hidden fixed inset-0 bg-black/50 flex items-end z-50">
            <div className="bg-card border-t border-primary rounded-t-2xl w-full max-h-[80vh] overflow-y-auto transform transition-transform duration-300 ease-out">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-primary sticky top-0 bg-card">
                <h2 className="text-xl font-bold text-primary">Ringkasan Pesanan</h2>
                <button
                  onClick={() => setShowMobileSummary(false)}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Promo Code - Mobile */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Kode Promo
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-[70%]">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Masukkan kode"
                        className="w-full bg-background border border-primary rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      />
                    </div>
                    <Button
                      onClick={applyPromoCode}
                      size="sm"
                      variant="outline"
                      className="flex-[30%] border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 hover:shadow-md hover:scale-105"
                    >
                      Apply
                    </Button>
                  </div>

                  {appliedPromo && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-success">
                      <Gift size={14} />
                      <span>Promo {appliedPromo} diterapkan</span>
                    </div>
                  )}
                </div>

                {/* Order Details - Mobile */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({selectedCartItems.reduce((total, item) => total + item.quantity, 0)} item terpilih)
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-success">Diskon Promo</span>
                      <span className="font-medium text-success">-{formatPrice(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm pb-4">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? 'GRATIS' : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <hr className="border-border" />

                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout Button - Mobile */}
                <Link
                  to="/checkout"
                  className={selectedItems.length === 0 || subtotal === 0 ? 'pointer-events-none' : ''}
                >
                  <Button
                    disabled={selectedItems.length === 0 || subtotal === 0}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                    onClick={() => setShowMobileSummary(false)}
                  >
                    <ShoppingBag size={18} />
                    {selectedItems.length === 0
                      ? 'Pilih item untuk checkout'
                      : `Checkout ${selectedItems.length} item`
                    }
                  </Button>
                </Link>

                {/* Additional Info - Mobile */}
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  <p className="mt-1">Pembayaran aman dengan berbagai metode</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Konfirmasi Hapus */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-primary rounded-lg p-6 max-w-sm mx-4 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Trash2 size={20} className="text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Hapus Item</h3>
                  <p className="text-sm text-muted-foreground">
                    Yakin ingin menghapus item ini dari keranjang?
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={cancelDelete}
                  variant="outline"
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  onClick={() => confirmDelete(showDeleteConfirm)}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
