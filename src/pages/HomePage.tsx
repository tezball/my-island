import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="size-10 rounded-full bg-primary flex items-center justify-center">
            <Icon name="forest" size={24} className="text-slate-900" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">my-island</span>
        </div>
        <Link to="/login">
          <Button variant="ghost" size="sm">
            <Icon name="person" size={20} />
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Placeholder Content */}
        <div className="text-center space-y-6 max-w-md">
          {/* Hero Icon */}
          <div className="mx-auto size-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="camping" size={48} className="text-primary" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome to my-island
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Discover the best camping spots across Ireland.
            </p>
          </div>

          {/* Placeholder Features */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
              <Icon name="explore" size={32} className="text-primary mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Discover</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Find amazing campsites</p>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
              <Icon name="calendar_month" size={32} className="text-primary mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Book</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Reserve your spot</p>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
              <Icon name="favorite" size={32} className="text-primary mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Save</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Keep your favorites</p>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
              <Icon name="star" size={32} className="text-primary mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Review</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Share experiences</p>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 mt-6">
            <div className="flex items-center justify-center gap-2 text-primary mb-2">
              <Icon name="construction" size={24} />
              <span className="font-semibold">Under Construction</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This is a placeholder home page. The full campsite discovery experience is coming soon!
            </p>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <Link to="/login">
              <Button variant="primary" size="lg" rightIcon="arrow_forward" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Placeholder */}
      <nav className="sticky bottom-0 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Icon name="home" size={24} filled />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <Icon name="search" size={24} />
            <span className="text-xs font-medium">Search</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <Icon name="favorite" size={24} />
            <span className="text-xs font-medium">Saved</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <Icon name="calendar_month" size={24} />
            <span className="text-xs font-medium">Bookings</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <Icon name="person" size={24} />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
