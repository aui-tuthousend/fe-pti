import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ProductSearchFilterProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    statusFilter: string
    onStatusFilterChange: (status: string) => void
    productTypeFilter: string
    onProductTypeFilterChange: (type: string) => void
    onClearFilters: () => void
    hasActiveFilters: boolean
}

export default function ProductSearchFilter({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    productTypeFilter,
    onProductTypeFilterChange,
    onClearFilters,
    hasActiveFilters
}: ProductSearchFilterProps) {
    return (
        <div className="bg-card rounded-xl border shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                        type="text"
                        placeholder="Search products by title, description, or vendor..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Status Filter */}
                <div className="w-full md:w-48">
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                {/* Product Type Filter */}
                <div className="w-full md:w-48">
                    <Input
                        type="text"
                        placeholder="Product Type"
                        value={productTypeFilter}
                        onChange={(e) => onProductTypeFilterChange(e.target.value)}
                    />
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={onClearFilters}
                        className="w-full md:w-auto"
                    >
                        <X size={16} className="mr-2" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    )
}
