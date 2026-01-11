import { Search, Grid3X3, List, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CatalogHeaderProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    sortBy: string
    onSortChange: (sort: string) => void
    viewMode: 'grid' | 'list'
    onViewModeChange: (mode: 'grid' | 'list') => void
    onMobileFilterClick: () => void
    sortOptions: string[]
}

export function CatalogHeader({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    viewMode,
    onViewModeChange,
    onMobileFilterClick,
    sortOptions
}: CatalogHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Katalog Hijab</h1>
                    <p className="text-muted-foreground">Temukan koleksi hijab terbaik untuk gaya Anda</p>
                </div>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Cari hijab impian Anda..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-background border border-primary rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* Mobile Filter Button */}
                    <Button
                        onClick={onMobileFilterClick}
                        variant="outline"
                        className="lg:hidden border-primary text-primary hover:bg-primary hover:text-white"
                    >
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filter
                    </Button>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="bg-background border border-primary rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                        {sortOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex border border-primary rounded-lg overflow-hidden">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`px-3 py-2 transition-all ${viewMode === 'grid'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-primary hover:bg-primary/10'
                                }`}
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`px-3 py-2 transition-all ${viewMode === 'list'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-primary hover:bg-primary/10'
                                }`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
