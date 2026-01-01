import { useState } from 'react'
import AppShell from '../components/layout/AppShell'
import Toggle from '../components/ui/Toggle'
import Icon from '../components/ui/Icon'
import { APP_VERSION } from '../constants'

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [biometricLogin, setBiometricLogin] = useState(true)
  const [locationServices, setLocationServices] = useState(true)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)

  return (
    <AppShell showBack headerTitle="Settings" showNav={false}>
      <div className="flex-1 overflow-auto">
        {/* Appearance */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Appearance
          </h3>
          <div className="space-y-4">
            <Toggle
              checked={darkMode}
              onChange={setDarkMode}
              label="Dark Mode"
              description="Switch to dark theme"
            />
          </div>
        </div>

        {/* Security */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Security
          </h3>
          <div className="space-y-4">
            <Toggle
              checked={biometricLogin}
              onChange={setBiometricLogin}
              label="Biometric Login"
              description="Use Face ID or fingerprint to sign in"
            />

            <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Icon name="lock" size={20} className="text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">
                  Change Password
                </span>
              </div>
              <Icon name="chevron_right" size={20} className="text-slate-400" />
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Icon name="devices" size={20} className="text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">
                  Active Sessions
                </span>
              </div>
              <Icon name="chevron_right" size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            Privacy
          </h3>
          <div className="space-y-4">
            <Toggle
              checked={locationServices}
              onChange={setLocationServices}
              label="Location Services"
              description="Allow app to access your location"
            />

            <Toggle
              checked={analyticsEnabled}
              onChange={setAnalyticsEnabled}
              label="Usage Analytics"
              description="Help us improve the app"
            />

            <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Icon name="download" size={20} className="text-slate-600 dark:text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">
                  Download My Data
                </span>
              </div>
              <Icon name="chevron_right" size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* About */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-4">
            About
          </h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="font-medium text-slate-900 dark:text-white">
                Terms of Service
              </span>
              <Icon name="open_in_new" size={20} className="text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="font-medium text-slate-900 dark:text-white">
                Privacy Policy
              </span>
              <Icon name="open_in_new" size={20} className="text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span className="font-medium text-slate-900 dark:text-white">
                Licenses
              </span>
              <Icon name="chevron_right" size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-center text-sm text-slate-500">
            <p>My Island v{APP_VERSION}</p>
            <p className="mt-1">© 2025 My Island. All rights reserved.</p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-medium text-red-500 uppercase tracking-wider mb-4">
            Danger Zone
          </h3>
          <button className="w-full p-3 border border-red-200 dark:border-red-900 rounded-xl text-red-600 font-medium">
            Delete Account
          </button>
        </div>
      </div>
    </AppShell>
  )
}
