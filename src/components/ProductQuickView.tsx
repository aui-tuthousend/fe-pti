import { X, Star, ShoppingCart, Heart, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

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
    images: string[]
    description: string
    stock: number
    colors?: string[]
    sizes?: string[]
}

interface ProductQuickViewProps {
    product: Product
    isOpen: boolean
    onClose: () => void
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)

    if (!isOpen) return null

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price)
    }

    const handleAddToCart = () => {
        // TODO: Implement add to cart functionality
        console.log('Add to cart:', { product, quantity })
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-primary rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
                    <h2 className="text-2xl font-bold text-primary">Quick View</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Images */}
                        <div>
                            {/* Main Image */}
                            <div className="relative aspect-square rounded-lg overflow-hidden mb-4 border border-border">
                                <img
                                    src={product.images[selectedImage] || product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {product.discount > 0 && (
                                    <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        -{product.discount}%
                                    </span>
                                )}
                            </div>

                            {/* Thumbnail Images */}
                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                    ? 'border-primary'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="mb-4">
                                <span className="text-sm text-muted-foreground">{product.category}</span>
                                <h3 className="text-2xl font-bold text-foreground mt-1">{product.name}</h3>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={`${i < Math.floor(product.rating)
                                                    ? 'text-amber-400 fill-amber-400'
                                                    : 'text-muted-foreground'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {product.rating} ({product.reviews} ulasan)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl font-bold text-primary">
                                    {formatPrice(product.price)}
                                </span>
                                {product.originalPrice > product.price && (
                                    <span className="text-lg text-muted-foreground line-through">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-muted-foreground mb-6">{product.description}</p>

                            {/* Stock */}
                            <div className="mb-6">
                                <span className="text-sm text-muted-foreground">
                                    Stok: <span className="font-medium text-foreground">{product.stock} tersedia</span>
                                </span>
                            </div>

                            {/* Quantity */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Jumlah
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={20} />
                                    Tambah ke Keranjang
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-12 h-12 rounded-lg border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                                >
                                    <Heart size={20} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
