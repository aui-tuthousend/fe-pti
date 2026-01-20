import type { BasicInfoFormProps } from '@/features/product/product-form.types'

export default function BasicInfoForm({
    formData,
    onUpdate,
    tagsInput,
    onTagsChange
}: BasicInfoFormProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => onUpdate('title', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g. Premium Cotton T-Shirt"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => onUpdate('description', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Product description and details..."
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Product Type *</label>
                    <input
                        type="text"
                        value={formData.product_type}
                        onChange={(e) => onUpdate('product_type', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="e.g. Apparel"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Vendor *</label>
                    <input
                        type="text"
                        value={formData.vendor}
                        onChange={(e) => onUpdate('vendor', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="e.g. Nike"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                    <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => onTagsChange(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="e.g. clothing, summer, sale"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Status *</label>
                    <select
                        value={formData.status}
                        onChange={(e) => onUpdate('status', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
