// Admin portal types

// --- Dashboard ---

export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalOwners: number;
  totalSuppliers: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  activeOwners: number;
  activeSuppliers: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface BookingBreakdown {
  status: string;
  count: number;
}

export interface ActivityEntry {
  id: string;
  adminUserId: number;
  action: string;
  entityType: string;
  entityId: number;
  summary: string;
  createdAt: string;
}

// --- Users ---

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  isOwner: boolean;
  isSupplier: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface AdminUserUpdate {
  name?: string;
  isOwner?: boolean;
  isSupplier?: boolean;
  isAdmin?: boolean;
}

// --- Bookings ---

export interface AdminBooking {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  lotId: number;
  lotName: string;
  ownerName: string;
  ownerId: number;
  checkInDate: string;
  checkOutDate: string;
  numGuests: number;
  totalPrice: number;
  serviceFee: number | null;
  chargeTotal: number | null;
  status: string;
  paymentStatus: string;
  bookingSource: string;
  specialRequests: string | null;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  refundAmount: number | null;
  createdAt: string;
}

// --- Owners ---

export interface AdminOwner {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  propertyName: string;
  county: string;
  town: string | null;
  propertyType: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  subscriptionStatus: string;
  rating: number | null;
  reviewCount: number;
  lotCount: number;
  isFeatured: boolean;
  isDeactivated: boolean;
  createdAt: string;
}

export interface AdminOwnerUpdate {
  propertyName?: string;
  county?: string;
  town?: string;
  propertyType?: string;
  description?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
}

export interface AdminOwnerCreate {
  userId: number;
  propertyName: string;
  county: string;
  town?: string;
  propertyType: string;
  description?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
}

// --- Suppliers ---

export interface AdminSupplier {
  id: number;
  userId: number;
  userEmail: string;
  userName: string;
  businessName: string;
  category: string;
  county: string;
  town: string | null;
  address: string | null;
  description: string | null;
  phone: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  subscriptionStatus: string;
  isVerified: boolean;
  isDeactivated: boolean;
  isFeatured: boolean;
  rating: number | null;
  reviewCount: number;
  offerCount: number;
  createdAt: string;
}

export interface AdminSupplierUpdate {
  businessName?: string;
  county?: string;
  town?: string;
  address?: string;
  category?: string;
  description?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
}

export interface AdminSupplierCreate {
  userId: number;
  businessName: string;
  county: string;
  town?: string;
  address?: string;
  category: string;
  description?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
}

// --- Reviews ---

export interface AdminReview {
  id: number;
  type: 'OWNER' | 'SUPPLIER';
  userId: number;
  userName: string;
  targetId: number;
  targetName: string;
  rating: number;
  comment: string;
  response: string | null;
  isFlagged: boolean;
  moderationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  moderationReason: string | null;
  createdAt: string;
}

// --- Subscriptions ---

export interface SubscriptionOverview {
  ownerCounts: Record<string, number>;
  supplierCounts: Record<string, number>;
}

export interface SubscriptionEntry {
  id: number;
  entityType: 'OWNER' | 'SUPPLIER';
  name: string;
  email: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isTrialing: boolean;
  trialDaysRemaining: number | null;
  createdAt: string;
}

// --- Financial ---

export interface FinancialDataPoint {
  label: string;
  value: number;
}

export interface PerOwnerRevenue {
  ownerId: number;
  ownerName: string;
  propertyName: string;
  revenue: number;
  bookingCount: number;
  serviceFees: number;
}

// --- Leads CRM ---

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type LeadBusinessType = 'OWNER' | 'SUPPLIER';
export type InteractionType = 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE';

export interface Lead {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  businessType: LeadBusinessType;
  status: LeadStatus;
  source: string | null;
  notes: string | null;
  assignedTo: number | null;
  tags: string | null;
  score: number;
  scheduledFollowUp: string | null;
  convertedUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadCreate {
  name: string;
  email?: string;
  phone?: string;
  businessType: LeadBusinessType;
  status?: LeadStatus;
  source?: string;
  notes?: string;
  assignedTo?: number;
  tags?: string;
  scheduledFollowUp?: string;
}

export interface LeadInteraction {
  id: number;
  leadId: number;
  type: InteractionType;
  content: string;
  createdBy: number | null;
  createdAt: string;
}

export interface LeadInteractionCreate {
  type: InteractionType;
  content: string;
}

// --- Audit Log ---

export interface AuditLogEntry {
  id: number;
  adminUserId: number;
  action: string;
  entityType: string;
  entityId: number | null;
  summary: string | null;
  details: string | null;
  previousValue: string | null;
  newValue: string | null;
  createdAt: string;
}

// --- Paginated Response ---

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
