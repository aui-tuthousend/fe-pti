import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { useProductStore } from '@/features/product/hooks'
import { getImageUrl } from '@/config/env'
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
  MessageCircle,
  Loader2,
  Package
} from 'lucide-react'

export const Route = createFileRoute('/catalog/$productId')({
  component: ProductDetailPage,
})

function ProductDetailPage() {
  const params = useParams({ from: '/catalog/$productId' })
  const productId = params.productId || localStorage.getItem('selectedProductId') || ""

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { GetProductDetail, loading } = useProductStore()
  const [product, setProduct] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (productId) {
      GetProductDetail(productId)
        .then((response) => {
          if (response?.data) {
            setProduct(response.data)
            if (response.data.variants?.length > 0) {
              setSelectedVariant(response.data.variants[0].uuid)
            }
          }
        })
        .catch((err) => {
          console.error('Error fetching product:', err)
          setError('Produk tidak ditemukan')
        })
    }
  }, [productId, GetProductDetail])

  const currentVariant = product?.variants?.find((v: any) => v.uuid === selectedVariant) || product?.variants?.[0]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    const images = product?.images || []
    if (direction === 'prev') {
      setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)
    } else {
      setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)
    }
  }

  const totalStock = product?.variants?.reduce((sum: number, v: any) => sum + (v.available || 0), 0) || 0

  const generateReviews = (count: number) => {
    const users = ["Siti Aminah", "Fatimah R.", "Maya Sari", "Aisyah K.", "Dewi S.", "Nurul H."]
    const comments = [
      "Hijabnya bagus banget! Bahannya halus dan jatuhnya elegan. Puas dengan pembelian ini.",
      "Kualitas sesuai harga. Warnanya cantik dan tidak mudah kusut. Recommended!",
      "Sudah order berkali-kali, selalu puas. Hijab favorit saya!",
      "Bahannya lembut dan nyaman dipakai seharian. Worth it!",
      "Pengiriman cepat, produk sesuai deskripsi. Terima kasih!",
      "Warnanya cantik banget, sesuai dengan foto. Puas belanja di sini!"
    ]

    return Array.from({ length: Math.min(count, 6) }, (_, i) => ({
      id: i + 1,
      user: users[i % users.length],
      rating: Math.floor(Math.random() * 2) + 4,
      comment: comments[i % comments.length],
      date: `${Math.floor(Math.random() * 30) + 1} hari lalu`,
      helpful: Math.floor(Math.random() * 20) + 5,
      images: Math.random() > 0.5 ? ["/user/modelhijab.jpg"] : []
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Memuat produk...</span>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Package size={64} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Produk Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-6">{error || 'Produk yang Anda cari tidak tersedia.'}</p>
          <Link to="/catalog">
            <Button>Kembali ke Katalog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const productImages = product.images?.map((img: any) => getImageUrl(img.url) || "/user/modelhijab.jpg") || ["/user/modelhijab.jpg"]
  const reviewList = generateReviews(6)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/catalog" className="hover:text-primary transition-colors">
            Catalog
          </Link>
          <span>/</span>
          {product.product_type && (
            <>
              <Link
                to="/catalog"
                search={{ category: product.product_type }}
                className="hover:text-primary transition-colors"
              >
                {product.product_type}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground font-medium">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] max-w-md mx-auto bg-muted rounded-lg overflow-hidden group">
              <img
                src={productImages[selectedImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />

              {productImages.length > 1 && (
                <>
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
                </>
              )}

              <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-sm">
                {selectedImageIndex + 1} / {productImages.length}
              </div>
            </div>

            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                      ? 'border-primary shadow-md'
                      : 'border-transparent hover:border-muted-foreground'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.tags.map((tag: string, index: number) => (
                    <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                {product.vendor && (
                  <span>Vendor: <span className="text-foreground font-medium">{product.vendor}</span></span>
                )}
                {product.product_type && (
                  <span>Kategori: <span className="text-foreground font-medium">{product.product_type}</span></span>
                )}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < 4
                          ? 'text-yellow-500 fill-current'
                          : 'text-muted-foreground'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.5</span>
                  <span className="text-sm text-muted-foreground">
                    ({reviewList.length} ulasan)
                  </span>
                </div>
                <div className="h-4 w-px bg-border"></div>
                <span className="text-sm text-muted-foreground">
                  {Math.floor(Math.random() * 500) + 100} terjual
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(currentVariant?.price || 0)}
                </span>
                {currentVariant?.cost && currentVariant.cost > 0 && currentVariant.cost !== currentVariant.price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(currentVariant.cost)}
                    </span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                      -{Math.round((1 - currentVariant.price / currentVariant.cost) * 100)}%
                    </span>
                  </>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Status: <span className={`font-medium ${product.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {product.status === 'active' ? 'Tersedia' : 'Tidak Tersedia'}
                </span>
              </div>
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">
                  Pilih Varian: <span className="text-primary">{currentVariant?.title}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.uuid}
                      onClick={() => setSelectedVariant(variant.uuid)}
                      disabled={variant.available === 0}
                      className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${selectedVariant === variant.uuid
                        ? 'border-primary bg-primary/5 text-primary'
                        : variant.available === 0
                          ? 'border-muted bg-muted text-muted-foreground cursor-not-allowed'
                          : 'border-muted hover:border-primary hover:bg-primary/5'
                        }`}
                    >
                      <div>{variant.title}</div>
                      <div className="text-xs mt-1">
                        {variant.available > 0 ? (
                          <span className="text-muted-foreground">Stok: {variant.available}</span>
                        ) : (
                          <span className="text-red-500">Habis</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                    onClick={() => setQuantity(Math.min(currentVariant?.available || totalStock, quantity + 1))}
                    className="p-2 hover:bg-muted transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Max {currentVariant?.available || totalStock} pcs
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-border">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold"
                disabled={totalStock === 0 || product.status !== 'active'}
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

        <div className="border border-muted rounded-lg overflow-hidden">
          <div className="flex border-b border-muted">
            {[
              { id: 'description', label: 'Deskripsi' },
              { id: 'specifications', label: 'Spesifikasi' },
              { id: 'reviews', label: `Ulasan (${reviewList.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-between py-2 border-b border-muted">
                  <span className="font-medium text-foreground">Kategori</span>
                  <span className="text-muted-foreground">{product.product_type || '-'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-muted">
                  <span className="font-medium text-foreground">Vendor</span>
                  <span className="text-muted-foreground">{product.vendor || '-'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-muted">
                  <span className="font-medium text-foreground">Status</span>
                  <span className="text-muted-foreground">{product.status || '-'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-muted">
                  <span className="font-medium text-foreground">Total Varian</span>
                  <span className="text-muted-foreground">{product.variants?.length || 0}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-muted">
                  <span className="font-medium text-foreground">Total Stok</span>
                  <span className="text-muted-foreground">{totalStock}</span>
                </div>
                {currentVariant?.sku && (
                  <div className="flex justify-between py-2 border-b border-muted">
                    <span className="font-medium text-foreground">SKU</span>
                    <span className="text-muted-foreground">{currentVariant.sku}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center gap-8 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">4.5</div>
                    <div className="flex items-center justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${i < 4
                            ? 'text-yellow-500 fill-current'
                            : 'text-muted-foreground'
                            }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      dari {reviewList.length} ulasan
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {reviewList.map((review: any) => (
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
                                  className={`${i < review.rating
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
      <Footer />
    </div>
  )
}