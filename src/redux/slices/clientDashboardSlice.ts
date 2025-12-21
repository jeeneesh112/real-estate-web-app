import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Dashboard KPI Interface
export interface DashboardKPI {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  change: number; // percentage change
  changeType: 'increase' | 'decrease'; // for color coding
  icon: string;
  color: string;
}

// Recent Activity Interface
export interface RecentActivity {
  id: number;
  type: 'appointment' | 'inquiry' | 'tour' | 'booking' | 'message';
  title: string;
  description: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled';
  projectName?: string;
}

// Top Performer Interface
export interface TopPerformer {
  id: number;
  name: string;
  role: string;
  appointmentCount: number;
  inquiryCount: number;
  conversionRate: number;
  avatar?: string;
  email: string;
}

// Top Inquiry Interface
export interface TopInquiry {
  id: number;
  clientName: string;
  clientEmail: string;
  projectName: string;
  flatType: string;
  inquiryDate: string;
  status: 'pending' | 'contacted' | 'site-visit' | 'interested' | 'not-interested';
  priority: 'high' | 'medium' | 'low';
}

// Appointment Interface
export interface Appointment {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectName: string;
  flatType: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
}

// Property Performance Interface
export interface PropertyPerformance {
  id: string;
  projectName: string;
  views: number;
  inquiries: number;
  appointments: number;
  conversionRate: number;
  status: 'high' | 'medium' | 'low';
}

// Monthly Sales Interface
export interface MonthlySale {
  month: string;
  inquiries: number;
  appointments: number;
  bookings: number;
}

interface ClientDashboardState {
  kpis: DashboardKPI[];
  recentActivities: RecentActivity[];
  topPerformers: TopPerformer[];
  propertyPerformance: PropertyPerformance[];
  monthlySales: MonthlySale[];
  topInquiries: TopInquiry[];
  upcomingAppointments: Appointment[];
  loading: boolean;
  error: string | null;
}

// Mock KPI data
const mockKPIs: DashboardKPI[] = [
  {
    id: 'kpi-1',
    label: 'Total Inquiries',
    value: 1250,
    unit: 'this month',
    change: 12.5,
    changeType: 'increase',
    icon: 'MessageSquare',
    color: '#667eea',
  },
  {
    id: 'kpi-2',
    label: 'Pending Appointments',
    value: 45,
    unit: 'this week',
    change: 8.3,
    changeType: 'increase',
    icon: 'Calendar',
    color: '#f093fb',
  },
  {
    id: 'kpi-3',
    label: 'Conversion Rate',
    value: '28.5%',
    unit: 'avg',
    change: 3.2,
    changeType: 'increase',
    icon: 'TrendingUp',
    color: '#4facfe',
  },
  {
    id: 'kpi-4',
    label: 'Revenue Generated',
    value: '₹2.5Cr',
    unit: 'this quarter',
    change: 15.8,
    changeType: 'increase',
    icon: 'DollarSign',
    color: '#43e97b',
  },
];

// Mock Recent Activities
const mockRecentActivities: RecentActivity[] = [
  {
    id: 1,
    type: 'appointment',
    title: 'Appointment Scheduled',
    description: 'Rahul Sharma scheduled for Skyline Residency tour',
    userName: 'Rahul Sharma',
    userEmail: 'rahul@example.com',
    timestamp: '2025-12-19T14:30:00Z',
    status: 'pending',
    projectName: 'Skyline Residency',
  },
  {
    id: 2,
    type: 'inquiry',
    title: 'New Inquiry Received',
    description: '3BHK flat inquiry in Green Valley Apartments',
    userName: 'Priya Patel',
    userEmail: 'priya@example.com',
    timestamp: '2025-12-19T13:15:00Z',
    status: 'pending',
    projectName: 'Green Valley Apartments',
  },
  {
    id: 3,
    type: 'tour',
    title: 'Virtual Tour Completed',
    description: '25 min tour of Tech Park Plaza completed',
    userName: 'Vikram Singh',
    userEmail: 'vikram@example.com',
    timestamp: '2025-12-19T11:45:00Z',
    status: 'completed',
    projectName: 'Tech Park Plaza',
  },
  {
    id: 4,
    type: 'booking',
    title: 'Booking Confirmed',
    description: 'Anjali Mehta confirmed booking for 4BHK Skyline Tower A',
    userName: 'Anjali Mehta',
    userEmail: 'anjali@example.com',
    timestamp: '2025-12-19T09:20:00Z',
    status: 'completed',
    projectName: 'Skyline Residency',
  },
  {
    id: 5,
    type: 'message',
    title: 'Client Message',
    description: 'Follow-up message received from Kavita Desai',
    userName: 'Kavita Desai',
    userEmail: 'kavita@example.com',
    timestamp: '2025-12-19T08:00:00Z',
    status: 'pending',
  },
];

// Mock Property Performance
const mockPropertyPerformance: PropertyPerformance[] = [
  {
    id: 'proj-001',
    projectName: 'Skyline Residency',
    views: 2450,
    inquiries: 156,
    appointments: 78,
    conversionRate: 50,
    status: 'high',
  },
  {
    id: 'proj-002',
    projectName: 'Green Valley Apartments',
    views: 1890,
    inquiries: 98,
    appointments: 42,
    conversionRate: 42.9,
    status: 'high',
  },
  {
    id: 'proj-003',
    projectName: 'Tech Park Plaza',
    views: 1650,
    inquiries: 74,
    appointments: 28,
    conversionRate: 37.8,
    status: 'medium',
  },
  {
    id: 'proj-004',
    projectName: 'Heritage Heights',
    views: 980,
    inquiries: 45,
    appointments: 15,
    conversionRate: 33.3,
    status: 'medium',
  },
  {
    id: 'proj-005',
    projectName: 'Oceanfront Villas',
    views: 650,
    inquiries: 28,
    appointments: 8,
    conversionRate: 28.6,
    status: 'low',
  },
];

// Mock Monthly Sales
const mockMonthlySales: MonthlySale[] = [
  { month: 'Jan', inquiries: 156, appointments: 78, bookings: 28 },
  { month: 'Feb', inquiries: 178, appointments: 85, bookings: 32 },
  { month: 'Mar', inquiries: 142, appointments: 65, bookings: 24 },
  { month: 'Apr', inquiries: 198, appointments: 92, bookings: 38 },
  { month: 'May', inquiries: 215, appointments: 105, bookings: 42 },
  { month: 'Jun', inquiries: 189, appointments: 88, bookings: 35 },
];

// Mock Top Inquiries
const mockTopInquiries: TopInquiry[] = [
  {
    id: 1,
    clientName: 'Rahul Verma',
    clientEmail: 'rahul.v@email.com',
    projectName: 'Skyline Residency',
    flatType: '3BHK',
    inquiryDate: '2025-12-19T10:30:00Z',
    status: 'site-visit',
    priority: 'high',
  },
  {
    id: 2,
    clientName: 'Neha Sharma',
    clientEmail: 'neha.s@email.com',
    projectName: 'Green Valley Apartments',
    flatType: '2BHK',
    inquiryDate: '2025-12-18T14:15:00Z',
    status: 'interested',
    priority: 'high',
  },
  {
    id: 3,
    clientName: 'Amit Patel',
    clientEmail: 'amit.p@email.com',
    projectName: 'Tech Park Plaza',
    flatType: '1BHK',
    inquiryDate: '2025-12-17T09:45:00Z',
    status: 'contacted',
    priority: 'medium',
  },
  {
    id: 4,
    clientName: 'Priya Singh',
    clientEmail: 'priya.s@email.com',
    projectName: 'Heritage Heights',
    flatType: '4BHK',
    inquiryDate: '2025-12-16T16:20:00Z',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 5,
    clientName: 'Vikram Desai',
    clientEmail: 'vikram.d@email.com',
    projectName: 'Oceanfront Villas',
    flatType: '3BHK',
    inquiryDate: '2025-12-15T11:00:00Z',
    status: 'not-interested',
    priority: 'low',
  },
];

// Mock Upcoming Appointments data
const mockUpcomingAppointments: Appointment[] = [
  {
    id: 1,
    clientName: 'Alice Johnson',
    clientEmail: 'alice.j@email.com',
    clientPhone: '+91-9876543210',
    projectName: 'Skyline Residency',
    flatType: '3BHK',
    appointmentDate: '2025-12-22',
    appointmentTime: '10:00 AM',
    status: 'UPCOMING',
    notes: 'Customer wants to see north-facing units',
  },
  {
    id: 2,
    clientName: 'Bob Smith',
    clientEmail: 'bob.smith@email.com',
    clientPhone: '+91-8765432109',
    projectName: 'Green Valley Apartments',
    flatType: '2BHK',
    appointmentDate: '2025-12-23',
    appointmentTime: '2:30 PM',
    status: 'UPCOMING',
    notes: 'Site visit scheduled',
  },
  {
    id: 3,
    clientName: 'Carol White',
    clientEmail: 'carol.w@email.com',
    clientPhone: '+91-7654321098',
    projectName: 'Tech Park Plaza',
    flatType: '4BHK',
    appointmentDate: '2025-12-24',
    appointmentTime: '11:00 AM',
    status: 'UPCOMING',
    notes: 'First time visitor',
  },
  {
    id: 4,
    clientName: 'David Brown',
    clientEmail: 'david.b@email.com',
    clientPhone: '+91-6543210987',
    projectName: 'Heritage Heights',
    flatType: '3BHK',
    appointmentDate: '2025-12-25',
    appointmentTime: '4:00 PM',
    status: 'UPCOMING',
    notes: 'Follow-up appointment',
  },
  {
    id: 5,
    clientName: 'Emma Davis',
    clientEmail: 'emma.d@email.com',
    clientPhone: '+91-5432109876',
    projectName: 'Skyline Residency',
    flatType: '2BHK',
    appointmentDate: '2025-12-26',
    appointmentTime: '9:30 AM',
    status: 'UPCOMING',
  },
];

const initialState: ClientDashboardState = {
  kpis: mockKPIs,
  recentActivities: mockRecentActivities,
  topPerformers: [],
  propertyPerformance: mockPropertyPerformance,
  monthlySales: mockMonthlySales,
  topInquiries: mockTopInquiries,
  upcomingAppointments: mockUpcomingAppointments,
  loading: false,
  error: null,
};

const clientDashboardSlice = createSlice({
  name: 'clientDashboard',
  initialState,
  reducers: {
    setKPIs: (state, action: PayloadAction<DashboardKPI[]>) => {
      state.kpis = action.payload;
    },
    setRecentActivities: (state, action: PayloadAction<RecentActivity[]>) => {
      state.recentActivities = action.payload;
    },
    setTopPerformers: (state, action: PayloadAction<TopPerformer[]>) => {
      state.topPerformers = action.payload;
    },
    setPropertyPerformance: (state, action: PayloadAction<PropertyPerformance[]>) => {
      state.propertyPerformance = action.payload;
    },
    setMonthlySales: (state, action: PayloadAction<MonthlySale[]>) => {
      state.monthlySales = action.payload;
    },
    setTopInquiries: (state, action: PayloadAction<TopInquiry[]>) => {
      state.topInquiries = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setKPIs,
  setRecentActivities,
  setTopPerformers,
  setPropertyPerformance,
  setMonthlySales,
  setTopInquiries,
  setLoading,
  setError,
} = clientDashboardSlice.actions;

export default clientDashboardSlice.reducer;

// Selectors
export const getKPIs = (state: RootState): DashboardKPI[] => state.clientDashboard.kpis;
export const getRecentActivities = (state: RootState): RecentActivity[] =>
  state.clientDashboard.recentActivities;
export const getTopPerformers = (state: RootState): TopPerformer[] =>
  state.clientDashboard.topPerformers;
export const getPropertyPerformance = (state: RootState): PropertyPerformance[] =>
  state.clientDashboard.propertyPerformance;
export const getMonthlySales = (state: RootState): MonthlySale[] =>
  state.clientDashboard.monthlySales;
export const getTopInquiries = (state: RootState): TopInquiry[] =>
  state.clientDashboard.topInquiries;export const getUpcomingAppointments = (state: RootState): Appointment[] =>
  state.clientDashboard.upcomingAppointments;