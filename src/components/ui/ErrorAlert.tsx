import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { useState } from 'react'

type AlertVariant = 'error' | 'warning' | 'success' | 'info'

interface ErrorAlertProps {
  variant?: AlertVariant
  title: string
  message: string
  onClose?: () => void
  dismissible?: boolean
  className?: string
}

/**
 * Alert Component with multiple variants
 * Can be used for errors, warnings, success, and info messages
 */
export function ErrorAlert({
  variant = 'error',
  title,
  message,
  onClose,
  dismissible = true,
  className = '',
}: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  const variants = {
    error: {
      container: 'bg-destructive text-destructive-foreground border-destructive',
      icon: AlertCircle,
    },
    warning: {
      container: 'bg-warning text-warning-foreground border-warning',
      icon: AlertTriangle,
    },
    success: {
      container: 'bg-success text-success-foreground border-success',
      icon: CheckCircle,
    },
    info: {
      container: 'bg-info text-info-foreground border-info',
      icon: Info,
    },
  }

  const config = variants[variant]
  const Icon = config.icon

  return (
    <div
      className={`${config.container} border rounded-lg p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm opacity-90">{message}</p>
        </div>

        {/* Close Button */}
        {dismissible && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
