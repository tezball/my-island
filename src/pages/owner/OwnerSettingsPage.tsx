import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../components/layout/AppShell'
import Toggle from '../../components/ui/Toggle'
import Icon from '../../components/ui/Icon'

export default function OwnerSettingsPage() {
  const [instantBooking, setInstantBooking] = useState(true)
  const [autoResponder, setAutoResponder] = useState(false)
  const [bookingNotifications, setBookingNotifications] = useState(true)
  const [reviewNotifications, setReviewNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)

  return (
    <AppShell showBack headerTitle="Owner Settings" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Booking Settings */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Booking Settings
          </h3>
          <div className="space-y-4">
            <Toggle
              checked={instantBooking}
              onChange={setInstantBooking}
              label="Instant Booking"
              description="Allow guests to book without approval"
            />

            <Toggle
              checked={autoResponder}
              onChange={setAutoResponder}
              label="Auto-Responder"
              description="Send automatic reply to new inquiries"
            />

            <Link
              to="/owner/settings/calendar"
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Icon name="calendar_today" size={20} className="text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">
                  Calendar Sync
                </span>
              </div>
              <Icon name="chevron_right" size={20} className="text-slate-400" />
            </Link>

            <Link
              to="/owner/settings/pricing"
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Icon name="euro" size={20} className="text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">
                  Pricing Rules
                </span>
              </div>
              <Icon name="chevron_right" size={20} className="text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Notifications
          </h3>
          <div className="space-y-4">
            <Toggle
              checked={bookingNotifications}
              onChange={setBookingNotifications}
              label="New Bookings"
              description="Get notified for new reservations"
            />

            <Toggle
              checked={reviewNotifications}
              onChange={setReviewNotifications}
              label="Guest Reviews"
              description="Get notified when guests leave reviews"
            />

            <Toggle
              checked={weeklyReport}
              onChange={setWeeklyReport}
              label="Weekly Report"
              description="Receive weekly performance summary"
            />
          </div>
        </div>

        {/* Payout Settings */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Payouts
          </h3>
          <div className="space-y-2">
            <Link
              to="/owner/settings/bank"
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Icon name="account_balance" size={20} className="text-slate-600 dark:text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Bank Account
                  </p>
                  <p className="text-sm text-slate-500">•••• 4567</p>
                </div>
              </div>
              <Icon name="chevron_right" size={20} className="text-slate-400" />
            </Link>

            <Link
              to="/owner/settings/payout-schedule"
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Icon name="schedule" size={20} className="text-slate-600 dark:text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Payout Schedule
                  </p>
                  <p className="text-sm text-slate-500">Weekly</p>
                </div>
              </div>
              <Icon name="chevron_right" size={20} className="text-slate-400" />
            </Link>

            <Link
              to="/owner/settings/tax"
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Icon name="receipt" size={20} className="text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">
                  Tax Information
                </span>
              </div>
              <Icon name="chevron_right" size={20} className="text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Team Management */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Team
          </h3>
          <Link
            to="/owner/settings/team"
            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Icon name="group" size={20} className="text-slate-600 dark:text-slate-400" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Team Members
                </p>
                <p className="text-sm text-slate-500">2 members</p>
              </div>
            </div>
            <Icon name="chevron_right" size={20} className="text-slate-400" />
          </Link>
        </div>

        {/* Help */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Help & Support
          </h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Icon name="help" size={20} className="text-slate-600 dark:text-slate-400" />
              <span className="font-medium text-slate-900 dark:text-white">
                Host Help Center
              </span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <Icon name="support_agent" size={20} className="text-slate-600 dark:text-slate-400" />
              <span className="font-medium text-slate-900 dark:text-white">
                Contact Host Support
              </span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
