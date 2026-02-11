import React, { useEffect, useState } from 'react';
import { adminDashboardService } from '../../../services/adminService';
import type { ActivityEntry } from '../../../types/admin';

const ACTION_ICONS: Record<string, string> = {
  UPDATE_USER: 'person', TOGGLE_ACTIVE: 'toggle_on', CANCEL_BOOKING: 'event_busy',
  UPDATE_BOOKING: 'edit_calendar', FLAG_REVIEW: 'flag', DELETE_REVIEW: 'delete',
  CREATE_LEAD: 'person_add', UPDATE_LEAD: 'edit', DEFAULT: 'history',
};

export const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDashboardService.getRecentActivity()
      .then(setActivities)
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-[#111418] dark:text-white mb-4">Recent Activity</h3>
      {loading ? (
        <div className="py-8 text-center text-gray-400">Loading...</div>
      ) : activities.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">No recent activity</p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {activities.map((a) => (
            <div key={a.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <div className="size-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-red-500 text-sm">{ACTION_ICONS[a.action] || ACTION_ICONS.DEFAULT}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[#111418] dark:text-white truncate">{a.summary || a.action.replace(/_/g, ' ')}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.entityType} #{a.entityId} &middot; {new Date(a.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
