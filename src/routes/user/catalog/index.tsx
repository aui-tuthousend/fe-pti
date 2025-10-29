import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Navbar } from '../component/Navbar'
import { Button } from '@/components/ui/button'
import { 
  Search,
  Grid3X3, 
  List, 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye,
  SlidersHorizontal,
  X,
  Tag,
  Palette,
  Ruler,
  Package
} from 'lucide-react'

export const Route = createFileRoute('/user/catalog/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [selectedColor, setSelectedColor] = useState('Semua')
  const [selectedSize, setSelectedSize] = useState('Semua')
  const [priceRange, setPriceRange] = useState('Semua')
  const [sortBy, setSortBy] = useState('Terbaru')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Data produk hijab
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

  const categories = ["Semua", "Segi Empat", "Pashmina", "Bergo", "Voal", "Syari", "Organza"]
  const colors = ["Semua", "Black", "Navy", "Cream", "Pink", "Brown", "White", "Grey"]
  const sizes = ["Semua", "One Size", "110x110cm", "115x115cm", "120x120cm", "75x200cm"]
  const priceRanges = ["Semua", "< 75rb", "75rb - 100rb", "100rb - 150rb", "> 150rb"]
  const sortOptions = ["Terbaru", "Harga Terendah", "Harga Tertinggi", "Rating Tertinggi", "Terlaris"]

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory
    const matchesColor = selectedColor === 'Semua' || product.colors.some(color => 
      color.toLowerCase().includes(selectedColor.toLowerCase())
    )
    const matchesSize = selectedSize === 'Semua' || product.sizes.includes(selectedSize)
    
    let matchesPrice = true
    if (priceRange !== 'Semua') {
      switch (priceRange) {
        case '< 75rb':
          matchesPrice = product.price < 75000
          break
        case '75rb - 100rb':
          matchesPrice = product.price >= 75000 && product.price <= 100000
          break
        case '100rb - 150rb':
          matchesPrice = product.price >= 100000 && product.price <= 150000
          break
        case '> 150rb':
          matchesPrice = product.price > 150000
          break
      }
    }

    return matchesSearch && matchesCategory && matchesColor && matchesSize && matchesPrice
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Harga Terendah':
        return a.price - b.price
      case 'Harga Tertinggi':
        return b.price - a.price
      case 'Rating Tertinggi':
        return b.rating - a.rating
      case 'Terlaris':
        return b.reviews - a.reviews
      default:
        return b.id - a.id // Terbaru (berdasarkan ID)
    }
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const FilterSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-primary">Filter Produk</h3>
      
      {/* Category Filter */}
      <div>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Kategori
        </h4>
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Warna
        </h4>
        <div className="space-y-2">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                selectedColor === color
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Ruler className="w-4 h-4" />
          Ukuran
        </h4>
        <div className="space-y-2">
          {sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                selectedSize === size
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Rentang Harga
        </h4>
        <div className="space-y-2">
          {priceRanges.map(range => (
            <button
              key={range}
              onClick={() => setPriceRange(range)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                priceRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const ProductCard = ({ product }: { product: typeof products[0] }) => (
    <div className="bg-card border border-primary/10 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-[1.02]">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              -{product.discount}%
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              Terlaris
            </span>
          )}
        </div>
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            wishlist.includes(product.id)
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-white text-gray-800 hover:bg-gray-100"
            >
              <Eye className="w-4 h-4 mr-1" />
              Lihat
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Beli
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({product.reviews} ulasan)</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-lg text-primary">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Stok: {product.stock}</span>
          <span className="text-xs bg-muted px-2 py-1 rounded">{product.category}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={handleMenuClick} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Katalog Hijab</h1>
              <p className="text-muted-foreground">Temukan koleksi hijab terbaik untuk gaya Anda</p>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Cari hijab impian Anda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-primary rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <Button
                onClick={() => setShowMobileFilter(true)}
                variant="outline"
                className="lg:hidden border-primary text-primary hover:bg-primary hover:text-white"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filter
              </Button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-primary rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-primary rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-primary hover:bg-primary/10'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-all ${
                    viewMode === 'list'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-primary hover:bg-primary/10'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-card border border-primary/10 rounded-lg p-6 sticky top-4">
              <FilterSection />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted-foreground">
                Menampilkan {sortedProducts.length} dari {products.length} produk
              </p>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Tidak ada produk ditemukan</h3>
                <p className="text-muted-foreground">Coba ubah filter atau kata kunci pencarian</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {showMobileFilter && (
          <div className="lg:hidden fixed inset-0 bg-black/50 flex items-end z-50">
            <div className="bg-card border-t border-primary rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-primary/10 sticky top-0 bg-card">
                <h3 className="text-xl font-bold text-primary">Filter Produk</h3>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-6">
                <FilterSection />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
