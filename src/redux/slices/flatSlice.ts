import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { mockTowers } from './towerSlice';

interface Flat {
  id: string;
  tower_id: string;
  flat_type: string; // e.g., "1BHK", "2BHK", "3BHK", "4BHK"
  floor: number; // Floor number (1-based)
  size_sqft: number;
  price: number | null;
  rent: number | null;
  status: 'sold' | 'rental' | 'available'; // Status of the flat
  gallery_json: string[]; // Array of image IDs
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
  created_by: string;
}

interface FlatState {
  flats: Flat[];
  selectedFlat: Flat | null;
}

function generateFlatsForTowers(towers: Tower[]): Flat[] {
  const flats: Flat[] = [];

  let flatCounter = 1;

  for (const tower of towers) {
    for (let floor = 1; floor <= tower.floors; floor++) {
      for (let unit = 1; unit <= tower.units_per_floor; unit++) {
        const id = `flat-${String(flatCounter).padStart(5, '0')}`;

        // Decide type & pricing based on tower or project (customize if needed)
        let flat_type: Flat['flat_type'] = '2BHK';
        let size_sqft = 1050;
        let price: number | null = 5500000;
        let rent: number | null = null;

        // Example rules (you can customize)
        if (tower.name.toLowerCase().includes('palm') || tower.name.toLowerCase().includes('north')) {
          flat_type = '1BHK';
          size_sqft = 650;
          price = null;
          rent = 18000;
        } else if (tower.name.toLowerCase().includes('heritage') || tower.name.toLowerCase().includes('capital')) {
          flat_type = '3BHK';
          size_sqft = 1450;
          price = 7200000;
          rent = null;
        }

        // Random status
        const statuses: Flat['status'][] = ['available', 'sold', 'rental'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        flats.push({
          id,
          tower_id: tower.id,
          flat_type,
          floor,
          size_sqft,
          price,
          rent,
          status,
          gallery_json: [],
          created_at: '2025-01-01T00:00:00Z',
          modified_at: '2025-01-01T00:00:00Z',
          deleted_at: null,
          created_by: 'user-001',
        });

        flatCounter++;
      }
    }
  }

  return flats;
}


// Mock data linked to towers
const mockFlats: Flat[] = generateFlatsForTowers(mockTowers);


const initialState: FlatState = {
  flats: mockFlats,
  selectedFlat: null,
};

const flatSlice = createSlice({
  name: 'flat',
  initialState,
  reducers: {
    selectFlat: (state, action: PayloadAction<Flat | null>) => {
      state.selectedFlat = action.payload;
    },
    setFlats: (state, action: PayloadAction<Flat[]>) => {
      state.flats = action.payload;
    },
    addFlat: (
      state,
      action: PayloadAction<Omit<Flat, 'id' | 'created_at' | 'modified_at' | 'deleted_at' | 'gallery_json'>>
    ) => {
      const newId = `flat-${String(state.flats.length + 1).padStart(3, '0')}`;
      const now = new Date().toISOString();
      const newFlat: Flat = {
        ...action.payload,
        id: newId,
        gallery_json: [],
        created_at: now,
        modified_at: now,
        deleted_at: null,
      };
      state.flats.push(newFlat);
    },
    updateFlatStatus: (
      state,
      action: PayloadAction<{ id: string; status: 'sold' | 'rental' | 'available' }>
    ) => {
      const flat = state.flats.find((f) => f.id === action.payload.id);
      if (flat) {
        flat.status = action.payload.status;
        flat.modified_at = new Date().toISOString();
      }
    },
  },
});

export const { selectFlat, setFlats, addFlat, updateFlatStatus } = flatSlice.actions;
export default flatSlice.reducer;

// Selectors
export const getFlatsByTowerId = (state: RootState, towerId: string): Flat[] => {
  return state.flat.flats.filter((flat) => flat.tower_id === towerId);
};

export const getFlatById = (state: RootState, flatId: string) => {
  return state.flat.flats.find((flat) => flat.id === flatId);
};

// Export types
export type { Flat };
