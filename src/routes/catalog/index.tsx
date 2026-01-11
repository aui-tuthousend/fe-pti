import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { X, Package } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { useProductStore } from '@/features/product/hooks'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Footer } from '@/components/Footer'
import { CatalogFilter } from '@/components/catalog/CatalogFilter'
import { CatalogHeader } from '@/components/catalog/CatalogHeader'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductQuickView } from '@/components/ProductQuickView'
import { getImageUrl } from '@/config/env'

export const Route = createFileRoute('/catalog/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [selectedColor, setSelectedColor] = useState('Semua')
  const [selectedSize, setSelectedSize] = useState('Semua')
  const [priceRange, setPriceRange] = useState('Semua')
  const [sortBy, setSortBy] = useState('Terbaru')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)

  const { list: products, GetListProduct } = useProductStore()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      GetListProduct(token)
    }
  }, [GetListProduct])

  // Transform products or use fallback demo data
  const displayProducts = products.length > 0 ? products.map(p => ({
    id: parseInt(p.uuid) || 0,
    name: p.title,
    category: p.product_type,
    price: p.variants?.[0]?.price || 0,
    originalPrice: p.variants?.[0]?.price || 0,
    discount: 0,
    rating: 4.5,
    reviews: 0,
    colors: ["Default"],
    sizes: ["One Size"],
    image: getImageUrl(p.images?.[0]?.url) || "/user/modelhijab.jpg",
    images: p.images?.map(img => getImageUrl(img.url) || "/user/modelhijab.jpg") || ["/user/modelhijab.jpg"],
    description: p.description,
    stock: p.variants?.[0]?.inventory_quantity || 0,
    isBestseller: false
  })) : []

  const categories = ["Semua", "Segi Empat", "Pashmina", "Bergo", "Voal", "Syari", "Organza"]
  const colors = ["Semua", "Black", "Navy", "Cream", "Pink", "Brown", "White", "Grey"]
  const sizes = ["Semua", "One Size", "110x110cm", "115x115cm", "120x120cm", "75x200cm"]
  const priceRanges = ["Semua", "< 75rb", "75rb - 100rb", "100rb - 150rb", "> 150rb"]
  const sortOptions = ["Terbaru", "Harga Terendah", "Harga Tertinggi", "Rating Tertinggi", "Terlaris"]

  // Filter products
  const filteredProducts = displayProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory
    const matchesColor = selectedColor === 'Semua' || product.colors.some((color: string) =>
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
        return b.id - a.id
    }
  })

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Katalog Hijab' }]} />

        <CatalogHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onMobileFilterClick={() => setShowMobileFilter(true)}
          sortOptions={sortOptions}
        />

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-card border border-primary/10 rounded-lg p-6 sticky top-4">
              <CatalogFilter
                categories={categories}
                colors={colors}
                sizes={sizes}
                priceRanges={priceRanges}
                selectedCategory={selectedCategory}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                priceRange={priceRange}
                onCategoryChange={setSelectedCategory}
                onColorChange={setSelectedColor}
                onSizeChange={setSelectedSize}
                onPriceRangeChange={setPriceRange}
              />
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
              <div className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1'
                }`}>
                {sortedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isInWishlist={wishlist.includes(product.id)}
                    onToggleWishlist={toggleWishlist}
                  />
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
                <CatalogFilter
                  categories={categories}
                  colors={colors}
                  sizes={sizes}
                  priceRanges={priceRanges}
                  selectedCategory={selectedCategory}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                  priceRange={priceRange}
                  onCategoryChange={setSelectedCategory}
                  onColorChange={setSelectedColor}
                  onSizeChange={setSelectedSize}
                  onPriceRangeChange={setPriceRange}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      <Footer />
    </div>
  )
}
