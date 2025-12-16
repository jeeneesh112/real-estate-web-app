import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface Room {
  id: string;
  flat_id: string;
  name: string; // e.g., "Bedroom", "Living Room", "Kitchen"
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
  created_by: string;
}

interface Panorama {
  id: string;
  room_id: string;
  image_id: string;
  order_index: number;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
  created_by: string;
}

interface TourState {
  rooms: Room[];
  panoramas: Panorama[];
  currentPanoramaId: string | null;
}

// Mock data - rooms for flat-001
const mockRooms: Room[] = [
  {
    id: 'room-001',
    flat_id: 'flat-001',
    name: 'Living Room',
    created_at: '2025-01-15T10:40:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'room-002',
    flat_id: 'flat-001',
    name: 'Master Bedroom',
    created_at: '2025-01-15T10:40:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'room-003',
    flat_id: 'flat-001',
    name: 'Kitchen',
    created_at: '2025-01-15T10:40:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'room-004',
    flat_id: 'flat-001',
    name: 'Bedroom 2',
    created_at: '2025-01-15T10:40:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'room-005',
    flat_id: 'flat-001',
    name: 'Bathroom',
    created_at: '2025-01-15T10:40:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
];

// Mock panoramas - 360 images for each room sorted by order_index
const mockPanoramas: Panorama[] = [
  // Living Room panoramas
  {
    id: 'pano-001',
    room_id: 'room-001',
    image_id: 'pano-img-living-001',
    order_index: 0,
    created_at: '2025-01-15T10:40:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'pano-002',
    room_id: 'room-001',
    image_id: 'pano-img-living-002',
    order_index: 1,
    created_at: '2025-01-15T10:40:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // Master Bedroom panoramas
  {
    id: 'pano-003',
    room_id: 'room-002',
    image_id: 'pano-img-master-001',
    order_index: 0,
    created_at: '2025-01-15T10:40:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'pano-004',
    room_id: 'room-002',
    image_id: 'pano-img-master-002',
    order_index: 1,
    created_at: '2025-01-15T10:40:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // Kitchen panoramas
  {
    id: 'pano-005',
    room_id: 'room-003',
    image_id: 'pano-img-kitchen-001',
    order_index: 0,
    created_at: '2025-01-15T10:40:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // Bedroom 2 panoramas
  {
    id: 'pano-006',
    room_id: 'room-004',
    image_id: 'pano-img-bed2-001',
    order_index: 0,
    created_at: '2025-01-15T10:40:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  // Bathroom panoramas
  {
    id: 'pano-007',
    room_id: 'room-005',
    image_id: 'pano-img-bath-001',
    order_index: 0,
    created_at: '2025-01-15T10:40:00Z',
    modified_at: '2025-12-17T08:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
];

const initialState: TourState = {
  rooms: mockRooms,
  panoramas: mockPanoramas.sort((a, b) => a.order_index - b.order_index),
  currentPanoramaId: null,
};

const tourSlice = createSlice({
  name: 'tour',
  initialState,
  reducers: {
    setCurrentPanorama: (state, action: PayloadAction<string | null>) => {
      state.currentPanoramaId = action.payload;
    },
    resetTour: (state) => {
      state.currentPanoramaId = null;
    },
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    setPanoramas: (state, action: PayloadAction<Panorama[]>) => {
      // Ensure panoramas are sorted by order_index
      state.panoramas = action.payload.sort((a, b) => a.order_index - b.order_index);
    },
  },
});

export const { setCurrentPanorama, resetTour, setRooms, setPanoramas } = tourSlice.actions;
export default tourSlice.reducer;

// Selectors
export const getPanoramasByRoomId = (state: RootState, roomId: string): Panorama[] => {
  return state.tour.panoramas
    .filter((pano) => pano.room_id === roomId)
    .sort((a, b) => a.order_index - b.order_index);
};

export const getRoomsByFlatId = (state: RootState, flatId: string): Room[] => {
  return state.tour.rooms.filter((room) => room.flat_id === flatId);
};

export const getCurrentPanorama = (state: RootState): Panorama | undefined => {
  return state.tour.panoramas.find((pano) => pano.id === state.tour.currentPanoramaId);
};

// Export types
export type { Room, Panorama };
