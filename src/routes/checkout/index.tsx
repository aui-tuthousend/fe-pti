import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
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

export const Route = createFileRoute('/checkout/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedPayment, setSelectedPayment] = useState('COD')
  const [showAllItems, setShowAllItems] = useState(false)

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

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Data order (dari cart)
  const orderData = {
    subtotal: 225000,
    shipping: 10000,
    serviceFee: 1000,
    discount: 22477,
    total: 213523
  }

  // Cart items untuk ditampilkan
  const cartItems = [
    {
      id: 1,
      name: "Hijab Segi Empat Premium",
      price: 89000,
      quantity: 2,
      image: "/user/modelhijab.jpg"
    },
    {
      id: 2,
      name: "Pashmina Kasmir Elegan",
      price: 125000,
      quantity: 1,
      image: "/user/modelhijab.jpg"
    },
    {
      id: 3,
      name: "Bergo Instant Daily",
      price: 65000,
      quantity: 1,
      image: "/user/modelhijab.jpg"
    },
    {
      id: 4,
      name: "Hijab Voal Polos",
      price: 75000,
      quantity: 2,
      image: "/user/modelhijab.jpg"
    },
    {
      id: 5,
      name: "Kerudung Syari",
      price: 95000,
      quantity: 1,
      image: "/user/modelhijab.jpg"
    }
  ]

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

  const paymentMethods = [
    { id: 'COD', name: 'Cash on Delivery', icon: '💰' },
    { id: 'BANK', name: 'Bank Transfer', icon: '🏦' },
    { id: 'CREDIT', name: 'Credit Card', icon: '💳' }
  ]

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
                Item Pesanan ({cartItems.length} item)
              </h2>

              <div className="space-y-4">
                {(showAllItems ? cartItems : cartItems.slice(0, 2)).map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}

                {cartItems.length > 2 && (
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
                          Lihat Lainnya ({cartItems.length - 2} item)
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
                  <span className="font-bold text-primary">{formatPrice(10000)}</span>
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
                  <span className="font-medium">{formatPrice(orderData.subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping Fee</span>
                  <span className="font-medium">{formatPrice(orderData.shipping)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="font-medium">{formatPrice(orderData.serviceFee)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-success">Discount (5%)</span>
                  <span className="font-medium text-success">-{formatPrice(orderData.discount)}</span>
                </div>

                <hr className="border-border" />

                <div className="flex justify-between text-lg font-bold pt-2">
                  <span className="text-foreground">Order Total</span>
                  <span className="text-primary">{formatPrice(orderData.total)}</span>
                </div>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <CreditCard size={18} />
                Place Order
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
