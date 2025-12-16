import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Project types aligned with PROJECT table
type ProjectType = 'BUY' | 'RENT' | 'BOTH';

interface Project {
  id: string;
  client_id: string;
  name: string;
  description: string;
  cover_image_id: string | null;
  type: ProjectType;
  city: string;
  lat: number;
  lng: number;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
  created_by: string;
}

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
}

// Realistic mock data
const mockProjects: Project[] = [
  {
    id: 'proj-001',
    client_id: 'user-001',
    name: 'Skyline Residency',
    description: 'Luxury apartments in the heart of Mumbai with stunning sea views, modern amenities, and world-class facilities. Features include swimming pool, gym, and 24/7 security.',
    cover_image_id: 'img-skyline-001',
    type: 'BUY',
    city: 'Mumbai',
    lat: 19.0760,
    lng: 72.8777,
    created_at: '2025-01-15T10:00:00Z',
    modified_at: '2025-12-17T08:30:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'proj-002',
    client_id: 'user-001',
    name: 'Green Valley Apartments',
    description: 'Eco-friendly residential complex with lush green surroundings, rainwater harvesting, and solar power. Perfect for families looking for a peaceful environment.',
    cover_image_id: 'img-greenvalley-001',
    type: 'RENT',
    city: 'Pune',
    lat: 18.5204,
    lng: 73.8567,
    created_at: '2025-02-10T14:30:00Z',
    modified_at: '2025-12-16T12:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'proj-003',
    client_id: 'user-001',
    name: 'Tech Park Plaza',
    description: 'Premium commercial and residential spaces near IT hub. Ideal for professionals and investors. Includes co-working spaces, cafes, and retail outlets.',
    cover_image_id: 'img-techpark-001',
    type: 'BOTH',
    city: 'Bangalore',
    lat: 12.9716,
    lng: 77.5946,
    created_at: '2025-03-20T09:00:00Z',
    modified_at: '2025-12-17T10:15:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'proj-004',
    client_id: 'user-001',
    name: 'Heritage Heights',
    description: 'Classic architecture meets modern living. Spacious 3 & 4 BHK apartments with high ceilings, marble flooring, and premium fittings in prime location.',
    cover_image_id: 'img-heritage-001',
    type: 'BUY',
    city: 'Delhi',
    lat: 28.7041,
    lng: 77.1025,
    created_at: '2025-04-05T11:20:00Z',
    modified_at: '2025-12-15T16:45:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'proj-005',
    client_id: 'user-001',
    name: 'Oceanfront Villas',
    description: 'Exclusive beachfront villas with private beach access, infinity pools, and panoramic ocean views. Limited edition luxury living experience.',
    cover_image_id: 'img-oceanfront-001',
    type: 'BUY',
    city: 'Goa',
    lat: 15.2993,
    lng: 74.1240,
    created_at: '2025-05-12T08:00:00Z',
    modified_at: '2025-12-17T07:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
];

const initialState: ProjectState = {
  projects: mockProjects,
  selectedProject: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    selectProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
  },
});

export const { setProjects, selectProject } = projectSlice.actions;
export default projectSlice.reducer;

// Export types
export type { Project, ProjectType };
