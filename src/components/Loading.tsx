import { cn } from '@/lib/utils'

// ============================================
// Loading Components (Simple & Customizable)
// ============================================

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  color?: 'primary' | 'secondary' | 'success' | 'destructive'
  className?: string
}

const sizeClasses = {
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-3',
  lg: 'h-16 w-16 border-4',
}

const colorClasses = {
  primary: 'border-primary',
  secondary: 'border-secondary',
  success: 'border-success',
  destructive: 'border-destructive',
}

/**
 * Loading Spinner Component
 * Simple customizable loading spinner
 */
export function Loading({ 
  size = 'md', 
  text, 
  color = 'primary',
  className 
}: LoadingProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-t-transparent',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      {text && (
        <p className="text-muted-foreground mt-3 text-sm">
          {text}
        </p>
      )}
    </div>
  )
}

/**
 * Full Page Loading
 * Loading spinner untuk full page
 */
export function LoadingPage({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loading size="lg" text={text} />
    </div>
  )
}

/**
 * Inline Loading Spinner
 * Small spinner untuk button atau inline text
 */
export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        'animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent',
        className
      )}
    />
  )
}
