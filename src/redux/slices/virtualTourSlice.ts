import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type VirtualTourStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface VirtualTour {
  id: string;
  user_id: string;
  project_id: string;
  start_time: string; // ISO datetime
  end_time: string; // ISO datetime
  status: VirtualTourStatus;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
  created_by: string;
}

interface VirtualTourState {
  virtualTours: VirtualTour[];
}

const mockVirtualTours: VirtualTour[] = [
  {
    id: 'vt-001',
    user_id: 'user-001',
    project_id: 'proj-ahm-001', // Riverfront Heights
    start_time: '2025-12-22T10:00:00Z',
    end_time: '2025-12-22T10:30:00Z',
    status: 'IN_PROGRESS',
    created_at: '2025-12-15T10:00:00Z',
    modified_at: '2025-12-18T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'vt-002',
    user_id: 'user-002',
    project_id: 'proj-ahm-002', // Shantigram Residency
    start_time: '2025-12-18T14:00:00Z',
    end_time: '2025-12-18T14:45:00Z',
    status: 'COMPLETED',
    created_at: '2025-12-05T09:00:00Z',
    modified_at: '2025-12-18T15:00:00Z',
    deleted_at: null,
    created_by: 'user-002',
  },
  {
    id: 'vt-003',
    user_id: 'user-003',
    project_id: 'proj-ahm-003', // Skyline Avenue
    start_time: '2025-12-25T11:00:00Z',
    end_time: '2025-12-25T11:30:00Z',
    status: 'IN_PROGRESS',
    created_at: '2025-12-12T15:30:00Z',
    modified_at: '2025-12-17T14:00:00Z',
    deleted_at: null,
    created_by: 'user-003',
  },
  {
    id: 'vt-004',
    user_id: 'user-004',
    project_id: 'proj-ahm-004', // Westend Living
    start_time: '2025-12-20T09:00:00Z',
    end_time: '2025-12-20T09:45:00Z',
    status: 'COMPLETED',
    created_at: '2025-11-28T11:45:00Z',
    modified_at: '2025-12-20T09:15:00Z',
    deleted_at: null,
    created_by: 'user-004',
  },
  {
    id: 'vt-005',
    user_id: 'user-005',
    project_id: 'proj-ahm-005', // Central Park Homes
    start_time: '2025-12-10T16:00:00Z',
    end_time: '2025-12-10T16:30:00Z',
    status: 'COMPLETED',
    created_at: '2025-11-25T10:20:00Z',
    modified_at: '2025-12-10T16:45:00Z',
    deleted_at: null,
    created_by: 'user-005',
  },
  {
    id: 'vt-006',
    user_id: 'user-001',
    project_id: 'proj-gnd-003', // Palm Meadows (Gandhinagar)
    start_time: '2025-12-05T13:00:00Z',
    end_time: '2025-12-05T13:30:00Z',
    status: 'COMPLETED',
    created_at: '2025-11-20T14:20:00Z',
    modified_at: '2025-12-04T18:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
];



const initialState: VirtualTourState = {
  virtualTours: mockVirtualTours,
};

const virtualTourSlice = createSlice({
  name: 'virtualTour',
  initialState,
  reducers: {
    setVirtualTours: (state, action: PayloadAction<VirtualTour[]>) => {
      state.virtualTours = action.payload;
    },
    startVirtualTour: (
      state,
      action: PayloadAction<{ id: string; user_id: string; project_id: string; startedAtISO: string }>
    ) => {
      const { id, user_id, project_id, startedAtISO } = action.payload;
      state.virtualTours.push({
        id,
        user_id,
        project_id,
        start_time: startedAtISO,
        end_time: startedAtISO,
        status: 'IN_PROGRESS',
        created_at: startedAtISO,
        modified_at: startedAtISO,
        deleted_at: null,
        created_by: user_id,
      });
    },
    endVirtualTour: (
      state,
      action: PayloadAction<{ id: string; endedAtISO: string }>
    ) => {
      const { id, endedAtISO } = action.payload;
      const tour = state.virtualTours.find((t) => t.id === id);
      if (tour) {
        tour.end_time = endedAtISO;
        tour.status = 'COMPLETED';
        tour.modified_at = endedAtISO;
      }
    },
  },
});

export const { setVirtualTours, startVirtualTour, endVirtualTour } = virtualTourSlice.actions;
export default virtualTourSlice.reducer;

export const selectVirtualTours = (state: RootState) => state.virtualTour.virtualTours;
