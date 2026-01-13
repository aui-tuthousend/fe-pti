import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Navbar } from '../../components/navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Edit,
  X,
  CreditCard,
  Truck,
  MessageSquare,
  ShoppingBag,
  User,
  Phone,
  Home,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useGetCart } from '../cart/-hooks'
import { checkAuth } from '../login/-server'
import { User as UserType } from '../login/-utils'
import { toast } from 'sonner'
import { getImageUrl } from '@/config/env'
import { CartItemWithVariant } from '../cart/-types'
import { useCreateOrder } from '../admin/order/-hooks'

export const Route = createFileRoute('/checkout/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): { items?: string } => {
    return {
      items: typeof search.items === 'string' ? search.items : undefined
    }
  }
})

function RouteComponent() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const [user, setUser] = useState<UserType | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedPayment, setSelectedPayment] = useState('COD')
  const [showAllItems, setShowAllItems] = useState(false)

  // Use the mutation hook
  const { mutateAsync: createOrder, isPending: isSubmittingOrder } = useCreateOrder()

  // Parse selected cart item IDs from search params
  const selectedCartItemIds = search.items ? search.items.split(',') : []

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      const auth = await checkAuth()
      if (auth?.user) {
        setUser(auth.user)
        // Initialize userInfo with user data if available
        if (auth.user?.name) {
          setUserInfo(prev => ({
            ...prev,
            name: auth.user?.name || prev.name
          }))
          setTempUserInfo(prev => ({
            ...prev,
            name: auth.user?.name || prev.name
          }))
        }
      } else {
        navigate({ to: '/login' })
      }
    }
    fetchUser()
  }, [navigate])

  // Redirect if no items selected
  useEffect(() => {
    if (selectedCartItemIds.length === 0) {
      toast.error('Tidak ada item yang dipilih')
      navigate({ to: '/cart' })
    }
  }, [selectedCartItemIds, navigate])

  // Fetch cart data
  const { data: cartData, isLoading: isLoadingCart } = useGetCart(user?.token ?? null)

  // Filter only selected items
  const selectedItems: CartItemWithVariant[] = cartData?.items?.filter(item =>
    selectedCartItemIds.includes(item.uuid)
  ) || []

  // State untuk data diri
  const [userInfo, setUserInfo] = useState({
    name: 'Ahmad Budi Santoso',
    phone: '+62 812-3456-7890',
    address: 'Jl. Merdeka No. 123, RT 01/RW 02',
    city: 'Bandung',
    postalCode: '40123',
    province: 'Jawa Barat'
  })

  // Temporary state untuk edit
  const [tempUserInfo, setTempUserInfo] = useState(userInfo)

  // Calculate order totals from real data
  const subtotal = selectedItems.reduce((total, item) => total + (item.variant.price * item.quantity), 0)
  const shippingFee = 10000 // Fixed shipping for now
  const serviceFee = 1000 // Fixed service fee
  const discount = 0 // No discount for now
  const total = subtotal + shippingFee + serviceFee - discount

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleSaveUserInfo = () => {
    setUserInfo(tempUserInfo)
    setShowEditModal(false)
  }

  const handleCancelEdit = () => {
    setTempUserInfo(userInfo)
    setShowEditModal(false)
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu')
      navigate({ to: '/login' })
      return
    }

    try {
      await createOrder({
        token: user.token,
        cartItemIds: selectedCartItemIds,
        shipping_name: userInfo.name,
        shipping_phone: userInfo.phone,
        shipping_address: userInfo.address,
        shipping_city: userInfo.city,
        shipping_province: userInfo.province,
        shipping_postcode: userInfo.postalCode,
        shipping_notes: message || undefined,
        payment_method: selectedPayment
      })

      toast.success('Pesanan berhasil dibuat!', {
        description: 'Anda akan segera dihubungi untuk konfirmasi pembayaran'
      })

      // Redirect to home or order confirmation page
      setTimeout(() => {
        navigate({ to: '/' })
      }, 1500)
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Gagal membuat pesanan', {
        description: 'Silakan coba lagi'
      })
    }
  }

  const paymentMethods = [
    { id: 'COD', name: 'Cash on Delivery', icon: '💰' },
    { id: 'BANK', name: 'Bank Transfer', icon: '🏦' },
    { id: 'CREDIT', name: 'Credit Card', icon: '💳' }
  ]

  if (!user || isLoadingCart) {
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
        <div className="mb-8 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary mb-1">Checkout</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    bayar pesanan Anda
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping Address Card */}
            <div className="bg-card border border-primary rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Alamat Pengiriman
                </h2>
                <Button
                  onClick={() => setShowEditModal(true)}
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 hover:shadow-md hover:scale-105"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Change
                </Button>
              </div>

              <div className="space-y-2 text-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{userInfo.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{userInfo.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Home className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{userInfo.address}</p>
                    <p>{userInfo.city}, {userInfo.province} {userInfo.postalCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Items Summary */}
            <div className="bg-card border border-primary rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Item Pesanan ({selectedItems.length} item)
              </h2>

              <div className="space-y-4">
                {(showAllItems ? selectedItems : selectedItems.slice(0, 2)).map((item) => {
                  const imageUrl = item.variant.images && item.variant.images.length > 0
                    ? getImageUrl(item.variant.images[0].url) ?? '/user/modelhijab.jpg'
                    : '/user/modelhijab.jpg'

                  return (
                    <div key={item.uuid} className="flex gap-4 items-center">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={item.variant.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{item.variant.product.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.variant.title} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{formatPrice(item.variant.price * item.quantity)}</p>
                      </div>
                    </div>
                  )
                })}

                {selectedItems.length > 2 && (
                  <div className="pt-2 border-t border-border">
                    <Button
                      onClick={() => setShowAllItems(!showAllItems)}
                      variant="outline"
                      size="sm"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
                    >
                      {showAllItems ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Sembunyikan
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Lihat Lainnya ({selectedItems.length - 2} item)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="bg-card border border-primary rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Pesan (Optional)
              </h2>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a message..."
                className="w-full bg-background border border-primary rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                rows={3}
              />
            </div>

            {/* Shipping Options */}
            <div className="bg-card border border-primary rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Opsi Pengiriman
              </h2>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">J&T Express</span>
                  </div>
                  <span className="font-bold text-primary">{formatPrice(shippingFee)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Estimasi 2-3 hari kerja</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-card border border-primary rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Metode Pembayaran
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${selectedPayment === method.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className="font-medium text-sm">{method.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-primary rounded-lg p-6 shadow-sm sticky top-20">
              <h2 className="text-xl font-bold text-primary mb-6">Order Total</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping Fee</span>
                  <span className="font-medium">{formatPrice(shippingFee)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="font-medium">{formatPrice(serviceFee)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-success">Discount</span>
                    <span className="font-medium text-success">-{formatPrice(discount)}</span>
                  </div>
                )}

                <hr className="border-border" />

                <div className="flex justify-between text-lg font-bold pt-2">
                  <span className="text-foreground">Order Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isSubmittingOrder}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmittingOrder ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Place Order
                  </>
                )}
              </Button>

              <div className="mt-4 text-xs text-muted-foreground text-center">
                <p>Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Address Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-primary rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-primary">Edit Alamat Pengiriman</h3>
                <button
                  onClick={handleCancelEdit}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Nama Lengkap</label>
                  <input
                    type="text"
                    value={tempUserInfo.name}
                    onChange={(e) => setTempUserInfo({ ...tempUserInfo, name: e.target.value })}
                    className="w-full bg-background border border-primary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Nomor Telepon</label>
                  <input
                    type="text"
                    value={tempUserInfo.phone}
                    onChange={(e) => setTempUserInfo({ ...tempUserInfo, phone: e.target.value })}
                    className="w-full bg-background border border-primary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Alamat Lengkap</label>
                  <textarea
                    value={tempUserInfo.address}
                    onChange={(e) => setTempUserInfo({ ...tempUserInfo, address: e.target.value })}
                    className="w-full bg-background border border-primary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Kota</label>
                    <input
                      type="text"
                      value={tempUserInfo.city}
                      onChange={(e) => setTempUserInfo({ ...tempUserInfo, city: e.target.value })}
                      className="w-full bg-background border border-primary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Kode Pos</label>
                    <input
                      type="text"
                      value={tempUserInfo.postalCode}
                      onChange={(e) => setTempUserInfo({ ...tempUserInfo, postalCode: e.target.value })}
                      className="w-full bg-background border border-primary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Provinsi</label>
                  <input
                    type="text"
                    value={tempUserInfo.province}
                    onChange={(e) => setTempUserInfo({ ...tempUserInfo, province: e.target.value })}
                    className="w-full bg-background border border-primary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveUserInfo}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Simpan
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
