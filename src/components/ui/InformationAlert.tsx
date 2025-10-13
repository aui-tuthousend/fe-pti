import { cn } from '@/lib/utils'
import { Info, X } from 'lucide-react'
import { Button } from './button'

// ============================================
// Information Alert Component
// ============================================

interface InformationAlertProps {
  title?: string
  message?: string
  description?: string
  onClose?: () => void
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  className?: string
  variant?: 'default' | 'sale' | 'promo' | 'announcement' | 'compact'
  primaryText?: string
  secondaryText?: string
}

export function InformationAlert({
  title = "Informational Notification",
  message,
  description,
  onClose,
  onPrimaryAction,
  onSecondaryAction,
  className,
  variant = 'default',
  primaryText = "Learn More",
  secondaryText = "Dismiss"
}: InformationAlertProps) {
  
  // Default content berdasarkan variant
  const getDefaultContent = () => {
    switch (variant) {
      case 'sale':
        return {
          message: "Flash Sale is live now!",
          description: "Enjoy up to 70% off on electronics category.",
          primaryText: "Shop Now",
          secondaryText: "View Deals"
        }
      case 'promo':
        return {
          message: "Special promotion available!",
          description: "Get free shipping on orders above Rp 100.000.",
          primaryText: "Shop Now",
          secondaryText: "Learn More"
        }
      case 'announcement':
        return {
          message: "System maintenance scheduled.",
          description: "Our service will be unavailable on Sunday 2-4 AM for maintenance.",
          primaryText: "Got It",
          secondaryText: "Details"
        }
      case 'compact':
        return {
          message: message || "New feature available.",
          description: "",
          primaryText: "Try It",
          secondaryText: ""
        }
      default:
        return {
          message: message || "Important information for you.",
          description: description || "Please take a moment to review this information.",
          primaryText: primaryText,
          secondaryText: secondaryText
        }
    }
  }

  const content = getDefaultContent()
  const finalMessage = message || content.message
  const finalDescription = description !== undefined ? description : content.description
  const finalPrimaryText = primaryText !== "Learn More" ? primaryText : content.primaryText
  const finalSecondaryText = secondaryText !== "Dismiss" ? secondaryText : content.secondaryText

  return (
    <div className={cn(
      "relative bg-info/10 border border-info/20 rounded-lg p-4 shadow-sm",
      variant === 'compact' && "p-3",
      variant === 'sale' && "bg-gradient-to-r from-primary/10 to-info/10 border-primary/20",
      className
    )}>
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-info/60 hover:text-info transition-colors"
        >
          <X size={18} />
        </button>
      )}

      <div className="flex items-start gap-3">
        {/* Info Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <Info className={cn(
            "w-5 h-5",
            variant === 'sale' ? "text-primary" : "text-info"
          )} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "font-medium text-sm",
              variant === 'sale' ? "text-primary" : "text-info"
            )}>ℹ️</span>
            <h4 className={cn(
              "font-semibold text-sm",
              variant === 'sale' ? "text-primary" : "text-info"
            )}>
              {title}
            </h4>
          </div>

          {/* Message */}
          <p className={cn(
            "text-sm mb-1",
            variant === 'sale' ? "text-primary-foreground" : "text-info-foreground"
          )}>
            {finalMessage}
          </p>

          {/* Description */}
          {variant !== 'compact' && finalDescription && (
            <p className={cn(
              "text-xs mb-3",
              variant === 'sale' ? "text-primary-foreground/80" : "text-info-foreground/80"
            )}>
              {finalDescription}
            </p>
          )}

          {/* Action Buttons */}
          {(onPrimaryAction || onSecondaryAction) && variant !== 'compact' && (
            <div className="flex gap-2 flex-wrap">
              {onPrimaryAction && (
                <Button
                  size="sm"
                  onClick={onPrimaryAction}
                  className={cn(
                    "text-xs h-7 px-3",
                    variant === 'sale' 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-info hover:bg-info/90 text-info-foreground"
                  )}
                >
                  {finalPrimaryText}
                </Button>
              )}
              {onSecondaryAction && finalSecondaryText && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSecondaryAction}
                  className={cn(
                    "text-xs h-7 px-3",
                    variant === 'sale'
                      ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      : "border-info text-info hover:bg-info hover:text-info-foreground"
                  )}
                >
                  {finalSecondaryText}
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
// Preset Information Alerts
// ============================================

interface FlashSaleAlertProps {
  discount?: string
  category?: string
  onShopNow?: () => void
  onViewDeals?: () => void
  onClose?: () => void
  className?: string
}

export function FlashSaleAlert({
  discount = "70%",
  category = "hijab collection",
  onShopNow,
  onViewDeals,
  onClose,
  className
}: FlashSaleAlertProps) {
  return (
    <InformationAlert
      variant="sale"
      title="Flash Sale Live!"
      message="Flash Sale is live now!"
      description={`Enjoy up to ${discount} off on ${category}.`}
      onClose={onClose}
      onPrimaryAction={onShopNow}
      onSecondaryAction={onViewDeals}
      primaryText="Shop Now"
      secondaryText="View Deals"
      className={className}
    />
  )
}

interface PromoAlert {
  minOrder?: string
  onShopNow?: () => void
  onLearnMore?: () => void
  onClose?: () => void
  className?: string
}

export function FreeShippingAlert({
  minOrder = "Rp 100.000",
  onShopNow,
  onLearnMore,
  onClose,
  className
}: PromoAlert) {
  return (
    <InformationAlert
      variant="promo"
      title="Free Shipping Available"
      message="Special promotion available!"
      description={`Get free shipping on orders above ${minOrder}.`}
      onClose={onClose}
      onPrimaryAction={onShopNow}
      onSecondaryAction={onLearnMore}
      primaryText="Shop Now"
      secondaryText="Learn More"
      className={className}
    />
  )
}

interface AnnouncementAlertProps {
  message: string
  description?: string
  onGotIt?: () => void
  onDetails?: () => void
  onClose?: () => void
  className?: string
}

export function AnnouncementAlert({
  message,
  description,
  onGotIt,
  onDetails,
  onClose,
  className
}: AnnouncementAlertProps) {
  return (
    <InformationAlert
      variant="announcement"
      title="System Announcement"
      message={message}
      description={description}
      onClose={onClose}
      onPrimaryAction={onGotIt}
      onSecondaryAction={onDetails}
      primaryText="Got It"
      secondaryText="Details"
      className={className}
    />
  )
}

interface CompactInfoAlertProps {
  message: string
  onAction?: () => void
  actionText?: string
  onClose?: () => void
  className?: string
}

export function CompactInfoAlert({
  message,
  onAction,
  actionText = "OK",
  onClose,
  className
}: CompactInfoAlertProps) {
  return (
    <InformationAlert
      variant="compact"
      title="Info"
      message={message}
      onClose={onClose}
      onPrimaryAction={onAction}
      primaryText={actionText}
      className={className}
    />
  )
}

// ============================================
// E-commerce Specific Information Alerts
// ============================================

interface NewCollectionAlertProps {
  collectionName?: string
  onExplore?: () => void
  onWishlist?: () => void
  onClose?: () => void
  className?: string
}

export function NewCollectionAlert({
  collectionName = "Summer Hijab Collection",
  onExplore,
  onWishlist,
  onClose,
  className
}: NewCollectionAlertProps) {
  return (
    <InformationAlert
      title="New Collection Alert"
      message={`${collectionName} is now available!`}
      description="Discover the latest trends and styles in our newest collection."
      onClose={onClose}
      onPrimaryAction={onExplore}
      onSecondaryAction={onWishlist}
      primaryText="Explore Collection"
      secondaryText="Add to Wishlist"
      className={className}
    />
  )
}

interface StockUpdateAlertProps {
  productName?: string
  onNotify?: () => void
  onBrowse?: () => void
  onClose?: () => void
  className?: string
}

export function StockUpdateAlert({
  productName = "Popular Hijab Item",
  onNotify,
  onBrowse,
  onClose,
  className
}: StockUpdateAlertProps) {
  return (
    <InformationAlert
      title="Stock Update"
      message={`${productName} is back in stock!`}
      description="Limited quantities available. Get yours before it's sold out again."
      onClose={onClose}
      onPrimaryAction={onNotify}
      onSecondaryAction={onBrowse}
      primaryText="Buy Now"
      secondaryText="Browse Similar"
      className={className}
    />
  )
}

// ============================================
// Example Usage Components
// ============================================

export function ExampleInformationAlerts() {
  const handlePrimaryAction = () => {
    console.log('Primary action clicked')
  }

  const handleSecondaryAction = () => {
    console.log('Secondary action clicked')
  }

  const handleClose = () => {
    console.log('Alert closed')
  }

  return (
    <div className="space-y-4 p-4">
      {/* Flash Sale Alert */}
      <FlashSaleAlert
        discount="70%"
        category="hijab collection"
        onShopNow={handlePrimaryAction}
        onViewDeals={handleSecondaryAction}
        onClose={handleClose}
      />

      {/* Free Shipping Alert */}
      <FreeShippingAlert
        minOrder="Rp 150.000"
        onShopNow={handlePrimaryAction}
        onLearnMore={handleSecondaryAction}
        onClose={handleClose}
      />

      {/* System Announcement */}
      <AnnouncementAlert
        message="System maintenance scheduled."
        description="Our service will be unavailable on Sunday 2-4 AM for maintenance."
        onGotIt={handlePrimaryAction}
        onDetails={handleSecondaryAction}
        onClose={handleClose}
      />

      {/* New Collection */}
      <NewCollectionAlert
        collectionName="Ramadan Special Collection"
        onExplore={handlePrimaryAction}
        onWishlist={handleSecondaryAction}
        onClose={handleClose}
      />

      {/* Compact Info */}
      <CompactInfoAlert
        message="Your profile has been updated successfully!"
        onAction={handlePrimaryAction}
        actionText="OK"
        onClose={handleClose}
      />
    </div>
  )
}