import { Link } from '@tanstack/react-router'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Product {
    id: number
    name: string
    category: string
    price: number
    originalPrice: number
    discount: number
    rating: number
    reviews: number
    image: string
    description: string
    stock: number
    isBestseller: boolean
}

interface ProductCardProps {
    product: Product
    isInWishlist: boolean
    onToggleWishlist: (id: number) => void
    onQuickView?: (product: Product) => void
}

export function ProductCard({ product, isInWishlist, onToggleWishlist, onQuickView }: ProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price)
    }

    return (
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
                    onClick={() => onToggleWishlist(product.id)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isInWishlist
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                >
                    <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                        {onQuickView && (
                            <Button
                                size="sm"
                                onClick={() => onQuickView(product)}
                                className="bg-white text-gray-800 hover:bg-gray-100"
                            >
                                <Eye className="w-4 h-4 mr-1" />
                                Quick View
                            </Button>
                        )}
                        <Link
                            to="/catalog/$productId"
                            params={{ productId: product.id.toString() }}
                            onClick={() => localStorage.setItem('selectedProductId', product.id.toString())}
                        >
                            <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                            >
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Beli
                            </Button>
                        </Link>
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
}
