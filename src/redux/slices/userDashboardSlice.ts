import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Dashboard types
export interface DashboardProject {
  id: string;
  client_id: string;
  name: string;
  description: string;
  type: 'BUY' | 'RENT' | 'BOTH';
  city: string;
  lat: number;
  lng: number;
  created_at: string;
  modified_at: string;
  cover_image?: string;
}

export interface DashboardAppointment {
  id: string;
  user_id: string;
  project_id: string;
  project_name: string;
  visit_date: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
}

export interface DashboardVirtualTour {
  id: string;
  user_id: string;
  project_id: string;
  project_name: string;
  start_time: string;
  end_time: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  created_at: string;
}

export interface NearbyProject {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  distance_km: number; // calculated distance
  type: 'BUY' | 'RENT' | 'BOTH';
  cover_image?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  city: string;
}

interface UserDashboardState {
  newlyAddedProjects: DashboardProject[];
  lastAppointments: DashboardAppointment[];
  lastVirtualTours: DashboardVirtualTour[];
  nearbyProjects: NearbyProject[];
  userLocation: UserLocation;
  loading: boolean;
  error: string | null;
}

// Helper function to calculate distance (Haversine formula)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

// Mock data
const mockNewlyAddedProjects: DashboardProject[] = [
  {
    id: 'proj-005',
    client_id: 'user-001',
    name: 'Oceanfront Villas',
    description: 'Exclusive beachfront villas with private beach access, infinity pools, and panoramic ocean views. Limited edition luxury living experience.',
    type: 'BUY',
    city: 'Goa',
    lat: 15.2993,
    lng: 74.1240,
    created_at: '2025-05-12T08:00:00Z',
    modified_at: '2025-12-17T07:00:00Z',
    cover_image: 'https://images.unsplash.com/photo-1512207736139-feed7a61ae5b?w=500&h=300&fit=crop',
  },
  {
    id: 'proj-004',
    client_id: 'user-001',
    name: 'Heritage Heights',
    description: 'Classic architecture meets modern living. Spacious 3 & 4 BHK apartments with high ceilings, marble flooring, and premium fittings in prime location.',
    type: 'BUY',
    city: 'Delhi',
    lat: 28.7041,
    lng: 77.1025,
    created_at: '2025-04-05T11:20:00Z',
    modified_at: '2025-12-15T16:45:00Z',
    cover_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop',
  },
  {
    id: 'proj-003',
    client_id: 'user-001',
    name: 'Tech Park Plaza',
    description: 'Premium commercial and residential spaces near IT hub. Ideal for professionals and investors. Includes co-working spaces, cafes, and retail outlets.',
    type: 'BOTH',
    city: 'Bangalore',
    lat: 12.9716,
    lng: 77.5946,
    created_at: '2025-03-20T09:00:00Z',
    modified_at: '2025-12-17T10:15:00Z',
    cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop',
  },
];

const mockUserAppointments: DashboardAppointment[] = [
  {
    id: 'appt-001',
    user_id: 'user-001',
    project_id: 'proj-001',
    project_name: 'Skyline Residency',
    visit_date: '2025-12-22',
    status: 'UPCOMING',
    created_at: '2025-12-15T10:00:00Z',
  },
  {
    id: 'appt-002',
    user_id: 'user-001',
    project_id: 'proj-002',
    project_name: 'Green Valley Apartments',
    visit_date: '2025-12-19',
    status: 'COMPLETED',
    created_at: '2025-12-05T09:00:00Z',
  },
  {
    id: 'appt-005',
    user_id: 'user-001',
    project_id: 'proj-005',
    project_name: 'Royal Estate',
    visit_date: '2025-12-18',
    status: 'COMPLETED',
    created_at: '2025-12-10T14:45:00Z',
  },
  {
    id: 'appt-006',
    user_id: 'user-001',
    project_id: 'proj-003',
    project_name: 'Tech Park Plaza',
    visit_date: '2025-12-24',
    status: 'UPCOMING',
    created_at: '2025-12-17T11:20:00Z',
  },
  {
    id: 'appt-007',
    user_id: 'user-001',
    project_id: 'proj-004',
    project_name: 'Heritage Heights',
    visit_date: '2025-12-15',
    status: 'COMPLETED',
    created_at: '2025-12-08T16:30:00Z',
  },
];

const mockUserVirtualTours: DashboardVirtualTour[] = [
  {
    id: 'vt-001',
    user_id: 'user-001',
    project_id: 'proj-001',
    project_name: 'Skyline Residency',
    start_time: '2025-12-22T10:00:00Z',
    end_time: '2025-12-22T10:30:00Z',
    status: 'IN_PROGRESS',
    created_at: '2025-12-15T10:00:00Z',
  },
  {
    id: 'vt-006',
    user_id: 'user-001',
    project_id: 'proj-003',
    project_name: 'Tech Park Plaza',
    start_time: '2025-12-05T13:00:00Z',
    end_time: '2025-12-05T13:30:00Z',
    status: 'COMPLETED',
    created_at: '2025-12-04T18:00:00Z',
  },
  {
    id: 'vt-007',
    user_id: 'user-001',
    project_id: 'proj-002',
    project_name: 'Green Valley Apartments',
    start_time: '2025-12-20T15:00:00Z',
    end_time: '2025-12-20T15:45:00Z',
    status: 'COMPLETED',
    created_at: '2025-12-12T10:30:00Z',
  },
  {
    id: 'vt-008',
    user_id: 'user-001',
    project_id: 'proj-004',
    project_name: 'Heritage Heights',
    start_time: '2025-12-17T11:00:00Z',
    end_time: '2025-12-17T11:20:00Z',
    status: 'COMPLETED',
    created_at: '2025-12-10T09:00:00Z',
  },
  {
    id: 'vt-009',
    user_id: 'user-001',
    project_id: 'proj-005',
    project_name: 'Royal Estate',
    start_time: '2025-12-16T14:00:00Z',
    end_time: '2025-12-16T14:45:00Z',
    status: 'COMPLETED',
    created_at: '2025-12-09T13:15:00Z',
  },
];

// User location (example: Mumbai)
const mockUserLocation: UserLocation = {
  lat: 19.0760,
  lng: 72.8777,
  city: 'Mumbai',
};

// All projects for calculating nearby
const allProjectsForNearby = [
  { id: 'proj-001', name: 'Skyline Residency', city: 'Mumbai', lat: 19.0760, lng: 72.8777, type: 'BUY' as const, cover_image: 'https://images.unsplash.com/photo-1545324418-cc1ee142d966?w=500&h=300&fit=crop' },
  { id: 'proj-002', name: 'Green Valley Apartments', city: 'Pune', lat: 18.5204, lng: 73.8567, type: 'RENT' as const, cover_image: 'https://images.unsplash.com/photo-1600210174714-147564fb8fdd?w=500&h=300&fit=crop' },
  { id: 'proj-003', name: 'Tech Park Plaza', city: 'Bangalore', lat: 12.9716, lng: 77.5946, type: 'BOTH' as const, cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop' },
  { id: 'proj-004', name: 'Heritage Heights', city: 'Delhi', lat: 28.7041, lng: 77.1025, type: 'BUY' as const, cover_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop' },
  { id: 'proj-005', name: 'Oceanfront Villas', city: 'Goa', lat: 15.2993, lng: 74.1240, type: 'BUY' as const, cover_image: 'https://images.unsplash.com/photo-1512207736139-feed7a61ae5b?w=500&h=300&fit=crop' },
  { id: 'proj-006', name: 'Skyrise Towers', city: 'Hyderabad', lat: 17.3850, lng: 78.4867, type: 'BUY' as const, cover_image: 'https://images.unsplash.com/photo-1552708995-c663dcf8fb59?w=500&h=300&fit=crop' },
  { id: 'proj-007', name: 'Royal Gardens', city: 'Jaipur', lat: 26.9124, lng: 75.7873, type: 'BOTH' as const, cover_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop' },
  { id: 'proj-008', name: 'Tech Heights', city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, type: 'RENT' as const, cover_image: 'https://images.unsplash.com/photo-1580828343991-c2a08ee33801?w=500&h=300&fit=crop' },
];

// Calculate nearby projects (within 15 km)
const mockNearbyProjects: NearbyProject[] = allProjectsForNearby
  .map((project) => ({
    id: project.id,
    name: project.name,
    city: project.city,
    lat: project.lat,
    lng: project.lng,
    type: project.type,
    distance_km: calculateDistance(mockUserLocation.lat, mockUserLocation.lng, project.lat, project.lng),
  }))
  .filter((project) => project.distance_km <= 15)
  .sort((a, b) => a.distance_km - b.distance_km);

const initialState: UserDashboardState = {
  newlyAddedProjects: mockNewlyAddedProjects,
  lastAppointments: mockUserAppointments,
  lastVirtualTours: mockUserVirtualTours,
  nearbyProjects: mockNearbyProjects,
  userLocation: mockUserLocation,
  loading: false,
  error: null,
};

const userDashboardSlice = createSlice({
  name: 'userDashboard',
  initialState,
  reducers: {
    setUserLocation: (state, action: PayloadAction<UserLocation>) => {
      state.userLocation = action.payload;
    },
    updateNearbyProjects: (state, action: PayloadAction<NearbyProject[]>) => {
      state.nearbyProjects = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Selectors
export const selectNewlyAddedProjects = (state: RootState) => state.userDashboard.newlyAddedProjects;
export const selectLastAppointments = (state: RootState) => state.userDashboard.lastAppointments;
export const selectLastVirtualTours = (state: RootState) => state.userDashboard.lastVirtualTours;
export const selectNearbyProjects = (state: RootState) => state.userDashboard.nearbyProjects;
export const selectUserLocation = (state: RootState) => state.userDashboard.userLocation;
export const selectUserDashboardLoading = (state: RootState) => state.userDashboard.loading;
export const selectUserDashboardError = (state: RootState) => state.userDashboard.error;

export const { setUserLocation, updateNearbyProjects, setLoading, setError } = userDashboardSlice.actions;
export default userDashboardSlice.reducer;
