import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Variant } from '@/features/variant/types'
import { inputCartFn } from '@/routes/cart/-server'
import { toast } from 'sonner'
import { getImageUrl } from '@/config/env'
import { Minus, Plus } from 'lucide-react'

interface AddToCartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variants: Variant[]
  productName: string
  token?: string
  onSuccess?: () => void
}

export function AddToCartDialog({
  open,
  onOpenChange,
  variants,
  productName,
  token,
  onSuccess
}: AddToCartDialogProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedVariant = variants.find(v => v.uuid === selectedVariantId)

  const handleSubmit = async () => {
    if (!selectedVariantId) {
      toast.error('Pilih Variant', {
        description: 'Silakan pilih variant terlebih dahulu'
      })
      return
    }

    if (quantity < 1) {
      toast.error('Quantity Tidak Valid', {
        description: 'Quantity harus minimal 1'
      })
      return
    }

    if (!token) {
      toast.error('Tidak Terautentikasi', {
        description: 'Silakan login terlebih dahulu'
      })
      return
    }

    if (selectedVariant && quantity > selectedVariant.available) {
      toast.error('Stok Tidak Cukup', {
        description: `Stok tersedia: ${selectedVariant.available}`
      })
      return
    }

    setIsSubmitting(true)
    try {
      await inputCartFn({
        data: {
          variantId: selectedVariantId,
          quantity,
          token
        }
      })

      toast.success('Berhasil!', {
        description: 'Produk berhasil ditambahkan ke keranjang'
      })

      // Reset form
      setSelectedVariantId('')
      setQuantity(1)
      onOpenChange(false)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Gagal', {
        description: 'Terjadi kesalahan saat menambahkan ke keranjang'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Tambah ke Keranjang
          </DialogTitle>
          <DialogDescription>
            Pilih variant dan quantity untuk {productName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Variant Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Pilih Variant</Label>
            <div className="grid grid-cols-1 gap-3">
              {variants.map((variant) => {
                const isSelected = selectedVariantId === variant.uuid
                const isOutOfStock = variant.available === 0

                return (
                  <button
                    key={variant.uuid}
                    onClick={() => !isOutOfStock && setSelectedVariantId(variant.uuid)}
                    disabled={isOutOfStock}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all duration-200 text-left
                      ${isSelected
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
                      }
                      ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {/* Variant Image */}
                      {variant.images && variant.images.length > 0 && (
                        <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={getImageUrl(variant.images[0].url) ?? ''}
                            alt={variant.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Variant Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground truncate">
                              {variant.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {variant.option1}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-primary-foreground"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-primary">
                            Rp {variant.price.toLocaleString('id-ID')}
                          </span>
                          <span className={`text-sm ${isOutOfStock ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {isOutOfStock ? (
                              <span className="font-semibold">Stok Habis</span>
                            ) : (
                              `Stok: ${variant.available}`
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quantity Input */}
          {selectedVariantId && (
            <div className="space-y-3">
              <Label htmlFor="quantity" className="text-base font-semibold">
                Jumlah
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedVariant?.available}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="text-center font-semibold text-lg h-10 w-24"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={selectedVariant ? quantity >= selectedVariant.available : false}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {selectedVariant && (
                <p className="text-sm text-muted-foreground">
                  Maksimal: {selectedVariant.available} item
                </p>
              )}
            </div>
          )}

          {/* Price Summary */}
          {selectedVariantId && selectedVariant && (
            <div className="p-4 rounded-lg bg-accent/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Harga Satuan</span>
                <span className="font-semibold">
                  Rp {selectedVariant.price.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Jumlah</span>
                <span className="font-semibold">{quantity}x</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  Rp {(selectedVariant.price * quantity).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedVariantId || isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? 'Menambahkan...' : 'Tambah ke Keranjang'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
