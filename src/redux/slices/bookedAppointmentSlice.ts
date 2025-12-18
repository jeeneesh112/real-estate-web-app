import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Booking status type
type BookingStatus = 'PENDING' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

// Booking interface matching BOOKING table structure
export interface BookedAppointment {
  id: number;
  user_id: number;
  userName?: string; // Enriched from user data
  userEmail?: string;
  flat_id: string; // Linked to flat slice (string ID like 'flat-001')
  tower_id: string; // Linked to tower slice (string ID like 'tower-001')
  project_id: string; // Linked to project slice (string ID like 'proj-001')
  visit_date: string; // ISO date string
  status: BookingStatus;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
  created_by: string; // User ID who created the booking
}

interface BookedAppointmentState {
  appointments: BookedAppointment[];
  selectedAppointment: BookedAppointment | null;
  loading: boolean;
  error: string | null;
}

// Mock data - realistic booking appointments
const mockAppointments: BookedAppointment[] = [
  {
    id: 1,
    user_id: 1001,
    userName: 'Rahul Sharma',
    userEmail: 'rahul@example.com',
    flat_id: 'flat-002',
    tower_id: 'tower-001',
    project_id: 'proj-001',
    visit_date: '2025-12-22T10:00:00Z',
    status: 'UPCOMING',
    created_at: '2025-12-15T09:35:00Z',
    modified_at: '2025-12-16T11:20:00Z',
    deleted_at: null,
    created_by: '1001',
  },
  {
    id: 2,
    user_id: 1002,
    userName: 'Priya Patel',
    userEmail: 'priya@example.com',
    flat_id: 'flat-005',
    tower_id: 'tower-002',
    project_id: 'proj-001',
    visit_date: '2025-12-21T14:00:00Z',
    status: 'UPCOMING',
    created_at: '2025-12-15T09:45:00Z',
    modified_at: '2025-12-15T09:45:00Z',
    deleted_at: null,
    created_by: '1002',
  },
  {
    id: 3,
    user_id: 1005,
    userName: 'Vikram Singh',
    userEmail: 'vikram@example.com',
    flat_id: 'flat-003',
    tower_id: 'tower-001',
    project_id: 'proj-001',
    visit_date: '2025-12-24T11:00:00Z',
    status: 'PENDING',
    created_at: '2025-12-15T11:10:00Z',
    modified_at: '2025-12-15T11:10:00Z',
    deleted_at: null,
    created_by: '1005',
  },
  {
    id: 4,
    user_id: 1006,
    userName: 'Anjali Mehta',
    userEmail: 'anjali@example.com',
    flat_id: 'flat-003',
    tower_id: 'tower-001',
    project_id: 'proj-001',
    visit_date: '2025-12-23T15:30:00Z',
    status: 'UPCOMING',
    created_at: '2025-12-15T11:40:00Z',
    modified_at: '2025-12-17T09:15:00Z',
    deleted_at: null,
    created_by: '1006',
  },
  {
    id: 5,
    user_id: 1008,
    userName: 'Kavita Desai',
    userEmail: 'kavita@example.com',
    flat_id: 'flat-002',
    tower_id: 'tower-001',
    project_id: 'proj-001',
    visit_date: '2025-12-25T10:30:00Z',
    status: 'PENDING',
    created_at: '2025-12-16T09:40:00Z',
    modified_at: '2025-12-16T09:40:00Z',
    deleted_at: null,
    created_by: '1008',
  },
  {
    id: 6,
    user_id: 1010,
    userName: 'Pooja Joshi',
    userEmail: 'pooja@example.com',
    flat_id: 'flat-006',
    tower_id: 'tower-002',
    project_id: 'proj-001',
    visit_date: '2025-12-26T09:00:00Z',
    status: 'UPCOMING',
    created_at: '2025-12-16T10:50:00Z',
    modified_at: '2025-12-18T08:30:00Z',
    deleted_at: null,
    created_by: '1010',
  },
  {
    id: 7,
    user_id: 1011,
    userName: 'Sanjay Gupta',
    userEmail: 'sanjay@example.com',
    flat_id: 'flat-010',
    tower_id: 'tower-004',
    project_id: 'proj-002',
    visit_date: '2025-12-27T11:30:00Z',
    status: 'PENDING',
    created_at: '2025-12-16T11:35:00Z',
    modified_at: '2025-12-16T11:35:00Z',
    deleted_at: null,
    created_by: '1011',
  },
  {
    id: 8,
    user_id: 1012,
    userName: 'Neha Kapoor',
    userEmail: 'neha@example.com',
    flat_id: 'flat-003',
    tower_id: 'tower-001',
    project_id: 'proj-001',
    visit_date: '2025-12-28T14:00:00Z',
    status: 'UPCOMING',
    created_at: '2025-12-17T10:05:00Z',
    modified_at: '2025-12-18T10:20:00Z',
    deleted_at: null,
    created_by: '1012',
  },
  {
    id: 9,
    user_id: 1013,
    userName: 'Arun Malhotra',
    userEmail: 'arun@example.com',
    flat_id: 'flat-002',
    tower_id: 'tower-001',
    project_id: 'proj-001',
    visit_date: '2025-12-29T10:00:00Z',
    status: 'PENDING',
    created_at: '2025-12-17T10:50:00Z',
    modified_at: '2025-12-17T10:50:00Z',
    deleted_at: null,
    created_by: '1013',
  },
  {
    id: 10,
    user_id: 1015,
    userName: 'Kiran Rao',
    userEmail: 'kiran@example.com',
    flat_id: 'flat-006',
    tower_id: 'tower-002',
    project_id: 'proj-001',
    visit_date: '2025-12-30T11:00:00Z',
    status: 'CANCELLED',
    created_at: '2025-12-17T11:45:00Z',
    modified_at: '2025-12-18T09:00:00Z',
    deleted_at: null,
    created_by: '1015',
  },
  {
    id: 11,
    user_id: 1017,
    userName: 'Nikhil Bhatt',
    userEmail: 'nikhil@example.com',
    flat_id: 'flat-003',
    tower_id: 'tower-001',
    project_id: 'proj-001',
    visit_date: '2025-12-31T14:30:00Z',
    status: 'PENDING',
    created_at: '2025-12-18T09:10:00Z',
    modified_at: '2025-12-18T09:10:00Z',
    deleted_at: null,
    created_by: '1017',
  },
  {
    id: 12,
    user_id: 1018,
    userName: 'Ritu Agarwal',
    userEmail: 'ritu@example.com',
    flat_id: 'flat-012',
    tower_id: 'tower-004',
    project_id: 'proj-002',
    visit_date: '2026-01-02T10:30:00Z',
    status: 'UPCOMING',
    created_at: '2025-12-18T09:45:00Z',
    modified_at: '2025-12-18T15:20:00Z',
    deleted_at: null,
    created_by: '1018',
  },
  {
    id: 13,
    user_id: 1020,
    userName: 'Tanvi Kulkarni',
    userEmail: 'tanvi@example.com',
    flat_id: 'flat-019',
    tower_id: 'tower-008',
    project_id: 'proj-004',
    visit_date: '2026-01-03T15:00:00Z',
    status: 'COMPLETED',
    created_at: '2025-12-18T10:40:00Z',
    modified_at: '2025-12-19T16:30:00Z',
    deleted_at: null,
    created_by: '1020',
  },
];

const initialState: BookedAppointmentState = {
  appointments: mockAppointments,
  selectedAppointment: null,
  loading: false,
  error: null,
};

const bookedAppointmentSlice = createSlice({
  name: 'bookedAppointment',
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<BookedAppointment[]>) => {
      state.appointments = action.payload;
      state.error = null;
    },
    addAppointment: (state, action: PayloadAction<BookedAppointment>) => {
      state.appointments.unshift(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<BookedAppointment>) => {
      const index = state.appointments.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    deleteAppointment: (state, action: PayloadAction<number>) => {
      state.appointments = state.appointments.filter((a) => a.id !== action.payload);
    },
    setSelectedAppointment: (state, action: PayloadAction<BookedAppointment | null>) => {
      state.selectedAppointment = action.payload;
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
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  setSelectedAppointment,
  setLoading,
  setError,
} = bookedAppointmentSlice.actions;

export default bookedAppointmentSlice.reducer;

// Selectors
export const getAppointmentsByProjectId = (state: RootState, projectId: string): BookedAppointment[] => {
  return state.bookedAppointment.appointments.filter((appointment) => appointment.project_id === projectId);
};

export const getAppointmentsByTowerId = (state: RootState, towerId: string): BookedAppointment[] => {
  return state.bookedAppointment.appointments.filter((appointment) => appointment.tower_id === towerId);
};

export const getAppointmentsByStatus = (state: RootState, status: BookingStatus): BookedAppointment[] => {
  return state.bookedAppointment.appointments.filter((appointment) => appointment.status === status);
};
