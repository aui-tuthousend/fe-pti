import { Package, Store, Tag, Banknote } from 'lucide-react'
import { useState, useEffect } from 'react'

interface CatalogFilterProps {
    productTypes: string[]
    vendors: string[]
    tags: string[]
    selectedProductType: string
    selectedVendor: string
    selectedTag: string
    minPrice: number | null
    maxPrice: number | null
    onProductTypeChange: (productType: string) => void
    onVendorChange: (vendor: string) => void
    onTagChange: (tag: string) => void
    onMinPriceChange: (price: number | null) => void
    onMaxPriceChange: (price: number | null) => void
    onApplyPriceFilter: () => void
}

export function CatalogFilter({
    productTypes,
    vendors,
    tags,
    selectedProductType,
    selectedVendor,
    selectedTag,
    minPrice,
    maxPrice,
    onProductTypeChange,
    onVendorChange,
    onTagChange,
    onMinPriceChange,
    onMaxPriceChange,
    onApplyPriceFilter
}: CatalogFilterProps) {
    const [localMinPrice, setLocalMinPrice] = useState<string>(minPrice?.toString() || '')
    const [localMaxPrice, setLocalMaxPrice] = useState<string>(maxPrice?.toString() || '')

    useEffect(() => {
        setLocalMinPrice(minPrice?.toString() || '')
        setLocalMaxPrice(maxPrice?.toString() || '')
    }, [minPrice, maxPrice])

    const formatToRupiah = (value: string): string => {
        const number = value.replace(/\D/g, '')
        if (!number) return ''
        return new Intl.NumberFormat('id-ID').format(parseInt(number))
    }

    const parseFromRupiah = (value: string): number | null => {
        const number = value.replace(/\D/g, '')
        if (!number) return null
        return parseInt(number)
    }

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatToRupiah(e.target.value)
        setLocalMinPrice(formatted)
    }

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatToRupiah(e.target.value)
        setLocalMaxPrice(formatted)
    }

    const handleApplyPrice = () => {
        onMinPriceChange(parseFromRupiah(localMinPrice))
        onMaxPriceChange(parseFromRupiah(localMaxPrice))
        onApplyPriceFilter()
    }

    const handleResetPrice = () => {
        setLocalMinPrice('')
        setLocalMaxPrice('')
        onMinPriceChange(null)
        onMaxPriceChange(null)
        onApplyPriceFilter()
    }

    const hasPriceFilter = localMinPrice !== '' || localMaxPrice !== ''

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-primary">Filter Produk</h3>

            <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Kategori
                </h4>
                <div className="space-y-2">
                    {productTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => onProductTypeChange(type)}
                            className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${selectedProductType === type
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {vendors.length > 1 && (
                <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        Vendor
                    </h4>
                    <div className="space-y-2">
                        {vendors.map(vendor => (
                            <button
                                key={vendor}
                                onClick={() => onVendorChange(vendor)}
                                className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${selectedVendor === vendor
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {vendor}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {tags.length > 1 && (
                <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => onTagChange(tag)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all ${selectedTag === tag
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    Rentang Harga
                </h4>

                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-muted-foreground mb-1 block">
                            Harga Minimum
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                Rp
                            </span>
                            <input
                                type="text"
                                value={localMinPrice}
                                onChange={handleMinPriceChange}
                                placeholder="0"
                                className="w-full pl-10 pr-3 py-2 bg-background border border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-muted-foreground mb-1 block">
                            Harga Maksimum
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                Rp
                            </span>
                            <input
                                type="text"
                                value={localMaxPrice}
                                onChange={handleMaxPriceChange}
                                placeholder="Tidak terbatas"
                                className="w-full pl-10 pr-3 py-2 bg-background border border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={handleApplyPrice}
                            className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            Terapkan
                        </button>
                        {hasPriceFilter && (
                            <button
                                onClick={handleResetPrice}
                                className="px-4 py-2 border border-muted rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    {(minPrice !== null || maxPrice !== null) && (
                        <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                            Filter aktif: {' '}
                            {minPrice !== null && maxPrice !== null ? (
                                <span className="text-primary font-medium">
                                    Rp {new Intl.NumberFormat('id-ID').format(minPrice)} - Rp {new Intl.NumberFormat('id-ID').format(maxPrice)}
                                </span>
                            ) : minPrice !== null ? (
                                <span className="text-primary font-medium">
                                    ≥ Rp {new Intl.NumberFormat('id-ID').format(minPrice)}
                                </span>
                            ) : maxPrice !== null ? (
                                <span className="text-primary font-medium">
                                    ≤ Rp {new Intl.NumberFormat('id-ID').format(maxPrice)}
                                </span>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
