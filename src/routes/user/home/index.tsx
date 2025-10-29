import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Navbar } from '../component/Navbar'
import { Button } from '@/components/ui/button'
import { Star, ShoppingCart, Heart } from 'lucide-react'

export const Route = createFileRoute('/user/home/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Data model hijab
  const hijabModels = [
    {
      id: 1,
      name: "Hijab Segi Empat Premium",
      price: "Rp 89.000",
      originalPrice: "Rp 120.000",
      rating: 4.8,
      reviews: 156,
      image: "/user/modelhijab.jpg",
      isNew: true,
      discount: "26%"
    },
    {
      id: 2,
      name: "Pashmina Kasmir Elegan",
      price: "Rp 125.000",
      originalPrice: "Rp 180.000",
      rating: 4.9,
      reviews: 203,
      image: "/user/modelhijab.jpg",
      isNew: false,
      discount: "31%"
    },
    {
      id: 3,
      name: "Bergo Instant Daily",
      price: "Rp 65.000",
      originalPrice: "Rp 85.000",
      rating: 4.7,
      reviews: 89,
      image: "/user/modelhijab.jpg",
      isNew: true,
      discount: "24%"
    },
    {
      id: 4,
      name: "Hijab Syari Polos",
      price: "Rp 95.000",
      originalPrice: "Rp 130.000",
      rating: 4.6,
      reviews: 142,
      image: "/user/modelhijab.jpg",
      isNew: false,
      discount: "27%"
    },
    {
      id: 5,
      name: "Kerudung Motif Cantik",
      price: "Rp 75.000",
      originalPrice: "Rp 110.000",
      rating: 4.8,
      reviews: 178,
      image: "/user/modelhijab.jpg",
      isNew: true,
      discount: "32%"
    },
    {
      id: 6,
      name: "Hijab Organza Luxury",
      price: "Rp 145.000",
      originalPrice: "Rp 200.000",
      rating: 4.9,
      reviews: 267,
      image: "/user/modelhijab.jpg",
      isNew: false,
      discount: "28%"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={handleMenuClick} />
      
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
              The Art of <span className="text-primary">Elegance</span>
            </h1>
            <div className="flex justify-start ml-4 mt-8">
              <Button 
                size="lg"
            className="bg-secondary hover:bg-primary/30 text-primary-foreground px-10 py-4 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-primary hover:border-primary/80"
              >
                Jelajahi Koleksi
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Model Hijab Terpopuler
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pilihan hijab berkualitas tinggi dengan desain modern dan elegan yang cocok untuk berbagai acara
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hijabModels.map((product) => (
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
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-all duration-300 group-hover:shadow-md"
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Tambah ke Keranjang
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className="text-center mt-12">
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
          </div>
        </div>
      </section>
    </div>
  )
}
