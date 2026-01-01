import { ReactNode } from 'react'
import BottomNav from './BottomNav'
import Header from './Header'

interface AppShellProps {
  children: ReactNode
  headerTitle?: string
  showBack?: boolean
  showLogo?: boolean
  showHeader?: boolean
  showNav?: boolean
  showNotifications?: boolean
  headerRightAction?: ReactNode
  transparentHeader?: boolean
}

export default function AppShell({
  children,
  headerTitle,
  showBack = false,
  showLogo = false,
  showHeader = true,
  showNav = true,
  showNotifications = true,
  headerRightAction,
  transparentHeader = false,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {showHeader && (
        <Header
          title={headerTitle}
          showBack={showBack}
          showLogo={showLogo}
          showNotifications={showNotifications}
          rightAction={headerRightAction}
          transparent={transparentHeader}
        />
      )}

      <main className="flex-1 flex flex-col">{children}</main>

      {showNav && <BottomNav />}
    </div>
  )
}
