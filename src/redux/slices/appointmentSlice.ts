import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type AppointmentStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  user_id: string;
  project_id: string;
  visit_date: string; // ISO date
  status: AppointmentStatus;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
  created_by: string;
}

interface AppointmentState {
  appointments: Appointment[];
}

const mockAppointments: Appointment[] = [
  {
    id: 'appt-001',
    user_id: 'user-001',
    project_id: 'proj-ahm-001',
    visit_date: '2025-12-22',
    status: 'UPCOMING',
    created_at: '2025-12-15T10:00:00Z',
    modified_at: '2025-12-18T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'appt-002',
    user_id: 'user-001',
    project_id: 'proj-ahm-002',
    visit_date: '2025-12-19',
    status: 'COMPLETED',
    created_at: '2025-12-05T09:00:00Z',
    modified_at: '2025-12-19T12:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'appt-003',
    user_id: 'user-002',
    project_id: 'proj-ahm-003',
    visit_date: '2025-12-25',
    status: 'UPCOMING',
    created_at: '2025-12-12T15:30:00Z',
    modified_at: '2025-12-17T14:00:00Z',
    deleted_at: null,
    created_by: 'user-002',
  },
  {
    id: 'appt-004',
    user_id: 'user-003',
    project_id: 'proj-gnd-001',
    visit_date: '2025-12-10',
    status: 'COMPLETED',
    created_at: '2025-11-28T11:45:00Z',
    modified_at: '2025-12-10T09:15:00Z',
    deleted_at: null,
    created_by: 'user-003',
  },
  {
    id: 'appt-005',
    user_id: 'user-004',
    project_id: 'proj-gnd-003',
    visit_date: '2025-12-05',
    status: 'CANCELLED',
    created_at: '2025-11-25T10:20:00Z',
    modified_at: '2025-12-04T18:00:00Z',
    deleted_at: null,
    created_by: 'user-004',
  },
  {
    id: 'appt-006',
    user_id: 'user-001',
    project_id: 'proj-gnd-002',
    visit_date: '2025-12-28',
    status: 'UPCOMING',
    created_at: '2025-12-20T09:00:00Z',
    modified_at: '2025-12-20T09:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
];


const initialState: AppointmentState = {
  appointments: mockAppointments,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
  },
});

export const { setAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;

export const selectAppointments = (state: RootState) => state.appointment.appointments;
