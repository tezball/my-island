import { apiRequest, API_BASE } from './apiClient';
import type {
  DashboardStats,
  ChartDataPoint,
  BookingBreakdown,
  ActivityEntry,
  AdminUser,
  AdminUserUpdate,
  AdminBooking,
  AdminOwner,
  AdminOwnerUpdate,
  AdminOwnerCreate,
  AdminSupplier,
  AdminSupplierUpdate,
  AdminSupplierCreate,
  AdminReview,
  SubscriptionOverview,
  SubscriptionEntry,
  FinancialDataPoint,
  PerOwnerRevenue,
  Lead,
  LeadCreate,
  LeadInteraction,
  LeadInteractionCreate,
  AuditLogEntry,
  PageResponse,
} from '../types/admin';

// --- Dashboard ---

export const adminDashboardService = {
  getStats: () =>
    apiRequest<DashboardStats>('/admin/dashboard'),

  getRevenueChart: async (period: string = 'monthly'): Promise<ChartDataPoint[]> => {
    const raw = await apiRequest<{ label: string; revenue: number }[]>(`/admin/dashboard/revenue-chart?period=${period}`);
    return raw.map((d) => ({ label: d.label, value: Number(d.revenue) || 0 }));
  },

  getBookingBreakdown: async (): Promise<BookingBreakdown[]> => {
    const raw = await apiRequest<Record<string, number>>('/admin/dashboard/booking-breakdown');
    return Object.entries(raw).map(([status, count]) => ({ status, count }));
  },

  getRecentActivity: () =>
    apiRequest<ActivityEntry[]>('/admin/dashboard/activity?limit=10'),
};

// --- Users ---

export const adminUserService = {
  list: (search: string = '', page: number = 0, size: number = 20) =>
    apiRequest<PageResponse<AdminUser>>(`/admin/users?search=${encodeURIComponent(search)}&page=${page}&size=${size}`),

  get: (id: number) =>
    apiRequest<AdminUser>(`/admin/users/${id}`),

  update: (id: number, data: AdminUserUpdate) =>
    apiRequest<AdminUser>(`/admin/users/${id}`, { method: 'PUT', body: data }),

  toggleActive: (id: number) =>
    apiRequest<AdminUser>(`/admin/users/${id}/toggle-active`, { method: 'PUT' }),

  eligibleOwners: (search: string = '', page: number = 0, size: number = 20) =>
    apiRequest<PageResponse<AdminUser>>(`/admin/users/eligible-owners?search=${encodeURIComponent(search)}&page=${page}&size=${size}`),

  eligibleSuppliers: (search: string = '', page: number = 0, size: number = 20) =>
    apiRequest<PageResponse<AdminUser>>(`/admin/users/eligible-suppliers?search=${encodeURIComponent(search)}&page=${page}&size=${size}`),
};

// --- Bookings ---

export const adminBookingService = {
  list: (status: string = '', page: number = 0, size: number = 20) =>
    apiRequest<PageResponse<AdminBooking>>(`/admin/bookings?status=${status}&page=${page}&size=${size}`),

  get: (id: number) =>
    apiRequest<AdminBooking>(`/admin/bookings/${id}`),

  cancel: (id: number, reason: string) =>
    apiRequest<AdminBooking>(`/admin/bookings/${id}/cancel`, { method: 'POST', body: { reason } }),

  update: (id: number, status: string) =>
    apiRequest<AdminBooking>(`/admin/bookings/${id}`, { method: 'PUT', body: { status } }),
};

// --- Owners ---

export const adminOwnerService = {
  list: (subscriptionStatus: string = '', page: number = 0, size: number = 20) =>
    apiRequest<PageResponse<AdminOwner>>(`/admin/owners?subscriptionStatus=${encodeURIComponent(subscriptionStatus)}&page=${page}&size=${size}`),

  get: (id: number) =>
    apiRequest<AdminOwner>(`/admin/owners/${id}`),

  create: (data: AdminOwnerCreate) =>
    apiRequest<AdminOwner>('/admin/owners', { method: 'POST', body: data }),

  update: (id: number, data: AdminOwnerUpdate) =>
    apiRequest<AdminOwner>(`/admin/owners/${id}`, { method: 'PUT', body: data }),

  toggleDeactivated: (id: number) =>
    apiRequest<AdminOwner>(`/admin/owners/${id}/deactivate`, { method: 'PUT' }),
};

// --- Suppliers ---

export const adminSupplierService = {
  list: (category: string = '', page: number = 0, size: number = 20) =>
    apiRequest<PageResponse<AdminSupplier>>(`/admin/suppliers?category=${encodeURIComponent(category)}&page=${page}&size=${size}`),

  get: (id: number) =>
    apiRequest<AdminSupplier>(`/admin/suppliers/${id}`),

  create: (data: AdminSupplierCreate) =>
    apiRequest<AdminSupplier>('/admin/suppliers', { method: 'POST', body: data }),

  update: (id: number, data: AdminSupplierUpdate) =>
    apiRequest<AdminSupplier>(`/admin/suppliers/${id}`, { method: 'PUT', body: data }),

  toggleVerified: (id: number) =>
    apiRequest<AdminSupplier>(`/admin/suppliers/${id}/verify`, { method: 'PUT' }),

  toggleDeactivated: (id: number) =>
    apiRequest<AdminSupplier>(`/admin/suppliers/${id}/deactivate`, { method: 'PUT' }),
};

// --- Reviews ---

interface RawReview {
  type: string;
  id: number;
  userId: number;
  userName: string;
  ownerId?: number;
  ownerName?: string;
  supplierId?: number;
  supplierName?: string;
  rating: number;
  comment: string;
  ownerResponse?: string;
  supplierResponse?: string;
  isFlagged: boolean;
  createdAt: string;
}

export const adminReviewService = {
  list: async (page: number = 0, size: number = 20): Promise<PageResponse<AdminReview>> => {
    const raw = await apiRequest<RawReview[]>(`/admin/reviews?page=${page}&size=${size}`);
    const reviews: AdminReview[] = raw.map((r) => ({
      id: r.id,
      type: r.type as 'OWNER' | 'SUPPLIER',
      userId: r.userId,
      userName: r.userName,
      targetId: r.type === 'OWNER' ? (r.ownerId ?? 0) : (r.supplierId ?? 0),
      targetName: r.type === 'OWNER' ? (r.ownerName ?? '') : (r.supplierName ?? ''),
      rating: r.rating,
      comment: r.comment,
      response: r.ownerResponse ?? r.supplierResponse ?? null,
      isFlagged: r.isFlagged,
      createdAt: r.createdAt,
    }));
    return {
      content: reviews,
      totalElements: reviews.length,
      totalPages: 1,
      number: page,
      size,
      first: page === 0,
      last: true,
    };
  },

  flag: (type: string, id: number) =>
    apiRequest<void>(`/admin/reviews/${type}/${id}/flag`, { method: 'PUT' }),

  remove: (type: string, id: number) =>
    apiRequest<void>(`/admin/reviews/${type}/${id}`, { method: 'DELETE' }),
};

// --- Subscriptions ---

export const adminSubscriptionService = {
  getOverview: async (): Promise<SubscriptionOverview> => {
    const raw = await apiRequest<{ ownersByStatus: Record<string, number>; suppliersByStatus: Record<string, number> }>('/admin/subscriptions/overview');
    return {
      ownerCounts: raw.ownersByStatus ?? {},
      supplierCounts: raw.suppliersByStatus ?? {},
    };
  },

  list: async (entityType: string = '', page: number = 0, size: number = 20): Promise<PageResponse<SubscriptionEntry>> => {
    const raw = await apiRequest<{ id: number; type: string; name: string; userId: number; userEmail: string; subscriptionStatus: string }[]>(
      `/admin/subscriptions?entityType=${entityType}&page=${page}&size=${size}`
    );
    const entries: SubscriptionEntry[] = raw.map((s) => ({
      id: s.id,
      entityType: s.type as 'OWNER' | 'SUPPLIER',
      name: s.name,
      email: s.userEmail,
      status: s.subscriptionStatus,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      isTrialing: s.subscriptionStatus === 'TRIALING',
      trialDaysRemaining: null,
      createdAt: '',
    }));
    return {
      content: entries,
      totalElements: entries.length,
      totalPages: 1,
      number: page,
      size,
      first: page === 0,
      last: true,
    };
  },
};

// --- Financial ---

export const adminFinancialService = {
  getRevenue: async (period: string = 'monthly'): Promise<FinancialDataPoint[]> => {
    const raw = await apiRequest<{ label: string; revenue: number }[]>(`/admin/financial/revenue?period=${period}`);
    return raw.map((d) => ({ label: d.label, value: Number(d.revenue) || 0 }));
  },

  getServiceFees: async (period: string = 'monthly'): Promise<FinancialDataPoint[]> => {
    const raw = await apiRequest<{ label: string; serviceFees: number }[]>(`/admin/financial/service-fees?period=${period}`);
    return raw.map((d) => ({ label: d.label, value: Number(d.serviceFees) || 0 }));
  },

  getPerOwnerRevenue: async (): Promise<PerOwnerRevenue[]> => {
    const raw = await apiRequest<{ ownerId: number; ownerName: string; revenue: number; bookingCount: number }[]>('/admin/financial/per-owner');
    return raw.map((d) => ({
      ownerId: d.ownerId,
      ownerName: d.ownerName,
      propertyName: d.ownerName,
      revenue: Number(d.revenue) || 0,
      bookingCount: d.bookingCount,
      serviceFees: 0,
    }));
  },

  getBookingVolume: async (period: string = 'monthly'): Promise<FinancialDataPoint[]> => {
    const raw = await apiRequest<{ label: string; count: number }[]>(`/admin/financial/booking-volume?period=${period}`);
    return raw.map((d) => ({ label: d.label, value: d.count || 0 }));
  },

  exportCsv: async (startDate: string, endDate: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/financial/export?startDate=${startDate}&endDate=${endDate}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Export failed');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-export-${startDate}-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

// --- Leads CRM ---

export const adminLeadService = {
  list: (status: string = '', businessType: string = '', _assignedTo: string = '', page: number = 0, size: number = 20) =>
    apiRequest<PageResponse<Lead>>(`/admin/leads?status=${status}&businessType=${businessType}&page=${page}&size=${size}`),

  get: (id: number) =>
    apiRequest<{ lead: Lead; interactions: LeadInteraction[] }>(`/admin/leads/${id}`),

  create: (data: LeadCreate) =>
    apiRequest<Lead>('/admin/leads', { method: 'POST', body: data }),

  update: (id: number, data: Partial<LeadCreate>) =>
    apiRequest<Lead>(`/admin/leads/${id}`, { method: 'PUT', body: data }),

  remove: (id: number) =>
    apiRequest<void>(`/admin/leads/${id}`, { method: 'DELETE' }),

  addInteraction: (leadId: number, data: LeadInteractionCreate) =>
    apiRequest<LeadInteraction>(`/admin/leads/${leadId}/interactions`, { method: 'POST', body: data }),

  getOverdue: () =>
    apiRequest<Lead[]>('/admin/leads/overdue'),

  exportCsv: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/admin/leads/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Export failed');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importLeads: (leads: LeadCreate[]) =>
    apiRequest<Lead[]>('/admin/leads/import', { method: 'POST', body: leads }),
};

// --- Audit Log ---

export const adminAuditService = {
  list: (adminUserId: string = '', action: string = '', entityType: string = '', page: number = 0, size: number = 20) =>
    apiRequest<PageResponse<AuditLogEntry>>(`/admin/audit?adminUserId=${adminUserId}&action=${action}&entityType=${entityType}&page=${page}&size=${size}`),

  get: (id: number) =>
    apiRequest<AuditLogEntry>(`/admin/audit/${id}`),

  getEntityTrail: (entityType: string, entityId: number) =>
    apiRequest<AuditLogEntry[]>(`/admin/audit/entity/${entityType}/${entityId}`),
};
