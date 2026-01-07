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
    flat_id: 'flat-001',
    tower_id: 'tower-ahm-001-a',
    project_id: 'proj-ahm-001', // Riverfront Heights
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
    flat_id: 'flat-003',
    tower_id: 'tower-ahm-002-a',
    project_id: 'proj-ahm-002', // Shantigram Residency
    visit_date: '2025-12-21T14:00:00Z',
    status: 'UPCOMING',
    created_at: '2025-12-15T09:45:00Z',
    modified_at: '2025-12-15T09:45:00Z',
    deleted_at: null,
    created_by: '1002',
  },
  {
    id: 3,
    user_id: 1003,
    userName: 'Vikram Singh',
    userEmail: 'vikram@example.com',
    flat_id: 'flat-002',
    tower_id: 'tower-ahm-003-a',
    project_id: 'proj-ahm-003', // Skyline Avenue
    visit_date: '2025-12-24T11:00:00Z',
    status: 'COMPLETED',
    created_at: '2025-12-15T11:10:00Z',
    modified_at: '2025-12-15T11:10:00Z',
    deleted_at: null,
    created_by: '1003',
  },
  {
    id: 4,
    user_id: 1004,
    userName: 'Anjali Mehta',
    userEmail: 'anjali@example.com',
    flat_id: 'flat-004',
    tower_id: 'tower-ahm-004-b',
    project_id: 'proj-ahm-004', // Westend Living
    visit_date: '2025-12-23T15:30:00Z',
    status: 'UPCOMING',
    created_at: '2025-12-15T11:40:00Z',
    modified_at: '2025-12-17T09:15:00Z',
    deleted_at: null,
    created_by: '1004',
  },
  {
    id: 5,
    user_id: 1005,
    userName: 'Kavita Desai',
    userEmail: 'kavita@example.com',
    flat_id: 'flat-005',
    tower_id: 'tower-gnd-001-a',
    project_id: 'proj-gnd-001', // Capital Greens
    visit_date: '2025-12-25T10:30:00Z',
    status: 'COMPLETED',
    created_at: '2025-12-16T09:40:00Z',
    modified_at: '2025-12-16T09:40:00Z',
    deleted_at: null,
    created_by: '1005',
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
