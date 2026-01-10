import { Plus } from 'lucide-react'
import type { ImageUploaderProps } from '@/features/product/product-form.types'

export default function ImageUploader({
    onUpload,
    disabled = false,
    imageType,
    uploadId
}: ImageUploaderProps) {
    const isProduct = imageType === 'product'

    return (
        <div className={`border-2 border-dashed ${isProduct
            ? 'border-blue-300 dark:border-blue-700 bg-white/50 dark:bg-gray-900/50 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg p-6'
            : 'border-purple-300 dark:border-purple-700 bg-white/50 dark:bg-gray-900/50 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-md p-3'
            } transition-colors`}>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={onUpload}
                className="hidden"
                id={uploadId}
                disabled={disabled}
            />
            <label
                htmlFor={uploadId}
                className={`flex ${isProduct ? 'flex-col' : 'items-center justify-center gap-2'} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    }`}
            >
                {isProduct ? (
                    <>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <Plus size={24} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100 text-center">
                            Upload Product Images
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 mt-1 text-center">
                            PNG, JPG, GIF, WebP
                        </span>
                    </>
                ) : (
                    <>
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                            <Plus size={16} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="text-left">
                            <span className="text-xs font-medium text-purple-900 dark:text-purple-100 block">Upload Variant Images</span>
                            <span className="text-xs text-purple-600 dark:text-purple-400">PNG, JPG, GIF, WebP</span>
                        </div>
                    </>
                )}
            </label>
        </div>
    )
}
