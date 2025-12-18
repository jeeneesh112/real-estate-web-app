import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface Tower {
  id: string;
  project_id: string;
  name: string;
  image_id: string | null;
  floors: number;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
  created_by: string;
}

interface TowerState {
  towers: Tower[];
}

// Mock data linked to projects
const mockTowers: Tower[] = [
  // Skyline Residency (proj-001) - 3 towers
  {
    id: 'tower-001',
    project_id: 'proj-001',
    name: 'Tower A',
    image_id: 'img-tower-a-001',
    floors: 32,
    created_at: '2025-01-15T10:30:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'tower-002',
    project_id: 'proj-001',
    name: 'Tower B',
    image_id: 'img-tower-b-001',
    floors: 28,
    created_at: '2025-01-15T10:30:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'tower-003',
    project_id: 'proj-001',
    name: 'Tower C',
    image_id: 'img-tower-c-001',
    floors: 35,
    created_at: '2025-01-15T10:30:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // Green Valley Apartments (proj-002) - 2 towers
  {
    id: 'tower-004',
    project_id: 'proj-002',
    name: 'North Wing',
    image_id: 'img-tower-nw-001',
    floors: 20,
    created_at: '2025-02-10T14:30:00Z',
    modified_at: '2025-12-16T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'tower-005',
    project_id: 'proj-002',
    name: 'South Wing',
    image_id: 'img-tower-sw-001',
    floors: 18,
    created_at: '2025-02-10T14:30:00Z',
    modified_at: '2025-12-16T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // Tech Park Plaza (proj-003) - 2 towers
  {
    id: 'tower-006',
    project_id: 'proj-003',
    name: 'Commercial Tower',
    image_id: 'img-tower-comm-001',
    floors: 40,
    created_at: '2025-03-20T09:00:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'tower-007',
    project_id: 'proj-003',
    name: 'Residential Tower',
    image_id: 'img-tower-res-001',
    floors: 30,
    created_at: '2025-03-20T09:00:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // Heritage Heights (proj-004) - 1 tower
  {
    id: 'tower-008',
    project_id: 'proj-004',
    name: 'Heritage Tower',
    image_id: 'img-tower-heritage-001',
    floors: 25,
    created_at: '2025-04-05T11:20:00Z',
    modified_at: '2025-12-15T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // Oceanfront Villas (proj-005) - 1 tower (villa complex)
  {
    id: 'tower-009',
    project_id: 'proj-005',
    name: 'Villa Complex',
    image_id: 'img-tower-villa-001',
    floors: 3,
    created_at: '2025-05-12T08:00:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
];

const initialState: TowerState = {
  towers: mockTowers,
};

const towerSlice = createSlice({
  name: 'tower',
  initialState,
  reducers: {
    setTowers: (state, action: PayloadAction<Tower[]>) => {
      state.towers = action.payload;
    },
  },
});

export const { setTowers } = towerSlice.actions;
export default towerSlice.reducer;

// Selectors
export const getTowersByProjectId = (state: RootState, projectId: string): Tower[] => {
  return state.tower.towers.filter((tower) => tower.project_id === projectId);
};

export const getTowerById = (state: RootState, towerId: string) => {
  return state.tower.towers.find((tower) => tower.id === towerId);
};

// Export types
export type { Tower };
