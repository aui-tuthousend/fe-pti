import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { 
  Heart, 
  Share2, 
  Star, 
  Minus, 
  Plus, 
  ShoppingCart, 
  ChevronLeft,
  ChevronRight,
  User,
  ThumbsUp,
  MessageCircle
} from 'lucide-react'

export const Route = createFileRoute('/catalog/$productId')({
  component: ProductDetailPage,
})

function ProductDetailPage() {
  // Ambil productId dari URL params atau localStorage sebagai fallback
  const params = useParams({ from: '/catalog/$productId' })
  const productId = params.productId || localStorage.getItem('selectedProductId') || "1"
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Data produk yang sama dengan katalog
  const products = [
    {
      id: 1,
      name: "Hijab Segi Empat Premium Silk",
      category: "Segi Empat",
      price: 89000,
      originalPrice: 120000,
      discount: 26,
      rating: 4.8,
      reviews: 124,
      colors: ["Dusty Pink", "Navy", "Cream", "Black"],
      sizes: ["110x110cm"],
      image: "/user/modelhijab.jpg",
      images: ["/user/modelhijab.jpg", "/user/modelhijab.jpg", "/user/modelhijab.jpg"],
      description: "Hijab segi empat premium dengan bahan silk berkualitas tinggi",
      stock: 15,
      isBestseller: true
    },
    {
      id: 2,
      name: "Pashmina Kasmir Elegan",
      category: "Pashmina",
      price: 125000,
      originalPrice: 180000,
      discount: 31,
      rating: 4.9,
      reviews: 89,
      colors: ["Navy Blue", "Maroon", "Grey", "Beige"],
      sizes: ["75x200cm"],
      image: "/user/modelhijab.jpg",
      images: ["/user/modelhijab.jpg", "/user/modelhijab.jpg"],
      description: "Pashmina kasmir dengan tekstur lembut dan hangat",
      stock: 8,
      isBestseller: false
    },
    {
      id: 3,
      name: "Bergo Instant Daily Comfort",
      category: "Bergo",
      price: 65000,
      originalPrice: 85000,
      discount: 24,
      rating: 4.6,
      reviews: 203,
      colors: ["Cream", "Brown", "Black", "Navy"],
      sizes: ["One Size"],
      image: "/user/modelhijab.jpg",
      images: ["/user/modelhijab.jpg", "/user/modelhijab.jpg", "/user/modelhijab.jpg"],
      description: "Bergo instant dengan bahan jersey premium untuk pemakaian sehari-hari",
      stock: 25,
      isBestseller: true
    },
    {
      id: 4,
      name: "Hijab Voal Polos Premium",
      category: "Voal",
      price: 75000,
      originalPrice: 95000,
      discount: 21,
      rating: 4.7,
      reviews: 156,
      colors: ["White", "Cream", "Pink", "Blue"],
      sizes: ["115x115cm"],
      image: "/user/modelhijab.jpg",
      images: ["/user/modelhijab.jpg", "/user/modelhijab.jpg"],
      description: "Hijab voal dengan bahan ringan dan adem untuk cuaca tropis",
      stock: 18,
      isBestseller: false
    },
    {
      id: 5,
      name: "Kerudung Syari Wolfis",
      category: "Syari",
      price: 95000,
      originalPrice: 120000,
      discount: 21,
      rating: 4.5,
      reviews: 67,
      colors: ["Black", "Navy", "Brown", "Grey"],
      sizes: ["One Size"],
      image: "/user/modelhijab.jpg",
      images: ["/user/modelhijab.jpg", "/user/modelhijab.jpg", "/user/modelhijab.jpg"],
      description: "Kerudung syari dengan bahan wolfis untuk tampilan yang lebih menutup",
      stock: 12,
      isBestseller: false
    },
    {
      id: 6,
      name: "Hijab Organza Glitter Party",
      category: "Organza",
      price: 145000,
      originalPrice: 200000,
      discount: 28,
      rating: 4.8,
      reviews: 45,
      colors: ["Gold", "Silver", "Rose Gold", "Champagne"],
      sizes: ["120x120cm"],
      image: "/user/modelhijab.jpg",
      images: ["/user/modelhijab.jpg", "/user/modelhijab.jpg"],
      description: "Hijab organza dengan sentuhan glitter untuk acara formal",
      stock: 6,
      isBestseller: false
    }
  ]

  // Cari produk berdasarkan ID
  const product = products.find(p => p.id === parseInt(productId)) || products[0]

  // Atur pilihan default
  useEffect(() => {
    if (!selectedColor && product.colors.length > 0) {
      setSelectedColor(product.colors[0])
    }
    if (!selectedSize && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0])
    }
  }, [product, selectedColor, selectedSize])

  // Data produk diperluas untuk halaman detail
  const productDetailData = {
    ...product,
    totalReviews: product.reviews,
    sold: Math.floor(Math.random() * 2000) + 500, //jumlah terjual diacak
    specifications: {
      material: getProductMaterial(product.category),
      care: "Hand wash dengan air dingin atau dry clean",
      weight: "120-200 gram",
      origin: "Indonesia"
    },
    features: getProductFeatures(product.category),
    reviewList: generateReviews(product.reviews)
  }

  function getProductMaterial(category: string) {
    const materials: { [key: string]: string } = {
      "Segi Empat": "100% Silk Premium",
      "Pashmina": "100% Kasmir",
      "Bergo": "Jersey Premium",
      "Voal": "Voal Premium",
      "Syari": "Wolfis",
      "Organza": "Organza Glitter"
    }
    return materials[category] || "Premium Material"
  }

  function getProductFeatures(category: string) {
    const baseFeatures = [
      "Bahan berkualitas tinggi dan lembut",
      "Tidak mudah kusut dan tahan lama",
      "Warna tidak mudah pudar",
      "Tersedia berbagai pilihan warna",
      "Cocok untuk segala usia"
    ]
    
    const categoryFeatures: { [key: string]: string[] } = {
      "Segi Empat": [...baseFeatures, "Mudah diatur dan versatile", "Tekstur halus dan jatuh elegan"],
      "Pashmina": [...baseFeatures, "Tekstur lembut dan hangat", "Cocok untuk cuaca dingin"],
      "Bergo": [...baseFeatures, "Instant dan praktis", "Nyaman untuk aktivitas sehari-hari"],
      "Voal": [...baseFeatures, "Ringan dan adem", "Cocok untuk cuaca tropis"],
      "Syari": [...baseFeatures, "Menutup dengan sempurna", "Desain syari yang elegan"],
      "Organza": [...baseFeatures, "Berkilau untuk acara formal", "Tekstur mewah dan elegan"]
    }
    
    return categoryFeatures[category] || baseFeatures
  }

  function generateReviews(reviewCount: number) {
    const users = ["Siti Aminah", "Fatimah R.", "Maya Sari", "Aisyah K.", "Dewi S.", "Nurul H."]
    const comments = [
      "Hijabnya bagus banget! Bahannya halus dan jatuhnya elegan. Puas dengan pembelian ini.",
      "Kualitas sesuai harga. Warnanya cantik dan tidak mudah kusut. Recommended!",
      "Sudah order berkali-kali, selalu puas. Hijab favorit saya!",
      "Bahannya lembut dan nyaman dipakai seharian. Worth it!",
      "Pengiriman cepat, produk sesuai deskripsi. Terima kasih!",
      "Warnanya cantik banget, sesuai dengan foto. Puas belanja di sini!"
    ]
    
    return Array.from({ length: Math.min(reviewCount, 6) }, (_, i) => ({
      id: i + 1,
      user: users[i % users.length],
      rating: Math.floor(Math.random() * 2) + 4,
      comment: comments[i % comments.length],
      date: `${Math.floor(Math.random() * 30) + 1} hari lalu`,
      helpful: Math.floor(Math.random() * 20) + 5,
      images: Math.random() > 0.5 ? ["/user/modelhijab.jpg"] : []
    }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)
    } else {
      setSelectedImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/catalog" className="hover:text-primary transition-colors">
            Catalog
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            {/* Gambar Utama */}
            <div className="relative aspect-[4/5] max-w-md mx-auto bg-muted rounded-lg overflow-hidden group">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Navigasi Gambar */}
              <button
                onClick={() => handleImageNavigation('prev')}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => handleImageNavigation('next')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={20} />
              </button>

              {/* Penghitung Gambar */}
              <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-sm">
                {selectedImageIndex + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail Gambar */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-primary shadow-md' 
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informasi Produk */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-500 fill-current'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({productDetailData.totalReviews} ulasan)
                  </span>
                </div>
                <div className="h-4 w-px bg-border"></div>
                <span className="text-sm text-muted-foreground">
                  {productDetailData.sold} terjual
                </span>
              </div>
            </div>

            {/* Harga */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                  -{product.discount}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Stock: <span className="font-medium text-foreground">{product.stock} tersisa</span>
              </div>
            </div>

            {/* Pilihan Warna */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">
                Pilih Warna: <span className="text-primary">{selectedColor}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                      selectedColor === color
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-muted hover:border-primary hover:bg-primary/5'
                    }`}
                    title={color}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Pilihan Ukuran */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">
                Pilih Ukuran: <span className="text-primary">{selectedSize}</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-muted hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div>{size}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Stock: {product.stock}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Kuantitas */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Jumlah</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-muted rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Max {product.stock} pcs
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-4 pt-6 border-t border-border">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold"
                disabled={product.stock === 0}
              >
                <ShoppingCart size={20} className="mr-2" />
                Tambah ke Keranjang
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-12 h-12 ${isWishlisted ? 'text-red-500 border-red-500' : ''}`}
              >
                <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
              </Button>
              <Button variant="outline" size="icon" className="w-12 h-12">
                <Share2 size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Detail Produk */}
        <div className="border border-muted rounded-lg overflow-hidden">
          <div className="flex border-b border-muted">
            {[
              { id: 'description', label: 'Deskripsi' },
              { id: 'specifications', label: 'Spesifikasi' },
              { id: 'reviews', label: `Ulasan (${productDetailData.totalReviews})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Konten Tab */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Keunggulan Produk:</h4>
                  <ul className="space-y-2">
                    {productDetailData.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(productDetailData.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-muted">
                    <span className="font-medium text-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-muted-foreground">{value as string}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Ringkasan Rating */}
                <div className="flex items-center gap-8 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{product.rating}</div>
                    <div className="flex items-center justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-500 fill-current'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      dari {productDetailData.totalReviews} ulasan
                    </div>
                  </div>
                </div>

                {/* Daftar Ulasan */}
                <div className="space-y-6">
                  {productDetailData.reviewList.map((review: any) => (
                    <div key={review.id} className="border-b border-muted pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User size={20} className="text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-foreground">{review.user}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={`${
                                    i < review.rating
                                      ? 'text-yellow-500 fill-current'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                          
                          {review.images.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {review.images.map((image: string, index: number) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Review ${review.id} image ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg border border-muted"
                                />
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 mt-3">
                            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                              <ThumbsUp size={14} />
                              Helpful ({review.helpful})
                            </button>
                            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                              <MessageCircle size={14} />
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}