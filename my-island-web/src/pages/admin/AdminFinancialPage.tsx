import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminFinancialService } from '../../services/adminService';
import { AdminTable } from '../../components/admin/shared/AdminTable';
import { CsvExportButton } from '../../components/admin/shared/CsvExportButton';
import type { FinancialDataPoint, PerOwnerRevenue } from '../../types/admin';

export const AdminFinancialPage: React.FC = () => {
    const [period, setPeriod] = useState<'weekly' | 'monthly'>('monthly');
    const [revenue, setRevenue] = useState<FinancialDataPoint[]>([]);
    const [fees, setFees] = useState<FinancialDataPoint[]>([]);
    const [volume, setVolume] = useState<FinancialDataPoint[]>([]);
    const [perOwner, setPerOwner] = useState<PerOwnerRevenue[]>([]);
    const [loading, setLoading] = useState(true);
    const [exportStart, setExportStart] = useState('2025-01-01');
    const [exportEnd, setExportEnd] = useState(new Date().toISOString().slice(0, 10));

    useEffect(() => {
        setLoading(true);
        Promise.all([
            adminFinancialService.getRevenue(period),
            adminFinancialService.getServiceFees(period),
            adminFinancialService.getBookingVolume(period),
            adminFinancialService.getPerOwnerRevenue(),
        ])
            .then(([r, f, v, o]) => { setRevenue(r); setFees(f); setVolume(v); setPerOwner(o); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [period]);

    const ownerColumns = [
        { key: 'propertyName', label: 'Property', render: (o: PerOwnerRevenue) => (
            <div><p className="font-medium">{o.propertyName}</p><p className="text-xs text-gray-400">{o.ownerName}</p></div>
        )},
        { key: 'bookingCount', label: 'Bookings' },
        { key: 'revenue', label: 'Revenue', render: (o: PerOwnerRevenue) => <span className="font-medium">&euro;{o.revenue?.toFixed(2)}</span> },
        { key: 'serviceFees', label: 'Fees', render: (o: PerOwnerRevenue) => <span>&euro;{o.serviceFees?.toFixed(2)}</span> },
    ];

    if (loading) {
        return <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#111418] dark:text-white">Financial Reports</h2>
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                    {(['weekly', 'monthly'] as const).map((p) => (
                        <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${period === p ? 'bg-white dark:bg-[#1a2632] text-[#111418] dark:text-white shadow-sm' : 'text-gray-500'}`}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                    <h3 className="text-sm font-semibold text-[#111418] dark:text-white mb-4">Revenue</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={revenue}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={(v) => `€${v}`} />
                            <Tooltip formatter={(v) => [`€${Number(v).toLocaleString()}`, 'Revenue']} />
                            <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Service Fees */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                    <h3 className="text-sm font-semibold text-[#111418] dark:text-white mb-4">Service Fees</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={fees}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={(v) => `€${v}`} />
                            <Tooltip formatter={(v) => [`€${Number(v).toLocaleString()}`, 'Fees']} />
                            <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Booking Volume */}
                <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-5 lg:col-span-2">
                    <h3 className="text-sm font-semibold text-[#111418] dark:text-white mb-4">Booking Volume</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={volume}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Per Owner Revenue */}
            <div>
                <h3 className="text-sm font-semibold text-[#111418] dark:text-white mb-3">Revenue by Owner</h3>
                <AdminTable columns={ownerColumns} data={perOwner} keyExtractor={(o) => o.ownerId} emptyMessage="No revenue data" />
            </div>

            {/* CSV Export */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="text-sm font-semibold text-[#111418] dark:text-white mb-4">Export Financial Data</h3>
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                        <input type="date" value={exportStart} onChange={(e) => setExportStart(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">End Date</label>
                        <input type="date" value={exportEnd} onChange={(e) => setExportEnd(e.target.value)} className="px-3 py-2 bg-white dark:bg-[#0d1520] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-[#111418] dark:text-white" />
                    </div>
                    <CsvExportButton onExport={() => adminFinancialService.exportCsv(exportStart, exportEnd)} label="Export Bookings CSV" />
                </div>
            </div>
        </div>
    );
};
