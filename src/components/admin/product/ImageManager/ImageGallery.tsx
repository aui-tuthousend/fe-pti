import { X } from 'lucide-react'
import { getImageUrl } from '@/config/env'
import type { ImageGalleryProps } from '@/features/product/product-form.types'

export default function ImageGallery({
    images,
    onRemove,
    onSetFeatured,
    imageType,
    variantTitle
}: ImageGalleryProps) {
    if (!images || images.length === 0) return null

    const isProduct = imageType === 'product'

    return (
        <div className="mb-4">
            <p className={`text-sm font-medium mb-2 ${isProduct ? 'text-blue-800 dark:text-blue-200' : 'text-purple-800 dark:text-purple-200'}`}>
                Current Images ({images.length})
            </p>
            <div className={`grid ${isProduct ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-4'} gap-3`}>
                {images.map((img, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={getImageUrl(img.url) || ''}
                            alt={img.alt_text || imageType}
                            className={`${isProduct ? 'w-full h-40' : 'w-full h-40'} object-cover ${isProduct ? 'rounded-lg' : 'rounded-md'} border-2 ${isProduct
                                ? 'border-blue-300 dark:border-blue-700'
                                : 'border-purple-300 dark:border-purple-700'
                                } shadow-sm`}
                        />

                        {/* Delete Button */}
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className={`absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full ${isProduct ? 'p-1.5' : 'p-1'
                                } opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10`}
                        >
                            <X size={isProduct ? 14 : 12} />
                        </button>

                        {/* Set as Featured Button */}
                        {onSetFeatured && index !== 0 && (
                            <button
                                type="button"
                                onClick={() => onSetFeatured(index)}
                                className={`absolute -top-2 -left-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full ${isProduct ? 'p-1.5' : 'p-1'
                                    } opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10`}
                                title="Set as featured image"
                            >
                                <svg className={`${isProduct ? 'w-3.5 h-3.5' : 'w-3 h-3'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </button>
                        )}

                        {/* Type Badge */}
                        <div className={`absolute ${isProduct ? 'top-1 left-1' : 'top-0.5 left-0.5'} ${isProduct ? 'bg-blue-600' : 'bg-purple-600'
                            } text-white ${isProduct ? 'text-xs px-2 py-0.5' : 'text-[10px] px-1.5 py-0.5'} rounded-md shadow font-semibold ${!isProduct && 'max-w-[70px] truncate'
                            }`}>
                            {isProduct ? 'PRODUCT' : variantTitle || 'VARIANT'}
                        </div>

                        {/* Featured Badge */}
                        {index === 0 && (
                            <div className={`absolute ${isProduct ? 'top-1 right-1' : 'top-0.5 right-0.5'} bg-yellow-500 text-white ${isProduct ? 'text-xs px-2 py-0.5' : 'text-[10px] px-1.5 py-0.5'
                                } rounded-md shadow font-semibold flex items-center gap-1`}>
                                <svg className={`${isProduct ? 'w-3 h-3' : 'w-2.5 h-2.5'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                FEATURED
                            </div>
                        )}

                        {/* Position Badge */}
                        {index !== 0 && isProduct && (
                            <div className="absolute bottom-1 right-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-md shadow">
                                #{img.position || index + 1}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
