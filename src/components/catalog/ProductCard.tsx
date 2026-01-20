import { Link } from '@tanstack/react-router'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductResponse } from '@/features/product/types'
import { getImageUrl } from '@/config/env'

interface ProductCardProps {
    product: ProductResponse
    isInWishlist: boolean
    onToggleWishlist: (uuid: string) => void
    onQuickView?: (product: ProductResponse) => void
}

export function ProductCard({ product, isInWishlist, onToggleWishlist, onQuickView }: ProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price)
    }

    const totalStock = product.variants?.reduce((sum, v) => sum + (v.available || 0), 0) || 0
    const prices = product.variants?.map(v => v.price).filter(Boolean) || [0]
    const minPrice = Math.min(...prices)
    const primaryImage = getImageUrl(product.images?.[0]?.url) || "/user/modelhijab.jpg"

    return (
        <div className="bg-card border border-primary/10 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-[1.02]">
            <div className="relative">
                <img
                    src={primaryImage}
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/user/modelhijab.jpg'
                    }}
                />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.status === 'active' && totalStock > 0 && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                            Tersedia
                        </span>
                    )}
                    {totalStock === 0 && (
                        <span className="bg-gray-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                            Habis
                        </span>
                    )}
                </div>
                <button
                    onClick={() => onToggleWishlist(product.uuid)}
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
                            params={{ productId: product.uuid }}
                            onClick={() => localStorage.setItem('selectedProductId', product.uuid)}
                        >
                            <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90"
                                disabled={totalStock === 0}
                            >
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                {totalStock > 0 ? 'Beli' : 'Habis'}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {product.tags.slice(0, 5).map((tag, index) => (
                            <span key={index} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">4.5</span>
                    </div>
                    <span className="text-sm text-muted-foreground">(0 ulasan)</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-lg text-primary">{formatPrice(minPrice)}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className={`text-sm ${totalStock > 0 ? 'text-muted-foreground' : 'text-red-500 font-medium'}`}>
                        {totalStock > 0 ? `Stok: ${totalStock}` : 'Stok Habis'}
                    </span>
                    <span className="text-xs bg-muted px-2 py-1 rounded">{product.product_type}</span>
                </div>

                {product.vendor && (
                    <div className="mt-2 pt-2 border-t border-muted">
                        <span className="text-xs text-muted-foreground">Vendor: {product.vendor}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
