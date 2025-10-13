import { cn } from '@/lib/utils'
import { CheckCircle, X } from 'lucide-react'
import { Button } from './button'

// ============================================
// Success Alert Component
// ============================================

interface SuccessAlertProps {
  title?: string
  message?: string
  description?: string
  orderNumber?: string
  onClose?: () => void
  onViewDetails?: () => void
  onTrackOrder?: () => void
  className?: string
  variant?: 'default' | 'order' | 'compact'
}

export function SuccessAlert({
  title = "Success Notification",
  message,
  description,
  orderNumber,
  onClose,
  onViewDetails,
  onTrackOrder,
  className,
  variant = 'default'
}: SuccessAlertProps) {
  
  // Default content untuk order success
  const defaultOrderMessage = orderNumber 
    ? `Order #${orderNumber} has been placed successfully.`
    : "Your order has been placed successfully."
  
  const defaultDescription = "We will start processing your order shortly."

  const finalMessage = message || defaultOrderMessage
  const finalDescription = description || defaultDescription

  return (
    <div className={cn(
      "relative bg-success/10 border border-success/20 rounded-lg p-4 shadow-sm",
      variant === 'compact' && "p-3",
      className
    )}>
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-success/60 hover:text-success transition-colors"
        >
          <X size={18} />
        </button>
      )}

      <div className="flex items-start gap-3">
        {/* Success Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <CheckCircle className="w-5 h-5 text-success" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-success font-medium text-sm">✅</span>
            <h4 className="text-success font-semibold text-sm">
              {title}
            </h4>
          </div>

          {/* Message */}
          <p className="text-success-foreground text-sm mb-1">
            {finalMessage}
          </p>

          {/* Description */}
          {variant !== 'compact' && (
            <p className="text-success-foreground/80 text-xs mb-3">
              {finalDescription}
            </p>
          )}

          {/* Action Buttons */}
          {(onViewDetails || onTrackOrder) && variant !== 'compact' && (
            <div className="flex gap-2 flex-wrap">
              {onViewDetails && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewDetails}
                  className="border-success text-success hover:bg-success hover:text-success-foreground text-xs h-7 px-3"
                >
                  View Details
                </Button>
              )}
              {onTrackOrder && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onTrackOrder}
                  className="border-success text-success hover:bg-success hover:text-success-foreground text-xs h-7 px-3"
                >
                  Track Order
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
// Preset Success Alerts
// ============================================

interface OrderSuccessAlertProps {
  orderNumber: string
  onClose?: () => void
  onViewDetails?: () => void
  onTrackOrder?: () => void
  className?: string
}

export function OrderSuccessAlert({
  orderNumber,
  onClose,
  onViewDetails,
  onTrackOrder,
  className
}: OrderSuccessAlertProps) {
  return (
    <SuccessAlert
      variant="order"
      orderNumber={orderNumber}
      onClose={onClose}
      onViewDetails={onViewDetails}
      onTrackOrder={onTrackOrder}
      className={className}
    />
  )
}

interface CompactSuccessAlertProps {
  message: string
  onClose?: () => void
  className?: string
}

export function CompactSuccessAlert({
  message,
  onClose,
  className
}: CompactSuccessAlertProps) {
  return (
    <SuccessAlert
      variant="compact"
      title="Success"
      message={message}
      onClose={onClose}
      className={className}
    />
  )
}

// ============================================
// Example Usage Components
// ============================================

export function ExampleOrderSuccess() {
  const handleViewDetails = () => {
    console.log('View order details clicked')
  }

  const handleTrackOrder = () => {
    console.log('Track order clicked')
  }

  const handleClose = () => {
    console.log('Alert closed')
  }

  return (
    <div className="space-y-4 p-4">
      {/* Default Order Success */}
      <OrderSuccessAlert
        orderNumber="A123"
        onViewDetails={handleViewDetails}
        onTrackOrder={handleTrackOrder}
        onClose={handleClose}
      />

      {/* Custom Success */}
      <SuccessAlert
        title="Payment Confirmed"
        message="Your payment has been processed successfully."
        description="You will receive a confirmation email shortly."
        onClose={handleClose}
      />

      {/* Compact Success */}
      <CompactSuccessAlert
        message="Profile updated successfully!"
        onClose={handleClose}
      />
    </div>
  )
}