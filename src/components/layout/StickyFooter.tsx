import { cn } from '@/utils/cn'

interface StickyFooterProps {
  children: React.ReactNode
  className?: string
}

export function StickyFooter({ children, className }: StickyFooterProps) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30',
        'bg-surface-light/80 dark:bg-background-dark/80 backdrop-blur-lg',
        'border-t border-gray-200 dark:border-gray-800',
        'p-4 pb-8',
        className
      )}
    >
      <div className="max-w-md mx-auto">{children}</div>
    </div>
  )
}
