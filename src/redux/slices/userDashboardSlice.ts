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
    id: 'proj-ahm-005',
    client_id: 'user-001',
    name: 'Central Park Homes',
    description: 'Urban residential apartments located near major business and shopping districts of Ahmedabad offering modern lifestyle and great connectivity.',
    type: 'BOTH',
    city: 'Ahmedabad',
    lat: 23.0500,
    lng: 72.6000,
    created_at: '2025-05-05T09:00:00Z',
    modified_at: '2025-05-05T09:00:00Z',
    cover_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop',
  },
  {
    id: 'proj-gnd-004',
    client_id: 'user-001',
    name: 'City View Residency',
    description: 'Modern residential apartments in Gandhinagar offering comfortable living in a well-developed and peaceful neighborhood.',
    type: 'BUY',
    city: 'Gandhinagar',
    lat: 23.2300,
    lng: 72.6600,
    created_at: '2025-05-20T11:10:00Z',
    modified_at: '2025-05-20T11:10:00Z',
    cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop',
  },
  {
    id: 'proj-ahm-004',
    client_id: 'user-001',
    name: 'Westend Living',
    description: 'Premium residential development in Ahmedabad offering spacious homes, modern amenities, and a comfortable urban lifestyle.',
    type: 'RENT',
    city: 'Ahmedabad',
    lat: 23.0400,
    lng: 72.5100,
    created_at: '2025-02-28T14:00:00Z',
    modified_at: '2025-02-28T14:00:00Z',
    cover_image: 'https://images.unsplash.com/photo-1512207736139-feed7a61ae5b?w=500&h=300&fit=crop',
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
  lat: 23.0225,
  lng: 72.5714,
  city: 'Ahmedabad',
};


// All projects for calculating nearby
const allProjectsForNearby = [
  {
    id: 'proj-ahm-001',
    name: 'Riverfront Heights',
    city: 'Ahmedabad',
    lat: 23.0225,
    lng: 72.5714,
    type: 'BUY' as const,
    cover_image: 'https://images.unsplash.com/photo-1545324418-cc1ee142d966?w=500&h=300&fit=crop',
  },
  {
    id: 'proj-ahm-002',
    name: 'Shantigram Residency',
    city: 'Ahmedabad',
    lat: 23.1285,
    lng: 72.5440,
    type: 'BOTH' as const,
    cover_image: 'https://images.unsplash.com/photo-1600210174714-147564fb8fdd?w=500&h=300&fit=crop',
  },
  {
    id: 'proj-ahm-003',
    name: 'Skyline Avenue',
    city: 'Ahmedabad',
    lat: 23.0300,
    lng: 72.5800,
    type: 'BUY' as const,
    cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop',
  },
  {
    id: 'proj-ahm-004',
    name: 'Westend Living',
    city: 'Ahmedabad',
    lat: 23.0400,
    lng: 72.5100,
    type: 'RENT' as const,
    cover_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop',
  },
  {
    id: 'proj-ahm-005',
    name: 'Central Park Homes',
    city: 'Ahmedabad',
    lat: 23.0500,
    lng: 72.6000,
    type: 'BOTH' as const,
    cover_image: 'https://images.unsplash.com/photo-1512207736139-feed7a61ae5b?w=500&h=300&fit=crop',
  },
  {
    id: 'proj-gnd-001',
    name: 'Capital Greens',
    city: 'Gandhinagar',
    lat: 23.2156,
    lng: 72.6369,
    type: 'BUY' as const,
    cover_image: 'https://images.unsplash.com/photo-1552708995-c663dcf8fb59?w=500&h=300&fit=crop',
  },
  {
    id: 'proj-gnd-002',
    name: 'Heritage Enclave',
    city: 'Gandhinagar',
    lat: 23.2237,
    lng: 72.6500,
    type: 'BOTH' as const,
    cover_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
  },
  {
    id: 'proj-gnd-003',
    name: 'Palm Meadows',
    city: 'Gandhinagar',
    lat: 23.2100,
    lng: 72.6200,
    type: 'RENT' as const,
    cover_image: 'https://images.unsplash.com/photo-1580828343991-c2a08ee33801?w=500&h=300&fit=crop',
  },
  {
    id: 'proj-gnd-004',
    name: 'City View Residency',
    city: 'Gandhinagar',
    lat: 23.2300,
    lng: 72.6600,
    type: 'BUY' as const,
    cover_image: 'https://images.unsplash.com/photo-1545324418-cc1ee142d966?w=500&h=300&fit=crop',
  },
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
