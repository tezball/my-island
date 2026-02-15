import React, { useEffect, useState, useCallback } from 'react';
import { featureToggleService } from '../../services/featureToggleService';
import { AdminTable } from '../../components/admin/shared/AdminTable';
import type { FeatureToggle } from '../../types/featureToggle';

export const AdminFeatureTogglesPage: React.FC = () => {
  const [toggles, setToggles] = useState<FeatureToggle[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmToggle, setConfirmToggle] = useState<FeatureToggle | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchToggles = useCallback(() => {
    setLoading(true);
    featureToggleService.getAllToggles()
      .then(setToggles)
      .catch(() => setToggles([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchToggles(); }, [fetchToggles]);

  const handleToggle = async (toggle: FeatureToggle) => {
    setConfirmToggle(null);
    setUpdating(toggle.name);
    try {
      await featureToggleService.updateToggle(toggle.name, !toggle.enabled);
      fetchToggles();
    } finally {
      setUpdating(null);
    }
  };

  const onToggleClick = (toggle: FeatureToggle) => {
    // Show confirmation for critical toggles
    if (toggle.name === 'SUBSCRIPTION_ENFORCEMENT') {
      setConfirmToggle(toggle);
    } else {
      handleToggle(toggle);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Toggle',
      render: (t: FeatureToggle) => (
        <div>
          <p className="font-medium font-mono text-sm">{t.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{t.description || 'No description'}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (t: FeatureToggle) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          {t.category || 'GENERAL'}
        </span>
      ),
    },
    {
      key: 'enabled',
      label: 'Status',
      render: (t: FeatureToggle) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          t.enabled
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${t.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
          {t.enabled ? 'Enabled' : 'Disabled'}
        </span>
      ),
    },
    {
      key: 'action',
      label: '',
      render: (t: FeatureToggle) => (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleClick(t); }}
          disabled={updating === t.name}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          style={{ backgroundColor: t.enabled ? '#ef4444' : '#d1d5db' }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              t.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      render: (t: FeatureToggle) => (
        <span className="text-xs text-gray-500">
          {t.updatedAt ? new Date(t.updatedAt).toLocaleString() : '-'}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#111418] dark:text-white">Feature Toggles</h2>
      </div>

      <AdminTable
        columns={columns}
        data={toggles}
        keyExtractor={(t) => t.id}
        emptyMessage="No feature toggles configured"
      />

      {/* Confirmation Modal */}
      {confirmToggle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a2632] rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">warning</span>
              </div>
              <h3 className="text-lg font-bold text-[#111418] dark:text-white">Confirm Toggle Change</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              You are about to <strong>{confirmToggle.enabled ? 'disable' : 'enable'}</strong> the <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{confirmToggle.name}</code> toggle.
            </p>
            {confirmToggle.name === 'SUBSCRIPTION_ENFORCEMENT' && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
                {confirmToggle.enabled
                  ? 'Disabling this will allow all owners and suppliers to operate without active subscriptions.'
                  : 'Enabling this will enforce subscription checks for bookings, offers, and analytics.'}
              </p>
            )}
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setConfirmToggle(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggle(confirmToggle)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                {confirmToggle.enabled ? 'Disable' : 'Enable'} Toggle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
