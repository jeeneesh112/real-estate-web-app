import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface Flat {
  id: string;
  tower_id: string;
  flat_type: string; // e.g., "1BHK", "2BHK", "3BHK", "4BHK"
  size_sqft: number;
  price: number | null;
  rent: number | null;
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

// Mock data linked to towers
const mockFlats: Flat[] = [
  // Tower A (tower-001) - Skyline Residency
  {
    id: 'flat-001',
    tower_id: 'tower-001',
    flat_type: '2BHK',
    size_sqft: 1050,
    price: 5500000,
    rent: null,
    gallery_json: ['img-flat-001-1', 'img-flat-001-2', 'img-flat-001-3'],
    created_at: '2025-01-15T10:35:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'flat-002',
    tower_id: 'tower-001',
    flat_type: '3BHK',
    size_sqft: 1450,
    price: 7200000,
    rent: null,
    gallery_json: ['img-flat-002-1', 'img-flat-002-2', 'img-flat-002-3', 'img-flat-002-4'],
    created_at: '2025-01-15T10:35:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'flat-003',
    tower_id: 'tower-001',
    flat_type: '4BHK',
    size_sqft: 2100,
    price: 10500000,
    rent: null,
    gallery_json: ['img-flat-003-1', 'img-flat-003-2', 'img-flat-003-3'],
    created_at: '2025-01-15T10:35:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // Tower B (tower-002) - Skyline Residency
  {
    id: 'flat-004',
    tower_id: 'tower-002',
    flat_type: '2BHK',
    size_sqft: 1000,
    price: 5200000,
    rent: null,
    gallery_json: ['img-flat-004-1', 'img-flat-004-2'],
    created_at: '2025-01-15T10:35:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'flat-005',
    tower_id: 'tower-002',
    flat_type: '3BHK',
    size_sqft: 1400,
    price: 6900000,
    rent: null,
    gallery_json: ['img-flat-005-1', 'img-flat-005-2', 'img-flat-005-3'],
    created_at: '2025-01-15T10:35:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // North Wing (tower-004) - Green Valley Apartments - RENT
  {
    id: 'flat-006',
    tower_id: 'tower-004',
    flat_type: '1BHK',
    size_sqft: 650,
    price: null,
    rent: 18000,
    gallery_json: ['img-flat-006-1', 'img-flat-006-2', 'img-flat-006-3'],
    created_at: '2025-02-10T14:35:00Z',
    modified_at: '2025-12-16T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'flat-007',
    tower_id: 'tower-004',
    flat_type: '2BHK',
    size_sqft: 950,
    price: null,
    rent: 28000,
    gallery_json: ['img-flat-007-1', 'img-flat-007-2', 'img-flat-007-3', 'img-flat-007-4'],
    created_at: '2025-02-10T14:35:00Z',
    modified_at: '2025-12-16T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // South Wing (tower-005) - Green Valley Apartments - RENT
  {
    id: 'flat-008',
    tower_id: 'tower-005',
    flat_type: '1BHK',
    size_sqft: 700,
    price: null,
    rent: 16500,
    gallery_json: ['img-flat-008-1', 'img-flat-008-2'],
    created_at: '2025-02-10T14:35:00Z',
    modified_at: '2025-12-16T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'flat-009',
    tower_id: 'tower-005',
    flat_type: '2BHK',
    size_sqft: 1000,
    price: null,
    rent: 30000,
    gallery_json: ['img-flat-009-1', 'img-flat-009-2', 'img-flat-009-3'],
    created_at: '2025-02-10T14:35:00Z',
    modified_at: '2025-12-16T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // Commercial Tower (tower-006) - Tech Park Plaza
  {
    id: 'flat-010',
    tower_id: 'tower-006',
    flat_type: 'STUDIO',
    size_sqft: 400,
    price: 3200000,
    rent: null,
    gallery_json: ['img-flat-010-1', 'img-flat-010-2'],
    created_at: '2025-03-20T09:00:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'flat-011',
    tower_id: 'tower-006',
    flat_type: '1BHK',
    size_sqft: 600,
    price: 4500000,
    rent: null,
    gallery_json: ['img-flat-011-1', 'img-flat-011-2', 'img-flat-011-3'],
    created_at: '2025-03-20T09:00:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // Residential Tower (tower-007) - Tech Park Plaza
  {
    id: 'flat-012',
    tower_id: 'tower-007',
    flat_type: '2BHK',
    size_sqft: 1100,
    price: 6000000,
    rent: null,
    gallery_json: ['img-flat-012-1', 'img-flat-012-2', 'img-flat-012-3'],
    created_at: '2025-03-20T09:00:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // Flats available for BOTH rent and sale
  {
    id: 'flat-013',
    tower_id: 'tower-001',
    flat_type: '2BHK',
    size_sqft: 1075,
    price: 5800000,
    rent: 22000,
    gallery_json: ['img-flat-013-1', 'img-flat-013-2'],
    created_at: '2025-04-05T11:30:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'flat-014',
    tower_id: 'tower-002',
    flat_type: '3BHK',
    size_sqft: 1500,
    price: 7500000,
    rent: 32000,
    gallery_json: ['img-flat-014-1', 'img-flat-014-2', 'img-flat-014-3'],
    created_at: '2025-04-10T10:00:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'flat-015',
    tower_id: 'tower-004',
    flat_type: '1BHK',
    size_sqft: 680,
    price: 4200000,
    rent: 17000,
    gallery_json: ['img-flat-015-1', 'img-flat-015-2'],
    created_at: '2025-04-15T14:20:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
];

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
  },
});

export const { selectFlat, setFlats } = flatSlice.actions;
export default flatSlice.reducer;

// Selectors
export const getFlatsByTowerId = (state: RootState, towerId: string): Flat[] => {
  return state.flat.flats.filter((flat) => flat.tower_id === towerId);
};

// Export types
export type { Flat };
