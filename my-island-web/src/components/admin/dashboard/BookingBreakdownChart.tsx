import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { adminDashboardService } from '../../../services/adminService';
import type { BookingBreakdown } from '../../../types/admin';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#6366f1', '#ef4444', '#6b7280', '#f97316'];

export const BookingBreakdownChart: React.FC = () => {
  const [data, setData] = useState<BookingBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDashboardService.getBookingBreakdown()
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <h3 className="text-sm font-semibold text-[#111418] dark:text-white mb-4">Booking Status Breakdown</h3>
      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-400">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={256}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={({ name }) => (name as string)?.replace(/_/g, ' ')}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
