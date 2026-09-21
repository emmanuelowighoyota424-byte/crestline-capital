'use client'

import { useState } from 'react'
import { CustomerLayout } from '@/components/customer/customer-layout'
import { useBanking } from '@/hooks/use-banking'
import { Settings, Shield, Bell, Moon, Smartphone, Check } from 'lucide-react'

export default function SettingsPage() {
  const { appSettings, updateAppSettings } = useBanking()
  const [saved, setSaved] = useState(false)

  const handleToggle = (key: string, value: boolean) => {
    updateAppSettings({ [key]: value })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account & App Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure security protocols, transactional alert thresholds, and device preferences.
          </p>
        </div>

        {saved && (
          <div className="p-3 bg-green-100 border border-emerald-500/30 text-green-600 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Preferences saved and synchronized across your linked devices.</span>
          </div>
        )}

        {/* Security & Authentication Section */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <Shield className="w-4 h-4 text-[#0a4fa6]" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Security & Access</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900 block">Biometric Authentication</span>
                <span className="text-xs text-gray-500">Require FaceID / TouchID on app unlock</span>
              </div>
              <input
                type="checkbox"
                checked={appSettings?.biometricLogin ?? true}
                onChange={(e) => handleToggle('biometricLogin', e.target.checked)}
                className="w-5 h-5 accent-[#0a4fa6] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900 block">High-Value Transfer MFA Challenge</span>
                <span className="text-xs text-gray-500">Prompt for 6-digit TOTP token on transfers &gt; $5,000</span>
              </div>
              <input
                type="checkbox"
                checked={appSettings?.twoFactorEnabled ?? true}
                onChange={(e) => handleToggle('twoFactorEnabled', e.target.checked)}
                className="w-5 h-5 accent-[#0a4fa6] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <Bell className="w-4 h-4 text-[#0a4fa6]" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Notification Channels</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900 block">Instant Transaction Push Notifications</span>
                <span className="text-xs text-gray-500">Dispatched within 500ms of card tap or debit clearance</span>
              </div>
              <input
                type="checkbox"
                checked={appSettings?.pushNotifications ?? true}
                onChange={(e) => handleToggle('pushNotifications', e.target.checked)}
                className="w-5 h-5 accent-[#0a4fa6] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900 block">Email Statements & Tax Reminders</span>
                <span className="text-xs text-gray-500">Monthly 1099-INT and reconciliation digests</span>
              </div>
              <input
                type="checkbox"
                checked={appSettings?.emailNotifications ?? true}
                onChange={(e) => handleToggle('emailNotifications', e.target.checked)}
                className="w-5 h-5 accent-[#0a4fa6] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
