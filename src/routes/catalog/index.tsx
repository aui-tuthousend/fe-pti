import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { X, Package } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { useProductStore } from '@/features/product/hooks'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Footer } from '@/components/Footer'
import { CatalogFilter } from '@/components/catalog/CatalogFilter'
import { CatalogHeader } from '@/components/catalog/CatalogHeader'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductQuickView } from '@/components/ProductQuickView'
import { ProductGridSkeleton } from '@/components/SkeletonLoader'
import { ProductResponse } from '@/features/product/types'

export const Route = createFileRoute('/catalog/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProductType, setSelectedProductType] = useState('Semua')
  const [selectedVendor, setSelectedVendor] = useState('Semua')
  const [selectedTag, setSelectedTag] = useState('Semua')
  const [minPrice, setMinPrice] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('Terbaru')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<ProductResponse | null>(null)

  const { list: products, loading, GetListProduct } = useProductStore()

  useEffect(() => {
    GetListProduct('')
  }, [GetListProduct])

  const getMinPrice = (product: ProductResponse): number => {
    const prices = product.variants?.map(v => v.price).filter(Boolean) || [0]
    return Math.min(...prices)
  }

  const filterOptions = useMemo(() => {
    const productTypes = new Set<string>(['Semua'])
    const vendors = new Set<string>(['Semua'])
    const tags = new Set<string>(['Semua'])

    products.forEach(p => {
      if (p.product_type) productTypes.add(p.product_type)
      if (p.vendor) vendors.add(p.vendor)
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach(tag => tags.add(tag))
      }
    })

    return {
      productTypes: Array.from(productTypes),
      vendors: Array.from(vendors),
      tags: Array.from(tags)
    }
  }, [products])

  const sortOptions = ["Terbaru", "Harga Terendah", "Harga Tertinggi", "Rating Tertinggi", "Terlaris"]

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesProductType = selectedProductType === 'Semua' ||
        product.product_type === selectedProductType

      const matchesVendor = selectedVendor === 'Semua' ||
        product.vendor === selectedVendor

      const matchesTag = selectedTag === 'Semua' ||
        product.tags.includes(selectedTag)

      const productMinPrice = getMinPrice(product)
      let matchesPrice = true
      if (minPrice !== null && maxPrice !== null) {
        matchesPrice = productMinPrice >= minPrice && productMinPrice <= maxPrice
      } else if (minPrice !== null) {
        matchesPrice = productMinPrice >= minPrice
      } else if (maxPrice !== null) {
        matchesPrice = productMinPrice <= maxPrice
      }

      return matchesSearch && matchesProductType && matchesVendor && matchesTag && matchesPrice
    })
  }, [products, searchQuery, selectedProductType, selectedVendor, selectedTag, minPrice, maxPrice])

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'Harga Terendah':
          return getMinPrice(a) - getMinPrice(b)
        case 'Harga Tertinggi':
          return getMinPrice(b) - getMinPrice(a)
        case 'Rating Tertinggi':
          return 0
        case 'Terlaris':
          return 0
        default:
          return 0
      }
    })
  }, [filteredProducts, sortBy])

  const toggleWishlist = (uuid: string) => {
    setWishlist(prev =>
      prev.includes(uuid)
        ? prev.filter(id => id !== uuid)
        : [...prev, uuid]
    )
  }

  const resetFilters = () => {
    setSelectedProductType('Semua')
    setSelectedVendor('Semua')
    setSelectedTag('Semua')
    setMinPrice(null)
    setMaxPrice(null)
    setSearchQuery('')
  }

  const hasActiveFilters = selectedProductType !== 'Semua' ||
    selectedVendor !== 'Semua' ||
    selectedTag !== 'Semua' ||
    minPrice !== null ||
    maxPrice !== null ||
    searchQuery !== ''

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
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-card border border-primary/10 rounded-lg p-6 sticky top-4">
              <CatalogFilter
                productTypes={filterOptions.productTypes}
                vendors={filterOptions.vendors}
                tags={filterOptions.tags}
                selectedProductType={selectedProductType}
                selectedVendor={selectedVendor}
                selectedTag={selectedTag}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onProductTypeChange={setSelectedProductType}
                onVendorChange={setSelectedVendor}
                onTagChange={setSelectedTag}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                onApplyPriceFilter={() => { }}
              />

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted-foreground">
                Menampilkan {sortedProducts.length} dari {products.length} produk
              </p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="lg:hidden text-sm text-primary hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {loading ? (
              <ProductGridSkeleton count={6} />
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Tidak ada produk ditemukan</h3>
                <p className="text-muted-foreground mb-4">Coba ubah filter atau kata kunci pencarian</p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-primary hover:underline"
                  >
                    Reset semua filter
                  </button>
                )}
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                : 'grid-cols-1'
                }`}>
                {sortedProducts.map(product => (
                  <ProductCard
                    key={product.uuid}
                    product={product}
                    isInWishlist={wishlist.includes(product.uuid)}
                    onToggleWishlist={toggleWishlist}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

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
                  productTypes={filterOptions.productTypes}
                  vendors={filterOptions.vendors}
                  tags={filterOptions.tags}
                  selectedProductType={selectedProductType}
                  selectedVendor={selectedVendor}
                  selectedTag={selectedTag}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onProductTypeChange={setSelectedProductType}
                  onVendorChange={setSelectedVendor}
                  onTagChange={setSelectedTag}
                  onMinPriceChange={setMinPrice}
                  onMaxPriceChange={setMaxPrice}
                  onApplyPriceFilter={() => setShowMobileFilter(false)}
                />

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-3 border border-primary/20 rounded-lg text-primary hover:bg-primary/5 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowMobileFilter(false)}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
