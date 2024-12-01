import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const notificationVariants = cva(
  "fixed top-4 right-4 w-full max-w-sm overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-white border border-gray-200",
        success: "bg-green-50 border border-green-200",
        error: "bg-red-50 border border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface NotificationProps extends VariantProps<typeof notificationVariants> {
  message: string
  onDismiss?: () => void
  duration?: number
}

export function Notification({
  message,
  variant,
  onDismiss,
  duration = 5000,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  if (!isVisible) return null

  return (
    <div className={cn(notificationVariants({ variant }), isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0')}>
      <div className="flex items-start p-4">
        {variant === 'success' && <CheckCircle2 className="h-5 w-5 text-green-400" />}
        {variant === 'error' && <AlertCircle className="h-5 w-5 text-red-400" />}
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <button
          className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={() => {
            setIsVisible(false)
            onDismiss?.()
          }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

