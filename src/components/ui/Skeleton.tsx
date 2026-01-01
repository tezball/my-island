import { cn } from '../../lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

/**
 * Skeleton loading placeholder component
 */
export default function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseStyles = 'bg-slate-200 dark:bg-slate-700'

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%]',
    none: '',
  }

  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-xl',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={cn(baseStyles, animationStyles[animation], variantStyles[variant], className)}
      style={style}
    />
  )
}

// Pre-built skeleton patterns for common use cases

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
      <Skeleton variant="rectangular" className="w-full h-40" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton variant="text" className="w-20" />
          <Skeleton variant="text" className="w-16" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
  )
}

export function SkeletonBookingCard() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
      <Skeleton variant="rectangular" className="w-full h-32" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="w-2/3 h-5" />
        <Skeleton variant="text" className="w-1/3" />
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-4">
            <Skeleton variant="text" className="w-24" />
            <Skeleton variant="text" className="w-12" />
          </div>
          <Skeleton variant="text" className="w-16 h-5" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonCampsiteCard() {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
      <Skeleton variant="rectangular" className="w-full h-48" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton variant="text" className="w-2/3 h-5" />
          <Skeleton variant="text" className="w-12" />
        </div>
        <Skeleton variant="text" className="w-1/2" />
        <div className="flex gap-2">
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={60} height={24} />
        </div>
        <div className="flex justify-between items-center pt-2">
          <Skeleton variant="text" className="w-24" />
          <Skeleton variant="rounded" width={80} height={32} />
        </div>
      </div>
    </div>
  )
}

export function SkeletonStatCard() {
  return (
    <div className="p-4 bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800">
      <Skeleton variant="circular" width={40} height={40} className="mb-3" />
      <Skeleton variant="text" className="w-16 h-6 mb-1" />
      <Skeleton variant="text" className="w-24" />
    </div>
  )
}
