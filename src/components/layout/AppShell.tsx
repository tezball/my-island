import { cn } from '@/utils/cn'
import { BottomNav } from './BottomNav'

interface AppShellProps {
  children: React.ReactNode
  hideBottomNav?: boolean
  className?: string
}

export function AppShell({ children, hideBottomNav = false, className }: AppShellProps) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      <main className="flex-1 w-full max-w-md mx-auto">{children}</main>
      {!hideBottomNav && <BottomNav />}
    </div>
  )
}
