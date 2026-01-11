import { Package, Palette, Ruler, Tag } from 'lucide-react'

interface CatalogFilterProps {
    categories: string[]
    colors: string[]
    sizes: string[]
    priceRanges: string[]
    selectedCategory: string
    selectedColor: string
    selectedSize: string
    priceRange: string
    onCategoryChange: (category: string) => void
    onColorChange: (color: string) => void
    onSizeChange: (size: string) => void
    onPriceRangeChange: (range: string) => void
}

export function CatalogFilter({
    categories,
    colors,
    sizes,
    priceRanges,
    selectedCategory,
    selectedColor,
    selectedSize,
    priceRange,
    onCategoryChange,
    onColorChange,
    onSizeChange,
    onPriceRangeChange
}: CatalogFilterProps) {
    return (
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
                            onClick={() => onCategoryChange(category)}
                            className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${selectedCategory === category
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
                            onClick={() => onColorChange(color)}
                            className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${selectedColor === color
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
                            onClick={() => onSizeChange(size)}
                            className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${selectedSize === size
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
                            onClick={() => onPriceRangeChange(range)}
                            className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${priceRange === range
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
}
