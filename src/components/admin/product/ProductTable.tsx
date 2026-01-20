import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getImageUrl } from '@/config/env'
import type { ProductTableProps } from '@/features/product/product-form.types'

export default function ProductTable({
    products,
    loading,
    pagination,
    onEdit,
    onDelete,
    onPageChange,
    isFetchingDetail,
    isDeleting,
    onCreateNew
}: ProductTableProps) {
    return (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image</th>
                            <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
                            <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                            <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vendor</th>
                            <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                            <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Variants</th>
                            <th className="px-3 md:px-6 py-3 md:py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading && products.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-3 md:px-6 py-12 md:py-16 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                        <span className="text-muted-foreground">Loading products...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-3 md:px-6 py-12 md:py-16 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                            <Plus size={24} className="text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground">No products found</p>
                                        <Button onClick={onCreateNew} size="sm">
                                            Add your first product
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.uuid} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-3 md:px-6 py-3 md:py-4">
                                        {(() => {
                                            // Only use product-level images (not variant images) for cover
                                            const productImages = product.images?.filter((img: any) => !img.variantId) || []
                                            const coverImage = productImages[0]

                                            // If no product images, use first variant image as fallback
                                            const variantImages = product.images?.filter((img: any) => img.variantId) || []
                                            const fallbackImage = !coverImage && variantImages.length > 0 ? variantImages[0] : null
                                            const displayImage = coverImage || fallbackImage

                                            return displayImage?.url ? (
                                                <img
                                                    src={getImageUrl(displayImage.url) || ''}
                                                    alt={product.title}
                                                    className="w-14 h-14 object-cover rounded-lg border shadow-sm bg-muted"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center text-xs text-muted-foreground font-medium">
                                                    No Img
                                                </div>
                                            )
                                        })()}
                                    </td>
                                    <td className="px-3 md:px-6 py-3 md:py-4">
                                        <div className="font-semibold text-foreground">{product.title}</div>
                                        <div className="text-sm text-muted-foreground truncate max-w-xs mt-0.5">
                                            {product.description || 'No description'}
                                        </div>
                                    </td>
                                    <td className="px-3 md:px-6 py-3 md:py-4">
                                        <span className="text-sm bg-muted px-2 py-1 rounded-md">{product.product_type}</span>
                                    </td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm text-muted-foreground">{product.vendor}</td>
                                    <td className="px-3 md:px-6 py-3 md:py-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${product.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                            product.status === 'draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                            }`}>
                                            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-3 md:px-6 py-3 md:py-4">
                                        <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                                            {product.variants?.length || 0} variants
                                        </span>
                                    </td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onEdit(product.uuid)}
                                                disabled={isFetchingDetail}
                                                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onDelete(product.uuid, product.title)}
                                                disabled={isDeleting}
                                                className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t flex items-center justify-between bg-muted/30">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                        <span className="font-medium text-foreground">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                        <span className="font-medium text-foreground">{pagination.total}</span> products
                    </div>
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            Previous
                        </Button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === pagination.page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className="min-w-[36px]"
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
