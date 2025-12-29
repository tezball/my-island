import { cn } from '@/utils/cn'

interface StickyActionBarProps {
  children: React.ReactNode
  className?: string
  showBorder?: boolean
}

export function StickyActionBar({
  children,
  className,
  showBorder = true,
}: StickyActionBarProps) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-white/90 dark:bg-surface-dark/90 backdrop-blur-lg',
        showBorder && 'border-t border-gray-100 dark:border-gray-800/50',
        className
      )}
    >
      <div className="max-w-md mx-auto px-4 py-4 pb-8">
        {children}
      </div>
    </div>
  )
}
