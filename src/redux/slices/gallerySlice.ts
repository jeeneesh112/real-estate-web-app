import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Image Type Enum
export enum ImageType {
  CLIENT_LOGO = 'CLIENT_LOGO',
  PROJECT_GALLERY = 'PROJECT_GALLERY',
  PROJECT_COVER = 'PROJECT_COVER',
  TOWER_IMAGE = 'TOWER_IMAGE',
  FLAT_GALLERY = 'FLAT_GALLERY',
  PANORAMA_IMAGE = 'PANORAMA_IMAGE',
}

// Created By Interface
interface CreatedBy {
  id: number;
  role: 'USER' | 'CLIENT' | 'ADMIN';
  name: string;
}

// Image Interface
export interface Image {
  id: number;
  imageType: ImageType;
  fileName: string;
  url: string;

  // Entity references (nullable depending on imageType)
  clientId?: number;
  projectId?: number;
  towerId?: number;
  flatId?: number;

  // Panorama-specific
  sequenceOrder?: number; // required for PANORAMA_IMAGE
  roomType?: string; // e.g. Living Room, Bedroom

  // Metadata
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Audit
  createdBy: CreatedBy;
}

// Gallery State Interface
interface GalleryState {
  images: Image[];
  selectedImage: Image | null;
  loading: boolean;
  error: string | null;
}

// Mock Data - Real Online Images with Proper Relationships
const mockImages: Image[] = [
  // ========== CLIENT LOGO (ONLY ONE PER CLIENT) ==========
  {
    id: 1,
    imageType: ImageType.CLIENT_LOGO,
    fileName: 'acme-corporation-logo.png',
    url: 'https://ui-avatars.com/api/?name=Acme+Corporation&size=200&background=1976d2&color=fff',
    clientId: 1,
    isActive: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-01T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },

  // ========== PROJECT COVERS (ONE PER PROJECT) ==========
  // Skyline Residency (proj-001) - Mumbai
  {
    id: 2,
    imageType: ImageType.PROJECT_COVER,
    fileName: 'skyline-residency-cover.jpg',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  // Green Valley Apartments (proj-002) - Pune
  {
    id: 3,
    imageType: ImageType.PROJECT_COVER,
    fileName: 'green-valley-cover.jpg',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=600&fit=crop',
    clientId: 1,
    projectId: 2,
    isActive: true,
    createdAt: '2025-02-10T10:00:00Z',
    updatedAt: '2025-02-10T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  // Tech Park Plaza (proj-003) - Bangalore
  {
    id: 4,
    imageType: ImageType.PROJECT_COVER,
    fileName: 'tech-park-cover.jpg',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
    clientId: 1,
    projectId: 3,
    isActive: true,
    createdAt: '2025-03-20T10:00:00Z',
    updatedAt: '2025-03-20T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },

  // ========== PROJECT GALLERY (MULTIPLE PER PROJECT - FOR SLIDER) ==========
  // Skyline Residency Gallery (proj-001) - 6 images
  {
    id: 5,
    imageType: ImageType.PROJECT_GALLERY,
    fileName: 'skyline-exterior-front.jpg',
    url: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 6,
    imageType: ImageType.PROJECT_GALLERY,
    fileName: 'skyline-amenities-pool.jpg',
    url: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 7,
    imageType: ImageType.PROJECT_GALLERY,
    fileName: 'skyline-lobby-entrance.jpg',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 8,
    imageType: ImageType.PROJECT_GALLERY,
    fileName: 'skyline-gym-fitness.jpg',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 9,
    imageType: ImageType.PROJECT_GALLERY,
    fileName: 'skyline-garden-landscape.jpg',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 10,
    imageType: ImageType.PROJECT_GALLERY,
    fileName: 'skyline-clubhouse.jpg',
    url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },

  // Green Valley Gallery (proj-002) - 4 images
  {
    id: 11,
    imageType: ImageType.PROJECT_GALLERY,
    fileName: 'green-valley-exterior.jpg',
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 2,
    isActive: true,
    createdAt: '2025-02-10T10:00:00Z',
    updatedAt: '2025-02-10T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 12,
    imageType: ImageType.PROJECT_GALLERY,
    fileName: 'green-valley-pool.jpg',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 2,
    isActive: true,
    createdAt: '2025-02-10T10:00:00Z',
    updatedAt: '2025-02-10T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 13,
    imageType: ImageType.PROJECT_GALLERY,
    fileName: 'green-valley-park.jpg',
    url: 'https://images.unsplash.com/photo-1519974719765-e6559eac2575?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 2,
    isActive: true,
    createdAt: '2025-02-10T10:00:00Z',
    updatedAt: '2025-02-10T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 14,
    imageType: ImageType.PROJECT_GALLERY,
    fileName: 'green-valley-playground.jpg',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 2,
    isActive: true,
    createdAt: '2025-02-10T10:00:00Z',
    updatedAt: '2025-02-10T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },

  // Tech Park Plaza Gallery (proj-003) - 3 images
  {
    id: 15,
    imageType: ImageType.PROJECT_GALLERY,
    fileName: 'tech-park-exterior.jpg',
    url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 3,
    isActive: true,
    createdAt: '2025-03-20T10:00:00Z',
    updatedAt: '2025-03-20T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 16,
    imageType: ImageType.PROJECT_GALLERY,
    fileName: 'tech-park-office-space.jpg',
    url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 3,
    isActive: true,
    createdAt: '2025-03-20T10:00:00Z',
    updatedAt: '2025-03-20T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 17,
    imageType: ImageType.PROJECT_GALLERY,
    fileName: 'tech-park-cafeteria.jpg',
    url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 3,
    isActive: true,
    createdAt: '2025-03-20T10:00:00Z',
    updatedAt: '2025-03-20T10:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },

  // ========== TOWER IMAGES (MULTIPLE PER TOWER - ALIGNED WITH PROJECT) ==========
  // Tower A (tower-001) - Skyline Residency (proj-001)
  {
    id: 18,
    imageType: ImageType.TOWER_IMAGE,
    fileName: 'tower-a-front-view.jpg',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=800&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    isActive: true,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 19,
    imageType: ImageType.TOWER_IMAGE,
    fileName: 'tower-a-side-view.jpg',
    url: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=600&h=800&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    isActive: true,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 20,
    imageType: ImageType.TOWER_IMAGE,
    fileName: 'tower-a-night-view.jpg',
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=800&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    isActive: true,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },

  // Tower B (tower-002) - Skyline Residency (proj-001)
  {
    id: 21,
    imageType: ImageType.TOWER_IMAGE,
    fileName: 'tower-b-front-view.jpg',
    url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=800&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 2,
    isActive: true,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 22,
    imageType: ImageType.TOWER_IMAGE,
    fileName: 'tower-b-aerial-view.jpg',
    url: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=600&h=800&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 2,
    isActive: true,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },

  // ========== FLAT GALLERY (MULTIPLE PER FLAT - ALIGNED WITH TOWER & PROJECT) ==========
  // Flat 1 (flat-001) - Tower A (tower-001) - Skyline Residency (proj-001) - 5 images
  {
    id: 23,
    imageType: ImageType.FLAT_GALLERY,
    fileName: 'flat-001-living-room.jpg',
    url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    isActive: true,
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 24,
    imageType: ImageType.FLAT_GALLERY,
    fileName: 'flat-001-bedroom-master.jpg',
    url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    isActive: true,
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 25,
    imageType: ImageType.FLAT_GALLERY,
    fileName: 'flat-001-kitchen.jpg',
    url: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    isActive: true,
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 26,
    imageType: ImageType.FLAT_GALLERY,
    fileName: 'flat-001-bathroom.jpg',
    url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    isActive: true,
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 27,
    imageType: ImageType.FLAT_GALLERY,
    fileName: 'flat-001-balcony.jpg',
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    isActive: true,
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },

  // Flat 2 (flat-002) - Tower A (tower-001) - Skyline Residency (proj-001) - 4 images
  {
    id: 28,
    imageType: ImageType.FLAT_GALLERY,
    fileName: 'flat-002-living-room.jpg',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 2,
    isActive: true,
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 29,
    imageType: ImageType.FLAT_GALLERY,
    fileName: 'flat-002-dining-area.jpg',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 2,
    isActive: true,
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 30,
    imageType: ImageType.FLAT_GALLERY,
    fileName: 'flat-002-bedroom-1.jpg',
    url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 2,
    isActive: true,
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 31,
    imageType: ImageType.FLAT_GALLERY,
    fileName: 'flat-002-balcony-view.jpg',
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 2,
    isActive: true,
    createdAt: '2025-01-15T11:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },

  // ========== PANORAMA IMAGES (ALL FOR ONE SAMPLE FLAT - SAMPLE HOUSE) ==========
  // ALL Panoramas for Flat 1 (flat-001) - Tower A (tower-001) - Skyline Residency (proj-001)
  // This flat serves as the SAMPLE HOUSE with complete panorama tour
  // Using proper equirectangular panorama format images for 360° viewing
  {
    id: 32,
    imageType: ImageType.PANORAMA_IMAGE,
    fileName: 'sample-house-living-room-panorama-1.jpg',
    url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&h=400&fit=crop',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    sequenceOrder: 1,
    roomType: 'Living Room - View 1',
    isActive: true,
    createdAt: '2025-01-15T11:30:00Z',
    updatedAt: '2025-01-15T11:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 33,
    imageType: ImageType.PANORAMA_IMAGE,
    fileName: 'sample-house-living-room-panorama-2.jpg',
    url: 'https://renderstuff.com/assets/133/equirectangular-360-panorama-interior-rendering-by-3ds-max-and-v-ray.jpg',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    sequenceOrder: 2,
    roomType: 'Living Room - View 2',
    isActive: true,
    createdAt: '2025-01-15T11:30:00Z',
    updatedAt: '2025-01-15T11:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 34,
    imageType: ImageType.PANORAMA_IMAGE,
    fileName: 'sample-house-master-bedroom-panorama.jpg',
    url: 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    sequenceOrder: 3,
    roomType: 'Master Bedroom',
    isActive: true,
    createdAt: '2025-01-15T11:30:00Z',
    updatedAt: '2025-01-15T11:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 35,
    imageType: ImageType.PANORAMA_IMAGE,
    fileName: 'sample-house-bedroom-2-panorama.jpg',
    url: 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    sequenceOrder: 4,
    roomType: 'Bedroom 2',
    isActive: true,
    createdAt: '2025-01-15T11:30:00Z',
    updatedAt: '2025-01-15T11:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 36,
    imageType: ImageType.PANORAMA_IMAGE,
    fileName: 'sample-house-kitchen-panorama.jpg',
    url: 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    sequenceOrder: 5,
    roomType: 'Kitchen',
    isActive: true,
    createdAt: '2025-01-15T11:30:00Z',
    updatedAt: '2025-01-15T11:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 37,
    imageType: ImageType.PANORAMA_IMAGE,
    fileName: 'sample-house-dining-area-panorama.jpg',
    url: 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    sequenceOrder: 6,
    roomType: 'Dining Area',
    isActive: true,
    createdAt: '2025-01-15T11:30:00Z',
    updatedAt: '2025-01-15T11:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 38,
    imageType: ImageType.PANORAMA_IMAGE,
    fileName: 'sample-house-bathroom-panorama.jpg',
    url: 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    sequenceOrder: 7,
    roomType: 'Bathroom',
    isActive: true,
    createdAt: '2025-01-15T11:30:00Z',
    updatedAt: '2025-01-15T11:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 39,
    imageType: ImageType.PANORAMA_IMAGE,
    fileName: 'sample-house-balcony-panorama.jpg',
    url: 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    sequenceOrder: 8,
    roomType: 'Balcony',
    isActive: true,
    createdAt: '2025-01-15T11:30:00Z',
    updatedAt: '2025-01-15T11:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
  {
    id: 40,
    imageType: ImageType.PANORAMA_IMAGE,
    fileName: 'sample-house-entrance-panorama.jpg',
    url: 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
    clientId: 1,
    projectId: 1,
    towerId: 1,
    flatId: 1,
    sequenceOrder: 9,
    roomType: 'Entrance',
    isActive: true,
    createdAt: '2025-01-15T11:30:00Z',
    updatedAt: '2025-01-15T11:30:00Z',
    deletedAt: null,
    createdBy: { id: 1, role: 'CLIENT', name: 'John Doe' },
  },
];

// Initial State
const initialState: GalleryState = {
  images: mockImages,
  selectedImage: null,
  loading: false,
  error: null,
};

// Gallery Slice
const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<Image[]>) => {
      state.images = action.payload;
      state.loading = false;
      state.error = null;
    },

    addImage: (state, action: PayloadAction<Image>) => {
      state.images.push(action.payload);
    },

    updateImage: (state, action: PayloadAction<Image>) => {
      const index = state.images.findIndex((img) => img.id === action.payload.id);
      if (index !== -1) {
        state.images[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    removeImage: (state, action: PayloadAction<number>) => {
      const index = state.images.findIndex((img) => img.id === action.payload);
      if (index !== -1) {
        state.images[index].deletedAt = new Date().toISOString();
        state.images[index].isActive = false;
      }
    },

    setSelectedImage: (state, action: PayloadAction<Image | null>) => {
      state.selectedImage = action.payload;
    },

    reorderPanoramaImages: (
      state,
      action: PayloadAction<{ flatId: number; imageIds: number[] }>
    ) => {
      const { flatId, imageIds } = action.payload;
      imageIds.forEach((imageId, index) => {
        const image = state.images.find(
          (img) =>
            img.id === imageId &&
            img.flatId === flatId &&
            img.imageType === ImageType.PANORAMA_IMAGE
        );
        if (image) {
          image.sequenceOrder = index + 1;
          image.updatedAt = new Date().toISOString();
        }
      });
    },

    toggleImageStatus: (state, action: PayloadAction<number>) => {
      const image = state.images.find((img) => img.id === action.payload);
      if (image) {
        image.isActive = !image.isActive;
        image.updatedAt = new Date().toISOString();
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// Export Actions
export const {
  setImages,
  addImage,
  updateImage,
  removeImage,
  setSelectedImage,
  reorderPanoramaImages,
  toggleImageStatus,
  setLoading,
  setError,
} = gallerySlice.actions;

// Export Reducer
export default gallerySlice.reducer;

// ===== SELECTORS =====

// Base selector
const selectGalleryState = (state: RootState) => state.gallery;

// Select all images
export const selectAllImages = createSelector(
  [selectGalleryState],
  (gallery) => gallery.images.filter((img) => !img.deletedAt)
);

// Select project gallery images
export const selectProjectGallery = createSelector(
  [selectAllImages, (_state: RootState, projectId: number) => projectId],
  (images, projectId) =>
    images.filter(
      (img) =>
        img.projectId === projectId &&
        (img.imageType === ImageType.PROJECT_GALLERY ||
          img.imageType === ImageType.PROJECT_COVER) &&
        img.isActive
    )
);

// Select tower images
export const selectTowerImages = createSelector(
  [selectAllImages, (_state: RootState, towerId: number) => towerId],
  (images, towerId) =>
    images.filter(
      (img) =>
        img.towerId === towerId &&
        img.imageType === ImageType.TOWER_IMAGE &&
        img.isActive
    )
);

// Select flat gallery images
export const selectFlatGallery = createSelector(
  [selectAllImages, (_state: RootState, flatId: number) => flatId],
  (images, flatId) =>
    images.filter(
      (img) =>
        img.flatId === flatId &&
        img.imageType === ImageType.FLAT_GALLERY &&
        img.isActive
    )
);

// Select panorama images by flat (sorted by sequenceOrder)
export const selectPanoramaImagesByFlat = createSelector(
  [selectAllImages, (_state: RootState, flatId: number) => flatId],
  (images, flatId) =>
    images
      .filter(
        (img) =>
          img.flatId === flatId &&
          img.imageType === ImageType.PANORAMA_IMAGE &&
          img.isActive
      )
      .sort((a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0))
);

// Select client logo
export const selectClientLogo = createSelector(
  [selectAllImages, (_state: RootState, clientId: number) => clientId],
  (images, clientId) =>
    images.find(
      (img) =>
        img.clientId === clientId &&
        img.imageType === ImageType.CLIENT_LOGO &&
        img.isActive
    )
);

// Select selected image
export const selectSelectedImage = createSelector(
  [selectGalleryState],
  (gallery) => gallery.selectedImage
);

// Select loading state
export const selectGalleryLoading = createSelector(
  [selectGalleryState],
  (gallery) => gallery.loading
);

// Select error state
export const selectGalleryError = createSelector(
  [selectGalleryState],
  (gallery) => gallery.error
);

// Select images by type
export const selectImagesByType = createSelector(
  [selectAllImages, (_state: RootState, imageType: ImageType) => imageType],
  (images, imageType) =>
    images.filter((img) => img.imageType === imageType && img.isActive)
);

// Export types
export type { Image, CreatedBy, GalleryState };
