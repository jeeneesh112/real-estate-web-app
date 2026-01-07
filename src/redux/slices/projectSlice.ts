import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

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
    id: 'proj-ahm-001',
    client_id: 'user-001',
    name: 'Riverfront Heights',
    description: 'Modern residential apartments near Sabarmati Riverfront offering premium living spaces and excellent city connectivity.',
    cover_image_id: 'img-riverfront-001',
    type: 'BUY',
    city: 'Ahmedabad',
    lat: 23.0225,
    lng: 72.5714,
    created_at: '2025-01-10T10:00:00Z',
    modified_at: '2025-01-10T10:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'proj-ahm-002',
    client_id: 'user-001',
    name: 'Shantigram Residency',
    description: 'Well-planned township-style residential community offering peaceful living with modern amenities.',
    cover_image_id: 'img-shantigram-001',
    type: 'BOTH',
    city: 'Ahmedabad',
    lat: 23.1285,
    lng: 72.5440,
    created_at: '2025-01-25T11:00:00Z',
    modified_at: '2025-01-25T11:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'proj-ahm-003',
    client_id: 'user-001',
    name: 'Skyline Avenue',
    description: 'Contemporary high-rise apartments with city views and modern lifestyle facilities in a prime location.',
    cover_image_id: 'img-skyline-avenue-001',
    type: 'BUY',
    city: 'Ahmedabad',
    lat: 23.0300,
    lng: 72.5800,
    created_at: '2025-02-10T09:30:00Z',
    modified_at: '2025-02-10T09:30:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'proj-ahm-004',
    client_id: 'user-001',
    name: 'Westend Living',
    description: 'Premium residential development offering spacious homes and a comfortable urban lifestyle.',
    cover_image_id: 'img-westend-001',
    type: 'RENT',
    city: 'Ahmedabad',
    lat: 23.0400,
    lng: 72.5100,
    created_at: '2025-02-28T14:00:00Z',
    modified_at: '2025-02-28T14:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'proj-gnd-001',
    client_id: 'user-001',
    name: 'Capital Greens',
    description: 'Premium residential apartments in Gandhinagar offering serene surroundings and excellent connectivity.',
    cover_image_id: 'img-capital-greens-001',
    type: 'BUY',
    city: 'Gandhinagar',
    lat: 23.2156,
    lng: 72.6369,
    created_at: '2025-03-12T09:15:00Z',
    modified_at: '2025-03-12T09:15:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'proj-gnd-002',
    client_id: 'user-001',
    name: 'Heritage Enclave',
    description: 'Residential project combining classic design with modern comforts in a prime area of Gandhinagar.',
    cover_image_id: 'img-heritage-001',
    type: 'BOTH',
    city: 'Gandhinagar',
    lat: 23.2237,
    lng: 72.6500,
    created_at: '2025-04-05T11:20:00Z',
    modified_at: '2025-04-05T11:20:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'proj-gnd-003',
    client_id: 'user-001',
    name: 'Palm Meadows',
    description: 'Peaceful residential community offering comfortable homes with green open spaces.',
    cover_image_id: 'img-palm-meadows-001',
    type: 'RENT',
    city: 'Gandhinagar',
    lat: 23.2100,
    lng: 72.6200,
    created_at: '2025-04-18T10:45:00Z',
    modified_at: '2025-04-18T10:45:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'proj-ahm-005',
    client_id: 'user-001',
    name: 'Central Park Homes',
    description: 'Urban residential apartments located near major business and shopping districts of Ahmedabad.',
    cover_image_id: 'img-central-park-001',
    type: 'BOTH',
    city: 'Ahmedabad',
    lat: 23.0500,
    lng: 72.6000,
    created_at: '2025-05-05T09:00:00Z',
    modified_at: '2025-05-05T09:00:00Z',
    deleted_at: null,
    created_by: 'user-001',
  },
  {
    id: 'proj-gnd-004',
    client_id: 'user-001',
    name: 'City View Residency',
    description: 'Modern residential apartments offering comfortable living in a well-developed area of Gandhinagar.',
    cover_image_id: 'img-cityview-001',
    type: 'BUY',
    city: 'Gandhinagar',
    lat: 23.2300,
    lng: 72.6600,
    created_at: '2025-05-20T11:10:00Z',
    modified_at: '2025-05-20T11:10:00Z',
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

// Selectors
export const getProjectById = (state: RootState, projectId: string) => {
  return state.project.projects.find((project) => project.id === projectId);
};

// Export types
export type { Project, ProjectType };
