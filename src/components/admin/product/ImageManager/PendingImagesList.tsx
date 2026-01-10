import { X } from 'lucide-react'
import { getImageUrl } from '@/config/env'
import type { PendingImagesListProps } from '@/features/product/product-form.types'

export default function PendingImagesList({
    pendingUploads,
    pendingDeletes,
    onRemovePending,
    onUndoDelete,
    imageType,
    variantTitle
}: PendingImagesListProps) {
    const isProduct = imageType === 'product'

    return (
        <>
            {/* Pending Uploads */}
            {pendingUploads.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm font-medium mb-2 text-amber-800 dark:text-amber-200">
                        Pending Upload ({pendingUploads.length})
                    </p>
                    <div className={`grid ${isProduct ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-4'} gap-3`}>
                        {pendingUploads.map((img, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={URL.createObjectURL(img.file)}
                                    alt="Pending"
                                    className={`${isProduct ? 'w-full h-28' : 'w-full h-28'} object-cover ${isProduct ? 'rounded-lg' : 'rounded-md'} border-2 border-dashed border-amber-400 dark:border-amber-600 shadow-sm`}
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemovePending(index)}
                                    className={`absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full ${isProduct ? 'p-1.5' : 'p-1'
                                        } shadow-lg z-10`}
                                >
                                    <X size={isProduct ? 14 : 12} />
                                </button>
                                <div className={`absolute ${isProduct ? 'top-1 left-1' : 'top-0.5 left-0.5'} ${isProduct ? 'bg-blue-600' : 'bg-purple-600'
                                    } text-white ${isProduct ? 'text-xs px-2 py-0.5' : 'text-[10px] px-1.5 py-0.5'} rounded-md shadow font-semibold ${!isProduct && 'max-w-[70px] truncate'
                                    }`}>
                                    {isProduct ? 'PRODUCT' : variantTitle || 'VARIANT'}
                                </div>
                                <div className={`absolute ${isProduct ? 'top-1 right-1' : 'top-0.5 right-0.5'} bg-amber-500 text-white ${isProduct ? 'text-xs px-2 py-0.5' : 'text-[10px] px-1.5 py-0.5'
                                    } rounded-md shadow font-medium`}>
                                    NEW
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pending Deletes */}
            {pendingDeletes.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm font-medium mb-2 text-red-800 dark:text-red-200">
                        Pending Deletion ({pendingDeletes.length})
                    </p>
                    <div className={`grid ${isProduct ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-4'} gap-3`}>
                        {pendingDeletes.map((img, index) => (
                            <div key={index} className="relative group opacity-60">
                                <img
                                    src={getImageUrl(img.url) || ''}
                                    alt="Pending Delete"
                                    className={`${isProduct ? 'w-full h-28' : 'w-full h-28'} object-cover ${isProduct ? 'rounded-lg' : 'rounded-md'} border-2 border-dashed border-red-400 dark:border-red-600 shadow-sm grayscale`}
                                />
                                <button
                                    type="button"
                                    onClick={() => onUndoDelete(index)}
                                    className={`absolute -top-2 -right-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full ${isProduct ? 'p-1.5' : 'p-1'
                                        } shadow-lg z-10`}
                                    title="Undo delete"
                                >
                                    <X size={isProduct ? 14 : 12} />
                                </button>
                                <div className={`absolute ${isProduct ? 'top-1 left-1' : 'top-0.5 left-0.5'} ${isProduct ? 'bg-blue-600' : 'bg-purple-600'
                                    } text-white ${isProduct ? 'text-xs px-2 py-0.5' : 'text-[10px] px-1.5 py-0.5'} rounded-md shadow font-semibold ${!isProduct && 'max-w-[70px] truncate'
                                    }`}>
                                    {isProduct ? 'PRODUCT' : variantTitle || 'VARIANT'}
                                </div>
                                <div className={`absolute ${isProduct ? 'top-1 right-1' : 'top-0.5 right-0.5'} bg-red-500 text-white ${isProduct ? 'text-xs px-2 py-0.5' : 'text-[10px] px-1.5 py-0.5'
                                    } rounded-md shadow font-medium`}>
                                    DELETE
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
