import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ProductResponse } from '@/features/product/types'
import { useGetAllProduct } from '@/features/product/hooks'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { checkAuth } from './login/-server'
import { User } from './login/-utils'
import { Footer } from '@/components/Footer'
// import { FeaturedCategories } from '@/components/FeaturedCategories'
import { ProductGridSkeleton } from '@/components/SkeletonLoader'
// import { Testimonials } from '@/components/Testimonials'
// import { Newsletter } from '@/components/Newsletter'
import { getImageUrl } from '@/config/env'
import { AddToCartDialog } from '@/components/AddToCartDialog'
import { toast } from 'sonner'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const auth = await checkAuth()
    if (auth?.user) {
      if (auth.user.role === 'admin') {
        throw redirect({
          to: '/admin',
        })
      } 
    }
    return { auth }
  },
  component: RouteComponent,
})

function RouteComponent() {

  const [user, setUser] = useState<User | null>(null)
  const { data: products, isLoading: isLoadingProducts } = useGetAllProduct()
  const [addToCartDialogOpen, setAddToCartDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null)

  // Note: Products are automatically fetched when the hook is used
  // No need for manual refetch on mount

  // Transform API products to display format or use fallback
  const displayProducts = products && products.length > 0
    ? products.map((product: ProductResponse, index: number) => ({
      id: product.uuid,
      name: product.title,
      price: `Rp ${product.variants[0]?.price.toLocaleString('id-ID') || '0'}`,
      originalPrice: `Rp ${Math.round((product.variants[0]?.price || 0) * 1.3).toLocaleString('id-ID')}`,
      rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
      reviews: Math.floor(Math.random() * 300) + 50, // Random reviews 50-350
      image: getImageUrl(product.images?.[0]?.url) || "/user/modelhijab.jpg",
      isNew: index < 2, // Mark first 2 as new
      discount: `${Math.floor(Math.random() * 40) + 20}%` // Random discount 20-60%
    }))
    : []

  const getSubtitle = () => {
    if (user) {
      return "Discover personalized hijab recommendations curated just for you"
    }
    return "Koleksi hijab premium dengan desain modern, bahan berkualitas tinggi, dan harga terjangkau untuk melengkapi gaya Anda sehari-hari."
  }

  useEffect(() => {
    const fetchUser = async () => {
      const auth = await checkAuth()
      if (auth?.user) {
        setUser(auth.user)
      }
    }
    fetchUser()
  }, [])

  const handleAddToCart = (product: ProductResponse) => {
    if (!user) {
      toast.error('Tidak Terautentikasi', {
        description: 'Silakan login terlebih dahulu untuk menambahkan ke keranjang'
      })
      return
    }

    setSelectedProduct(product)
    setAddToCartDialogOpen(true)
  }


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Background Image */}
      <section
        className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url('/user/bghome.jpg')`
        }}
      >
        <div className="container mx-auto px-4 flex items-center h-full">
          <div className="text-left text-white max-w-2xl ml-8 md:ml-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
              {user ? (
                <>
                  Welcome back, <span className="text-primary">{user.name}</span>!
                </>
              ) : (
                <>
                  The Art of <span className="text-primary">Elegance</span>
                </>
              )}
            </h1>
            <p className="text-xl mb-8">
              {getSubtitle()}
            </p>
            <div className="flex justify-start ml-4 mt-8">
             <Link to="/catalog">
              <Button
                size="lg"
                className="bg-secondary hover:bg-primary/30 text-primary-foreground px-10 py-4 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-primary hover:border-primary/80"
              >
                {user ? 'Explore Your Collection' : 'Jelajahi Koleksi'}
              </Button>
             </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">
              {user ? 'Recommended for You' : 'Model Hijab Terpopuler'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {user
                ? 'Personalized hijab recommendations based on your preferences and style'
                : 'Pilihan hijab berkualitas tinggi dengan desain modern dan elegan yang cocok untuk berbagai acara'
              }
            </p>
            {/* {user && (
              <div className="mt-4 text-sm text-muted-foreground">
                Based on your profile: <span className="text-primary font-medium">{user.name}</span>
              </div>
            )} */}
          </div>

          {/* Products Grid */}
          {isLoadingProducts ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProducts.map((product: any) => (
                <div key={product.id} className="group bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-semibold">
                          NEW
                        </span>
                      )}
                      <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-semibold">
                        -{product.discount}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200 group-hover:scale-110">
                      <Heart size={18} className="text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${i < Math.floor(product.rating) ? 'text-primary fill-warning' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.reviews} ulasan)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl font-bold text-primary">
                        {product.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      className="w-full bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-all duration-300 group-hover:shadow-md"
                      onClick={() => {
                        const originalProduct = products?.find(p => p.uuid === product.id)
                        if (originalProduct) {
                          handleAddToCart(originalProduct)
                        }
                      }}
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Tambah ke Keranjang
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View More Button */}
          <div className="text-center mt-12">
            <Link to="/catalog">
              <Button
                variant="outline"
                size="lg"
                className="relative border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-12 py-4 rounded-full font-bold text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 bg-gradient-to-r from-transparent to-transparent hover:from-primary/5 hover:to-primary/10 backdrop-blur-sm group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Lihat Semua Produk
                </span>
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-900"></div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      {/* <FeaturedCategories /> */}

      {/* Testimonials Section */}
      {/* <Testimonials /> */}

      {/* Newsletter Section */}
      {/* <Newsletter /> */}

      {/* Add to Cart Dialog */}
      {selectedProduct && (
        <AddToCartDialog
          open={addToCartDialogOpen}
          onOpenChange={setAddToCartDialogOpen}
          variants={selectedProduct.variants}
          productName={selectedProduct.title}
          token={user?.token}
          onSuccess={() => {
            // Optional: Refetch cart data or show notification
          }}
        />
      )}

      <Footer />
    </div>
  )
}
