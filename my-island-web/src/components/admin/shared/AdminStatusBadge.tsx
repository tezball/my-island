import React from 'react';
import clsx from 'clsx';

const STATUS_STYLES: Record<string, string> = {
  // Booking statuses
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  PENDING_PAYMENT: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  CHECKED_IN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  PAYMENT_FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  // Subscription statuses
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  TRIALING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  PAST_DUE: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  CANCELED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  UNPAID: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  NONE: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  // Lead statuses
  NEW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  CONTACTED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  QUALIFIED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  CONVERTED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  LOST: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  // Support ticket statuses
  OPEN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  CLOSED: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  // Support ticket priorities
  LOW: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  NORMAL: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  // Entity statuses
  DEACTIVATED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  // Booleans
  true: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  false: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

interface AdminStatusBadgeProps {
  status: string;
  label?: string;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ status, label }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES['NONE'];
  return (
    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap", style)}>
      {label || status.replace(/_/g, ' ')}
    </span>
  );
};
