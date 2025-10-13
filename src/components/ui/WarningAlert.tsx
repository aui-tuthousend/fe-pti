import { cn } from '@/lib/utils'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from './button'

// ============================================
// Warning Alert Component
// ============================================

interface WarningAlertProps {
  title?: string
  message?: string
  description?: string
  onClose?: () => void
  onConfirm?: () => void
  onCancel?: () => void
  className?: string
  variant?: 'default' | 'stock' | 'payment' | 'compact'
  confirmText?: string
  cancelText?: string
}

export function WarningAlert({
  title = "Warning Notification",
  message,
  description,
  onClose,
  onConfirm,
  onCancel,
  className,
  variant = 'default',
  confirmText = "Continue",
  cancelText = "Cancel"
}: WarningAlertProps) {
  
  // Default content berdasarkan variant
  const getDefaultContent = () => {
    switch (variant) {
      case 'stock':
        return {
          message: "Some items in your cart have limited stock.",
          description: "Please review your order before proceeding to checkout."
        }
      case 'payment':
        return {
          message: "Payment verification required.",
          description: "Please verify your payment details before continuing."
        }
      case 'compact':
        return {
          message: message || "Please review this action.",
          description: ""
        }
      default:
        return {
          message: message || "Please review the following information.",
          description: description || "Make sure everything is correct before proceeding."
        }
    }
  }

  const content = getDefaultContent()
  const finalMessage = message || content.message
  const finalDescription = description !== undefined ? description : content.description

  return (
    <div className={cn(
      "relative bg-warning/10 border border-warning/20 rounded-lg p-4 shadow-sm",
      variant === 'compact' && "p-3",
      className
    )}>
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-warning/60 hover:text-warning transition-colors"
        >
          <X size={18} />
        </button>
      )}

      <div className="flex items-start gap-3">
        {/* Warning Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-warning" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-warning font-medium text-sm">⚠️</span>
            <h4 className="text-warning font-semibold text-sm">
              {title}
            </h4>
          </div>

          {/* Message */}
          <p className="text-warning-foreground text-sm mb-1">
            {finalMessage}
          </p>

          {/* Description */}
          {variant !== 'compact' && finalDescription && (
            <p className="text-warning-foreground/80 text-xs mb-3">
              {finalDescription}
            </p>
          )}

          {/* Action Buttons */}
          {(onConfirm || onCancel) && variant !== 'compact' && (
            <div className="flex gap-2 flex-wrap">
              {onConfirm && (
                <Button
                  size="sm"
                  onClick={onConfirm}
                  className="bg-warning hover:bg-warning/90 text-warning-foreground text-xs h-7 px-3"
                >
                  {confirmText}
                </Button>
              )}
              {onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  className="border-warning text-warning hover:bg-warning hover:text-warning-foreground text-xs h-7 px-3"
                >
                  {cancelText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Preset Warning Alerts
// ============================================

interface StockWarningAlertProps {
  onClose?: () => void
  onContinue?: () => void
  onReview?: () => void
  className?: string
}

export function StockWarningAlert({
  onClose,
  onContinue,
  onReview,
  className
}: StockWarningAlertProps) {
  return (
    <WarningAlert
      variant="stock"
      title="Low Stock Warning"
      onClose={onClose}
      onConfirm={onContinue}
      onCancel={onReview}
      confirmText="Continue Anyway"
      cancelText="Review Cart"
      className={className}
    />
  )
}

interface PaymentWarningAlertProps {
  onClose?: () => void
  onVerify?: () => void
  onCancel?: () => void
  className?: string
}

export function PaymentWarningAlert({
  onClose,
  onVerify,
  onCancel,
  className
}: PaymentWarningAlertProps) {
  return (
    <WarningAlert
      variant="payment"
      title="Payment Warning"
      onClose={onClose}
      onConfirm={onVerify}
      onCancel={onCancel}
      confirmText="Verify Payment"
      cancelText="Cancel"
      className={className}
    />
  )
}

interface CompactWarningAlertProps {
  message: string
  onClose?: () => void
  className?: string
}

export function CompactWarningAlert({
  message,
  onClose,
  className
}: CompactWarningAlertProps) {
  return (
    <WarningAlert
      variant="compact"
      title="Warning"
      message={message}
      onClose={onClose}
      className={className}
    />
  )
}

// ============================================
// E-commerce Specific Warning Alerts
// ============================================

interface CartWarningAlertProps {
  itemCount?: number
  onClose?: () => void
  onContinue?: () => void
  onReviewCart?: () => void
  className?: string
}

export function CartWarningAlert({
  itemCount = 1,
  onClose,
  onContinue,
  onReviewCart,
  className
}: CartWarningAlertProps) {
  const itemText = itemCount === 1 ? 'item has' : 'items have'
  
  return (
    <WarningAlert
      title="Cart Warning"
      message={`${itemCount} ${itemText} limited stock availability.`}
      description="Some items may become unavailable during checkout. We recommend reviewing your cart."
      onClose={onClose}
      onConfirm={onContinue}
      onCancel={onReviewCart}
      confirmText="Continue to Checkout"
      cancelText="Review Cart"
      className={className}
    />
  )
}

interface CheckoutWarningAlertProps {
  onClose?: () => void
  onProceed?: () => void
  onGoBack?: () => void
  className?: string
}

export function CheckoutWarningAlert({
  onClose,
  onProceed,
  onGoBack,
  className
}: CheckoutWarningAlertProps) {
  return (
    <WarningAlert
      title="Checkout Warning"
      message="Please verify your shipping address and payment method."
      description="Once you place the order, changes cannot be made. Make sure all information is correct."
      onClose={onClose}
      onConfirm={onProceed}
      onCancel={onGoBack}
      confirmText="Place Order"
      cancelText="Go Back"
      className={className}
    />
  )
}

// ============================================
// Example Usage Components
// ============================================

export function ExampleWarningAlerts() {
  const handleContinue = () => {
    console.log('Continue clicked')
  }

  const handleCancel = () => {
    console.log('Cancel clicked')
  }

  const handleClose = () => {
    console.log('Alert closed')
  }

  return (
    <div className="space-y-4 p-4">
      {/* Stock Warning */}
      <StockWarningAlert
        onContinue={handleContinue}
        onReview={handleCancel}
        onClose={handleClose}
      />

      {/* Payment Warning */}
      <PaymentWarningAlert
        onVerify={handleContinue}
        onCancel={handleCancel}
        onClose={handleClose}
      />

      {/* Cart Warning */}
      <CartWarningAlert
        itemCount={3}
        onContinue={handleContinue}
        onReviewCart={handleCancel}
        onClose={handleClose}
      />

      {/* Checkout Warning */}
      <CheckoutWarningAlert
        onProceed={handleContinue}
        onGoBack={handleCancel}
        onClose={handleClose}
      />

      {/* Compact Warning */}
      <CompactWarningAlert
        message="Session will expire in 5 minutes!"
        onClose={handleClose}
      />
    </div>
  )
}