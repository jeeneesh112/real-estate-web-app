import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface Tower {
  id: string;
  project_id: string;
  name: string;
  image_id: string | null;
  floors: number;
  units_per_floor: number; // Number of units on each floor
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
  // Riverfront Heights (proj-ahm-001)
  {
    id: 'tower-ahm-001-a',
    project_id: 'proj-ahm-001',
    name: 'Riverfront Tower A',
    image_id: 'img-riverfront-tower-a',
    floors: 28,
    units_per_floor: 4,
    created_at: '2025-01-10T10:30:00Z',
    modified_at: '2025-01-10T10:30:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'tower-ahm-001-b',
    project_id: 'proj-ahm-001',
    name: 'Riverfront Tower B',
    image_id: 'img-riverfront-tower-b',
    floors: 32,
    units_per_floor: 4,
    created_at: '2025-01-10T10:30:00Z',
    modified_at: '2025-01-10T10:30:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },

  // Shantigram Residency (proj-ahm-002)
  {
    id: 'tower-ahm-002-a',
    project_id: 'proj-ahm-002',
    name: 'Shantigram Tower A',
    image_id: 'img-shantigram-tower-a',
    floors: 22,
    units_per_floor: 4,
    created_at: '2025-01-25T11:30:00Z',
    modified_at: '2025-01-25T11:30:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'tower-ahm-002-b',
    project_id: 'proj-ahm-002',
    name: 'Shantigram Tower B',
    image_id: 'img-shantigram-tower-b',
    floors: 24,
    units_per_floor: 4,
    created_at: '2025-01-25T11:30:00Z',
    modified_at: '2025-01-25T11:30:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },

  // Skyline Avenue (proj-ahm-003)
  {
    id: 'tower-ahm-003-a',
    project_id: 'proj-ahm-003',
    name: 'Skyline Tower',
    image_id: 'img-skyline-tower',
    floors: 30,
    units_per_floor: 3,
    created_at: '2025-02-10T10:00:00Z',
    modified_at: '2025-02-10T10:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },

  // Westend Living (proj-ahm-004)
  {
    id: 'tower-ahm-004-a',
    project_id: 'proj-ahm-004',
    name: 'Westend Block A',
    image_id: 'img-westend-block-a',
    floors: 18,
    units_per_floor: 4,
    created_at: '2025-02-28T14:30:00Z',
    modified_at: '2025-02-28T14:30:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'tower-ahm-004-b',
    project_id: 'proj-ahm-004',
    name: 'Westend Block B',
    image_id: 'img-westend-block-b',
    floors: 20,
    units_per_floor: 4,
    created_at: '2025-02-28T14:30:00Z',
    modified_at: '2025-02-28T14:30:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },

  // Central Park Homes (proj-ahm-005)
  {
    id: 'tower-ahm-005-a',
    project_id: 'proj-ahm-005',
    name: 'Central Park Tower',
    image_id: 'img-centralpark-tower',
    floors: 26,
    units_per_floor: 4,
    created_at: '2025-05-05T09:30:00Z',
    modified_at: '2025-05-05T09:30:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },

  // Capital Greens (proj-gnd-001)
  {
    id: 'tower-gnd-001-a',
    project_id: 'proj-gnd-001',
    name: 'Capital Tower A',
    image_id: 'img-capital-tower-a',
    floors: 24,
    units_per_floor: 4,
    created_at: '2025-03-12T10:00:00Z',
    modified_at: '2025-03-12T10:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'tower-gnd-001-b',
    project_id: 'proj-gnd-001',
    name: 'Capital Tower B',
    image_id: 'img-capital-tower-b',
    floors: 26,
    units_per_floor: 4,
    created_at: '2025-03-12T10:00:00Z',
    modified_at: '2025-03-12T10:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },

  // Heritage Enclave (proj-gnd-002)
  {
    id: 'tower-gnd-002-a',
    project_id: 'proj-gnd-002',
    name: 'Heritage Tower',
    image_id: 'img-heritage-tower',
    floors: 20,
    units_per_floor: 4,
    created_at: '2025-04-05T11:45:00Z',
    modified_at: '2025-04-05T11:45:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },

  // Palm Meadows (proj-gnd-003)
  {
    id: 'tower-gnd-003-a',
    project_id: 'proj-gnd-003',
    name: 'Palm Block A',
    image_id: 'img-palm-block-a',
    floors: 16,
    units_per_floor: 4,
    created_at: '2025-04-18T11:00:00Z',
    modified_at: '2025-04-18T11:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },

  // City View Residency (proj-gnd-004)
  {
    id: 'tower-gnd-004-a',
    project_id: 'proj-gnd-004',
    name: 'City View Tower',
    image_id: 'img-cityview-tower',
    floors: 22,
    units_per_floor: 4,
    created_at: '2025-05-20T11:30:00Z',
    modified_at: '2025-05-20T11:30:00Z',
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
    addTower: (state, action: PayloadAction<Omit<Tower, 'id' | 'created_at' | 'modified_at' | 'deleted_at'>>) => {
      const nextNum = state.towers.length + 1;
      const newId = `tower-${String(nextNum).padStart(3, '0')}`;
      const now = new Date().toISOString();
      state.towers.push({
        id: newId,
        created_at: now,
        modified_at: now,
        deleted_at: null,
        ...action.payload,
      });
    },
  },
});

export const { setTowers, addTower } = towerSlice.actions;
export default towerSlice.reducer;

// Export mock data for other slices (e.g., flats)
export { mockTowers };

// Selectors
export const getTowersByProjectId = (state: RootState, projectId: string): Tower[] => {
  return state.tower.towers.filter((tower) => tower.project_id === projectId);
};

export const getTowerById = (state: RootState, towerId: string) => {
  return state.tower.towers.find((tower) => tower.id === towerId);
};

// Export types
export type { Tower };
