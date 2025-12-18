import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// ============================================
// 📊 TYPE DEFINITIONS
// ============================================

export type EventType =
  | 'PROJECT_VIEW'
  | 'TOWER_VIEW'
  | 'FLAT_VIEW'
  | 'VIRTUAL_TOUR_START'
  | 'VIRTUAL_TOUR_END'
  | 'APPOINTMENT_BOOKED'
  | 'RENT_INTEREST'
  | 'BUY_INTEREST';

export type FlatType = '1BHK' | '2BHK' | '3BHK' | '4BHK';
export type IntentType = 'RENT' | 'BUY' | 'BOTH';

export interface AnalyticsEvent {
  id: number;
  eventType: EventType;
  
  clientId: number;
  projectId?: number;
  projectName?: string;
  towerId?: number;
  towerName?: string;
  flatId?: number;
  
  flatType?: FlatType;
  intentType?: IntentType;
  
  userId: number;
  userName: string;
  userEmail?: string;
  userCity?: string;
  
  durationSeconds?: number;
  appointmentDate?: string;
  notes?: string;
  
  timestamp: string;
}

interface AnalyticsState {
  events: AnalyticsEvent[];
  loading: boolean;
  error: string | null;
}

// ============================================
// 🗄️ LARGE REALISTIC MOCK DATA
// ============================================

const MOCK_EVENTS: AnalyticsEvent[] = [
  // ========== PROJECT VIEWS ==========
  { id: 1, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', userId: 1001, userName: 'Rahul Sharma', userEmail: 'rahul@example.com', userCity: 'Mumbai', timestamp: '2025-12-15T09:00:00Z' },
  { id: 2, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', userId: 1002, userName: 'Priya Patel', userEmail: 'priya@example.com', userCity: 'Mumbai', timestamp: '2025-12-15T09:15:00Z' },
  { id: 3, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 2, projectName: 'Green Valley Apartments', userId: 1003, userName: 'Amit Kumar', userEmail: 'amit@example.com', userCity: 'Pune', timestamp: '2025-12-15T09:30:00Z' },
  { id: 4, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 3, projectName: 'Tech Park Plaza', userId: 1004, userName: 'Sneha Reddy', userEmail: 'sneha@example.com', userCity: 'Bangalore', timestamp: '2025-12-15T10:00:00Z' },
  { id: 5, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', userId: 1005, userName: 'Vikram Singh', userEmail: 'vikram@example.com', userCity: 'Mumbai', timestamp: '2025-12-15T10:30:00Z' },
  { id: 6, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 4, projectName: 'Heritage Heights', userId: 1006, userName: 'Anjali Mehta', userEmail: 'anjali@example.com', userCity: 'Delhi', timestamp: '2025-12-15T11:00:00Z' },
  { id: 7, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 2, projectName: 'Green Valley Apartments', userId: 1007, userName: 'Deepak Verma', userEmail: 'deepak@example.com', userCity: 'Pune', timestamp: '2025-12-15T11:30:00Z' },
  { id: 8, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', userId: 1008, userName: 'Kavita Desai', userEmail: 'kavita@example.com', userCity: 'Mumbai', timestamp: '2025-12-16T09:00:00Z' },
  { id: 9, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 3, projectName: 'Tech Park Plaza', userId: 1009, userName: 'Rajesh Nair', userEmail: 'rajesh@example.com', userCity: 'Bangalore', timestamp: '2025-12-16T09:45:00Z' },
  { id: 10, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', userId: 1010, userName: 'Pooja Joshi', userEmail: 'pooja@example.com', userCity: 'Mumbai', timestamp: '2025-12-16T10:15:00Z' },
  { id: 11, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 2, projectName: 'Green Valley Apartments', userId: 1011, userName: 'Sanjay Gupta', userEmail: 'sanjay@example.com', userCity: 'Pune', timestamp: '2025-12-16T11:00:00Z' },
  { id: 12, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', userId: 1012, userName: 'Neha Kapoor', userEmail: 'neha@example.com', userCity: 'Mumbai', timestamp: '2025-12-17T09:30:00Z' },

  // ========== TOWER VIEWS ==========
  { id: 13, eventType: 'TOWER_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', towerId: 1, towerName: 'Tower A', userId: 1001, userName: 'Rahul Sharma', userCity: 'Mumbai', timestamp: '2025-12-15T09:10:00Z' },
  { id: 14, eventType: 'TOWER_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', towerId: 2, towerName: 'Tower B', userId: 1002, userName: 'Priya Patel', userCity: 'Mumbai', timestamp: '2025-12-15T09:20:00Z' },
  { id: 15, eventType: 'TOWER_VIEW', clientId: 101, projectId: 2, projectName: 'Green Valley Apartments', towerId: 3, towerName: 'East Wing', userId: 1003, userName: 'Amit Kumar', userCity: 'Pune', timestamp: '2025-12-15T09:40:00Z' },
  { id: 16, eventType: 'TOWER_VIEW', clientId: 101, projectId: 3, projectName: 'Tech Park Plaza', towerId: 5, towerName: 'Corporate Tower', userId: 1004, userName: 'Sneha Reddy', userCity: 'Bangalore', timestamp: '2025-12-15T10:10:00Z' },
  { id: 17, eventType: 'TOWER_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', towerId: 1, towerName: 'Tower A', userId: 1005, userName: 'Vikram Singh', userCity: 'Mumbai', timestamp: '2025-12-15T10:40:00Z' },
  { id: 18, eventType: 'TOWER_VIEW', clientId: 101, projectId: 4, projectName: 'Heritage Heights', towerId: 7, towerName: 'Classic Block', userId: 1006, userName: 'Anjali Mehta', userCity: 'Delhi', timestamp: '2025-12-15T11:10:00Z' },
  { id: 19, eventType: 'TOWER_VIEW', clientId: 101, projectId: 2, projectName: 'Green Valley Apartments', towerId: 4, towerName: 'West Wing', userId: 1007, userName: 'Deepak Verma', userCity: 'Pune', timestamp: '2025-12-15T11:40:00Z' },
  { id: 20, eventType: 'TOWER_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', towerId: 1, towerName: 'Tower A', userId: 1008, userName: 'Kavita Desai', userCity: 'Mumbai', timestamp: '2025-12-16T09:10:00Z' },
  { id: 21, eventType: 'TOWER_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', towerId: 2, towerName: 'Tower B', userId: 1010, userName: 'Pooja Joshi', userCity: 'Mumbai', timestamp: '2025-12-16T10:25:00Z' },

  // ========== FLAT VIEWS ==========
  { id: 22, eventType: 'FLAT_VIEW', clientId: 101, projectId: 1, towerId: 1, flatId: 101, flatType: '3BHK', userId: 1001, userName: 'Rahul Sharma', userCity: 'Mumbai', timestamp: '2025-12-15T09:15:00Z' },
  { id: 23, eventType: 'FLAT_VIEW', clientId: 101, projectId: 1, towerId: 2, flatId: 201, flatType: '2BHK', userId: 1002, userName: 'Priya Patel', userCity: 'Mumbai', timestamp: '2025-12-15T09:25:00Z' },
  { id: 24, eventType: 'FLAT_VIEW', clientId: 101, projectId: 2, towerId: 3, flatId: 301, flatType: '2BHK', userId: 1003, userName: 'Amit Kumar', userCity: 'Pune', timestamp: '2025-12-15T09:45:00Z' },
  { id: 25, eventType: 'FLAT_VIEW', clientId: 101, projectId: 3, towerId: 5, flatId: 501, flatType: '1BHK', userId: 1004, userName: 'Sneha Reddy', userCity: 'Bangalore', timestamp: '2025-12-15T10:15:00Z' },
  { id: 26, eventType: 'FLAT_VIEW', clientId: 101, projectId: 1, towerId: 1, flatId: 102, flatType: '3BHK', userId: 1005, userName: 'Vikram Singh', userCity: 'Mumbai', timestamp: '2025-12-15T10:45:00Z' },
  { id: 27, eventType: 'FLAT_VIEW', clientId: 101, projectId: 4, towerId: 7, flatId: 701, flatType: '4BHK', userId: 1006, userName: 'Anjali Mehta', userCity: 'Delhi', timestamp: '2025-12-15T11:15:00Z' },
  { id: 28, eventType: 'FLAT_VIEW', clientId: 101, projectId: 2, towerId: 4, flatId: 401, flatType: '2BHK', userId: 1007, userName: 'Deepak Verma', userCity: 'Pune', timestamp: '2025-12-15T11:45:00Z' },
  { id: 29, eventType: 'FLAT_VIEW', clientId: 101, projectId: 1, towerId: 1, flatId: 103, flatType: '3BHK', userId: 1008, userName: 'Kavita Desai', userCity: 'Mumbai', timestamp: '2025-12-16T09:15:00Z' },
  { id: 30, eventType: 'FLAT_VIEW', clientId: 101, projectId: 3, towerId: 5, flatId: 502, flatType: '2BHK', userId: 1009, userName: 'Rajesh Nair', userCity: 'Bangalore', timestamp: '2025-12-16T09:55:00Z' },
  { id: 31, eventType: 'FLAT_VIEW', clientId: 101, projectId: 1, towerId: 2, flatId: 202, flatType: '2BHK', userId: 1010, userName: 'Pooja Joshi', userCity: 'Mumbai', timestamp: '2025-12-16T10:30:00Z' },
  { id: 32, eventType: 'FLAT_VIEW', clientId: 101, projectId: 2, towerId: 3, flatId: 302, flatType: '3BHK', userId: 1011, userName: 'Sanjay Gupta', userCity: 'Pune', timestamp: '2025-12-16T11:10:00Z' },
  { id: 33, eventType: 'FLAT_VIEW', clientId: 101, projectId: 1, towerId: 1, flatId: 104, flatType: '4BHK', userId: 1012, userName: 'Neha Kapoor', userCity: 'Mumbai', timestamp: '2025-12-17T09:40:00Z' },

  // ========== RENT INTEREST ==========
  { id: 34, eventType: 'RENT_INTEREST', clientId: 101, projectId: 2, towerId: 3, flatId: 301, flatType: '2BHK', intentType: 'RENT', userId: 1003, userName: 'Amit Kumar', userCity: 'Pune', timestamp: '2025-12-15T09:50:00Z' },
  { id: 35, eventType: 'RENT_INTEREST', clientId: 101, projectId: 3, towerId: 5, flatId: 501, flatType: '1BHK', intentType: 'RENT', userId: 1004, userName: 'Sneha Reddy', userCity: 'Bangalore', timestamp: '2025-12-15T10:20:00Z' },
  { id: 36, eventType: 'RENT_INTEREST', clientId: 101, projectId: 2, towerId: 4, flatId: 401, flatType: '2BHK', intentType: 'RENT', userId: 1007, userName: 'Deepak Verma', userCity: 'Pune', timestamp: '2025-12-15T11:50:00Z' },
  { id: 37, eventType: 'RENT_INTEREST', clientId: 101, projectId: 3, towerId: 5, flatId: 502, flatType: '2BHK', intentType: 'RENT', userId: 1009, userName: 'Rajesh Nair', userCity: 'Bangalore', timestamp: '2025-12-16T10:00:00Z' },

  // ========== BUY INTEREST ==========
  { id: 38, eventType: 'BUY_INTEREST', clientId: 101, projectId: 1, towerId: 1, flatId: 101, flatType: '3BHK', intentType: 'BUY', userId: 1001, userName: 'Rahul Sharma', userCity: 'Mumbai', timestamp: '2025-12-15T09:20:00Z' },
  { id: 39, eventType: 'BUY_INTEREST', clientId: 101, projectId: 1, towerId: 2, flatId: 201, flatType: '2BHK', intentType: 'BUY', userId: 1002, userName: 'Priya Patel', userCity: 'Mumbai', timestamp: '2025-12-15T09:30:00Z' },
  { id: 40, eventType: 'BUY_INTEREST', clientId: 101, projectId: 1, towerId: 1, flatId: 102, flatType: '3BHK', intentType: 'BUY', userId: 1005, userName: 'Vikram Singh', userCity: 'Mumbai', timestamp: '2025-12-15T10:50:00Z' },
  { id: 41, eventType: 'BUY_INTEREST', clientId: 101, projectId: 4, towerId: 7, flatId: 701, flatType: '4BHK', intentType: 'BUY', userId: 1006, userName: 'Anjali Mehta', userCity: 'Delhi', timestamp: '2025-12-15T11:20:00Z' },
  { id: 42, eventType: 'BUY_INTEREST', clientId: 101, projectId: 1, towerId: 1, flatId: 103, flatType: '3BHK', intentType: 'BUY', userId: 1008, userName: 'Kavita Desai', userCity: 'Mumbai', timestamp: '2025-12-16T09:20:00Z' },
  { id: 43, eventType: 'BUY_INTEREST', clientId: 101, projectId: 1, towerId: 2, flatId: 202, flatType: '2BHK', intentType: 'BUY', userId: 1010, userName: 'Pooja Joshi', userCity: 'Mumbai', timestamp: '2025-12-16T10:35:00Z' },
  { id: 44, eventType: 'BUY_INTEREST', clientId: 101, projectId: 2, towerId: 3, flatId: 302, flatType: '3BHK', intentType: 'BUY', userId: 1011, userName: 'Sanjay Gupta', userCity: 'Pune', timestamp: '2025-12-16T11:15:00Z' },
  { id: 45, eventType: 'BUY_INTEREST', clientId: 101, projectId: 1, towerId: 1, flatId: 104, flatType: '4BHK', intentType: 'BUY', userId: 1012, userName: 'Neha Kapoor', userCity: 'Mumbai', timestamp: '2025-12-17T09:45:00Z' },

  // ========== VIRTUAL TOUR START ==========
  { id: 46, eventType: 'VIRTUAL_TOUR_START', clientId: 101, projectId: 1, towerId: 1, flatId: 101, flatType: '3BHK', userId: 1001, userName: 'Rahul Sharma', userCity: 'Mumbai', timestamp: '2025-12-15T09:25:00Z' },
  { id: 47, eventType: 'VIRTUAL_TOUR_START', clientId: 101, projectId: 1, towerId: 2, flatId: 201, flatType: '2BHK', userId: 1002, userName: 'Priya Patel', userCity: 'Mumbai', timestamp: '2025-12-15T09:35:00Z' },
  { id: 48, eventType: 'VIRTUAL_TOUR_START', clientId: 101, projectId: 1, towerId: 1, flatId: 102, flatType: '3BHK', userId: 1005, userName: 'Vikram Singh', userCity: 'Mumbai', timestamp: '2025-12-15T10:55:00Z' },
  { id: 49, eventType: 'VIRTUAL_TOUR_START', clientId: 101, projectId: 4, towerId: 7, flatId: 701, flatType: '4BHK', userId: 1006, userName: 'Anjali Mehta', userCity: 'Delhi', timestamp: '2025-12-15T11:25:00Z' },
  { id: 50, eventType: 'VIRTUAL_TOUR_START', clientId: 101, projectId: 1, towerId: 1, flatId: 103, flatType: '3BHK', userId: 1008, userName: 'Kavita Desai', userCity: 'Mumbai', timestamp: '2025-12-16T09:25:00Z' },
  { id: 51, eventType: 'VIRTUAL_TOUR_START', clientId: 101, projectId: 1, towerId: 2, flatId: 202, flatType: '2BHK', userId: 1010, userName: 'Pooja Joshi', userCity: 'Mumbai', timestamp: '2025-12-16T10:40:00Z' },
  { id: 52, eventType: 'VIRTUAL_TOUR_START', clientId: 101, projectId: 2, towerId: 3, flatId: 302, flatType: '3BHK', userId: 1011, userName: 'Sanjay Gupta', userCity: 'Pune', timestamp: '2025-12-16T11:20:00Z' },
  { id: 53, eventType: 'VIRTUAL_TOUR_START', clientId: 101, projectId: 1, towerId: 1, flatId: 104, flatType: '4BHK', userId: 1012, userName: 'Neha Kapoor', userCity: 'Mumbai', timestamp: '2025-12-17T09:50:00Z' },

  // ========== VIRTUAL TOUR END ==========
  { id: 54, eventType: 'VIRTUAL_TOUR_END', clientId: 101, projectId: 1, towerId: 1, flatId: 101, flatType: '3BHK', userId: 1001, userName: 'Rahul Sharma', userCity: 'Mumbai', durationSeconds: 420, timestamp: '2025-12-15T09:32:00Z' },
  { id: 55, eventType: 'VIRTUAL_TOUR_END', clientId: 101, projectId: 1, towerId: 2, flatId: 201, flatType: '2BHK', userId: 1002, userName: 'Priya Patel', userCity: 'Mumbai', durationSeconds: 360, timestamp: '2025-12-15T09:41:00Z' },
  { id: 56, eventType: 'VIRTUAL_TOUR_END', clientId: 101, projectId: 1, towerId: 1, flatId: 102, flatType: '3BHK', userId: 1005, userName: 'Vikram Singh', userCity: 'Mumbai', durationSeconds: 540, timestamp: '2025-12-15T11:04:00Z' },
  { id: 57, eventType: 'VIRTUAL_TOUR_END', clientId: 101, projectId: 4, towerId: 7, flatId: 701, flatType: '4BHK', userId: 1006, userName: 'Anjali Mehta', userCity: 'Delhi', durationSeconds: 720, timestamp: '2025-12-15T11:37:00Z' },
  { id: 58, eventType: 'VIRTUAL_TOUR_END', clientId: 101, projectId: 1, towerId: 1, flatId: 103, flatType: '3BHK', userId: 1008, userName: 'Kavita Desai', userCity: 'Mumbai', durationSeconds: 480, timestamp: '2025-12-16T09:33:00Z' },
  { id: 59, eventType: 'VIRTUAL_TOUR_END', clientId: 101, projectId: 1, towerId: 2, flatId: 202, flatType: '2BHK', userId: 1010, userName: 'Pooja Joshi', userCity: 'Mumbai', durationSeconds: 390, timestamp: '2025-12-16T10:46:30Z' },
  { id: 60, eventType: 'VIRTUAL_TOUR_END', clientId: 101, projectId: 2, towerId: 3, flatId: 302, flatType: '3BHK', userId: 1011, userName: 'Sanjay Gupta', userCity: 'Pune', durationSeconds: 600, timestamp: '2025-12-16T11:30:00Z' },
  { id: 61, eventType: 'VIRTUAL_TOUR_END', clientId: 101, projectId: 1, towerId: 1, flatId: 104, flatType: '4BHK', userId: 1012, userName: 'Neha Kapoor', userCity: 'Mumbai', durationSeconds: 660, timestamp: '2025-12-17T10:01:00Z' },

  // ========== APPOINTMENTS BOOKED ==========
  { id: 62, eventType: 'APPOINTMENT_BOOKED', clientId: 101, projectId: 1, projectName: 'Skyline Residency', towerId: 1, towerName: 'Tower A', flatId: 101, flatType: '3BHK', userId: 1001, userName: 'Rahul Sharma', userEmail: 'rahul@example.com', userCity: 'Mumbai', appointmentDate: '2025-12-22T10:00:00Z', notes: 'Interested in 3BHK, want to discuss payment plans', timestamp: '2025-12-15T09:35:00Z' },
  { id: 63, eventType: 'APPOINTMENT_BOOKED', clientId: 101, projectId: 1, projectName: 'Skyline Residency', towerId: 2, towerName: 'Tower B', flatId: 201, flatType: '2BHK', userId: 1002, userName: 'Priya Patel', userEmail: 'priya@example.com', userCity: 'Mumbai', appointmentDate: '2025-12-21T14:00:00Z', notes: 'First-time buyer, need loan assistance', timestamp: '2025-12-15T09:45:00Z' },
  { id: 64, eventType: 'APPOINTMENT_BOOKED', clientId: 101, projectId: 1, projectName: 'Skyline Residency', towerId: 1, towerName: 'Tower A', flatId: 102, flatType: '3BHK', userId: 1005, userName: 'Vikram Singh', userEmail: 'vikram@example.com', userCity: 'Mumbai', appointmentDate: '2025-12-24T11:00:00Z', notes: 'Coming with family for site visit', timestamp: '2025-12-15T11:10:00Z' },
  { id: 65, eventType: 'APPOINTMENT_BOOKED', clientId: 101, projectId: 4, projectName: 'Heritage Heights', towerId: 7, towerName: 'Classic Block', flatId: 701, flatType: '4BHK', userId: 1006, userName: 'Anjali Mehta', userEmail: 'anjali@example.com', userCity: 'Delhi', appointmentDate: '2025-12-23T15:30:00Z', notes: 'Looking for luxury 4BHK penthouse', timestamp: '2025-12-15T11:40:00Z' },
  { id: 66, eventType: 'APPOINTMENT_BOOKED', clientId: 101, projectId: 1, projectName: 'Skyline Residency', towerId: 1, towerName: 'Tower A', flatId: 103, flatType: '3BHK', userId: 1008, userName: 'Kavita Desai', userEmail: 'kavita@example.com', userCity: 'Mumbai', appointmentDate: '2025-12-25T10:30:00Z', notes: 'Urgent requirement, ready to book', timestamp: '2025-12-16T09:40:00Z' },
  { id: 67, eventType: 'APPOINTMENT_BOOKED', clientId: 101, projectId: 1, projectName: 'Skyline Residency', towerId: 2, towerName: 'Tower B', flatId: 202, flatType: '2BHK', userId: 1010, userName: 'Pooja Joshi', userEmail: 'pooja@example.com', userCity: 'Mumbai', appointmentDate: '2025-12-26T09:00:00Z', notes: 'Comparing with other properties', timestamp: '2025-12-16T10:50:00Z' },
  { id: 68, eventType: 'APPOINTMENT_BOOKED', clientId: 101, projectId: 2, projectName: 'Green Valley Apartments', towerId: 3, towerName: 'East Wing', flatId: 302, flatType: '3BHK', userId: 1011, userName: 'Sanjay Gupta', userEmail: 'sanjay@example.com', userCity: 'Pune', appointmentDate: '2025-12-27T11:30:00Z', notes: 'Investment purpose, need ROI details', timestamp: '2025-12-16T11:35:00Z' },
  { id: 69, eventType: 'APPOINTMENT_BOOKED', clientId: 101, projectId: 1, projectName: 'Skyline Residency', towerId: 1, towerName: 'Tower A', flatId: 104, flatType: '4BHK', userId: 1012, userName: 'Neha Kapoor', userEmail: 'neha@example.com', userCity: 'Mumbai', appointmentDate: '2025-12-28T14:00:00Z', notes: 'Need customization options for interiors', timestamp: '2025-12-17T10:05:00Z' },

  // ========== MORE PROJECT VIEWS (for trend analysis) ==========
  { id: 70, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', userId: 1013, userName: 'Arun Malhotra', userCity: 'Mumbai', timestamp: '2025-12-17T10:30:00Z' },
  { id: 71, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 2, projectName: 'Green Valley Apartments', userId: 1014, userName: 'Divya Shah', userCity: 'Pune', timestamp: '2025-12-17T11:00:00Z' },
  { id: 72, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', userId: 1015, userName: 'Kiran Rao', userCity: 'Mumbai', timestamp: '2025-12-17T11:30:00Z' },
  { id: 73, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 3, projectName: 'Tech Park Plaza', userId: 1016, userName: 'Meera Singh', userCity: 'Bangalore', timestamp: '2025-12-17T12:00:00Z' },
  { id: 74, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', userId: 1017, userName: 'Nikhil Bhatt', userCity: 'Mumbai', timestamp: '2025-12-18T09:00:00Z' },
  { id: 75, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 2, projectName: 'Green Valley Apartments', userId: 1018, userName: 'Ritu Agarwal', userCity: 'Pune', timestamp: '2025-12-18T09:30:00Z' },
  { id: 76, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', userId: 1019, userName: 'Suresh Pillai', userCity: 'Mumbai', timestamp: '2025-12-18T10:00:00Z' },
  { id: 77, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 4, projectName: 'Heritage Heights', userId: 1020, userName: 'Tanvi Kulkarni', userCity: 'Delhi', timestamp: '2025-12-18T10:30:00Z' },
  { id: 78, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 3, projectName: 'Tech Park Plaza', userId: 1021, userName: 'Varun Chawla', userCity: 'Bangalore', timestamp: '2025-12-18T11:00:00Z' },
  { id: 79, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 1, projectName: 'Skyline Residency', userId: 1022, userName: 'Yash Thakur', userCity: 'Mumbai', timestamp: '2025-12-18T11:30:00Z' },
  { id: 80, eventType: 'PROJECT_VIEW', clientId: 101, projectId: 2, projectName: 'Green Valley Apartments', userId: 1023, userName: 'Zara Khan', userCity: 'Pune', timestamp: '2025-12-18T12:00:00Z' },

  // ========== MORE FLAT VIEWS ==========
  { id: 81, eventType: 'FLAT_VIEW', clientId: 101, projectId: 1, towerId: 1, flatId: 105, flatType: '3BHK', userId: 1013, userName: 'Arun Malhotra', userCity: 'Mumbai', timestamp: '2025-12-17T10:35:00Z' },
  { id: 82, eventType: 'FLAT_VIEW', clientId: 101, projectId: 2, towerId: 3, flatId: 303, flatType: '2BHK', userId: 1014, userName: 'Divya Shah', userCity: 'Pune', timestamp: '2025-12-17T11:05:00Z' },
  { id: 83, eventType: 'FLAT_VIEW', clientId: 101, projectId: 1, towerId: 2, flatId: 203, flatType: '2BHK', userId: 1015, userName: 'Kiran Rao', userCity: 'Mumbai', timestamp: '2025-12-17T11:35:00Z' },
  { id: 84, eventType: 'FLAT_VIEW', clientId: 101, projectId: 3, towerId: 5, flatId: 503, flatType: '1BHK', userId: 1016, userName: 'Meera Singh', userCity: 'Bangalore', timestamp: '2025-12-17T12:05:00Z' },
  { id: 85, eventType: 'FLAT_VIEW', clientId: 101, projectId: 1, towerId: 1, flatId: 106, flatType: '4BHK', userId: 1017, userName: 'Nikhil Bhatt', userCity: 'Mumbai', timestamp: '2025-12-18T09:05:00Z' },
  { id: 86, eventType: 'FLAT_VIEW', clientId: 101, projectId: 2, towerId: 4, flatId: 402, flatType: '3BHK', userId: 1018, userName: 'Ritu Agarwal', userCity: 'Pune', timestamp: '2025-12-18T09:35:00Z' },
  { id: 87, eventType: 'FLAT_VIEW', clientId: 101, projectId: 1, towerId: 1, flatId: 107, flatType: '3BHK', userId: 1019, userName: 'Suresh Pillai', userCity: 'Mumbai', timestamp: '2025-12-18T10:05:00Z' },
  { id: 88, eventType: 'FLAT_VIEW', clientId: 101, projectId: 4, towerId: 7, flatId: 702, flatType: '4BHK', userId: 1020, userName: 'Tanvi Kulkarni', userCity: 'Delhi', timestamp: '2025-12-18T10:35:00Z' },

  // ========== MORE RENT/BUY INTEREST ==========
  { id: 89, eventType: 'RENT_INTEREST', clientId: 101, projectId: 3, towerId: 5, flatId: 503, flatType: '1BHK', intentType: 'RENT', userId: 1016, userName: 'Meera Singh', userCity: 'Bangalore', timestamp: '2025-12-17T12:10:00Z' },
  { id: 90, eventType: 'BUY_INTEREST', clientId: 101, projectId: 1, towerId: 1, flatId: 105, flatType: '3BHK', intentType: 'BUY', userId: 1013, userName: 'Arun Malhotra', userCity: 'Mumbai', timestamp: '2025-12-17T10:40:00Z' },
  { id: 91, eventType: 'RENT_INTEREST', clientId: 101, projectId: 2, towerId: 3, flatId: 303, flatType: '2BHK', intentType: 'RENT', userId: 1014, userName: 'Divya Shah', userCity: 'Pune', timestamp: '2025-12-17T11:10:00Z' },
  { id: 92, eventType: 'BUY_INTEREST', clientId: 101, projectId: 1, towerId: 2, flatId: 203, flatType: '2BHK', intentType: 'BUY', userId: 1015, userName: 'Kiran Rao', userCity: 'Mumbai', timestamp: '2025-12-17T11:40:00Z' },
  { id: 93, eventType: 'BUY_INTEREST', clientId: 101, projectId: 1, towerId: 1, flatId: 106, flatType: '4BHK', intentType: 'BUY', userId: 1017, userName: 'Nikhil Bhatt', userCity: 'Mumbai', timestamp: '2025-12-18T09:10:00Z' },
  { id: 94, eventType: 'BUY_INTEREST', clientId: 101, projectId: 2, towerId: 4, flatId: 402, flatType: '3BHK', intentType: 'BUY', userId: 1018, userName: 'Ritu Agarwal', userCity: 'Pune', timestamp: '2025-12-18T09:40:00Z' },
  { id: 95, eventType: 'BUY_INTEREST', clientId: 101, projectId: 1, towerId: 1, flatId: 107, flatType: '3BHK', intentType: 'BUY', userId: 1019, userName: 'Suresh Pillai', userCity: 'Mumbai', timestamp: '2025-12-18T10:10:00Z' },
  { id: 96, eventType: 'BUY_INTEREST', clientId: 101, projectId: 4, towerId: 7, flatId: 702, flatType: '4BHK', intentType: 'BUY', userId: 1020, userName: 'Tanvi Kulkarni', userCity: 'Delhi', timestamp: '2025-12-18T10:40:00Z' },

  // ========== MORE VIRTUAL TOURS ==========
  { id: 97, eventType: 'VIRTUAL_TOUR_START', clientId: 101, projectId: 1, towerId: 1, flatId: 105, flatType: '3BHK', userId: 1013, userName: 'Arun Malhotra', userCity: 'Mumbai', timestamp: '2025-12-17T10:45:00Z' },
  { id: 98, eventType: 'VIRTUAL_TOUR_END', clientId: 101, projectId: 1, towerId: 1, flatId: 105, flatType: '3BHK', userId: 1013, userName: 'Arun Malhotra', userCity: 'Mumbai', durationSeconds: 450, timestamp: '2025-12-17T10:52:30Z' },
  { id: 99, eventType: 'VIRTUAL_TOUR_START', clientId: 101, projectId: 1, towerId: 1, flatId: 106, flatType: '4BHK', userId: 1017, userName: 'Nikhil Bhatt', userCity: 'Mumbai', timestamp: '2025-12-18T09:15:00Z' },
  { id: 100, eventType: 'VIRTUAL_TOUR_END', clientId: 101, projectId: 1, towerId: 1, flatId: 106, flatType: '4BHK', userId: 1017, userName: 'Nikhil Bhatt', userCity: 'Mumbai', durationSeconds: 690, timestamp: '2025-12-18T09:26:30Z' },
];

// ============================================
// 📦 INITIAL STATE
// ============================================

const initialState: AnalyticsState = {
  events: MOCK_EVENTS,
  loading: false,
  error: null,
};

// ============================================
// 🔧 SLICE & REDUCERS
// ============================================

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<AnalyticsEvent[]>) => {
      state.events = action.payload;
      state.error = null;
    },
    addEvent: (state, action: PayloadAction<AnalyticsEvent>) => {
      state.events.unshift(action.payload);
    },
    clearAnalytics: (state) => {
      state.events = [];
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setEvents, addEvent, clearAnalytics, setLoading, setError } = analyticsSlice.actions;
export default analyticsSlice.reducer;

// ============================================
// 🔍 BASE SELECTORS
// ============================================

const selectAnalyticsState = (state: RootState) => state.analytics;
const selectAllEvents = (state: RootState) => state.analytics.events;

// Helper: Filter events by clientId
const selectClientEvents = createSelector(
  [selectAllEvents, (_state: RootState, clientId: number) => clientId],
  (events, clientId) => events.filter((e) => e.clientId === clientId)
);

// ============================================
// 📌 KPI CARD SELECTORS
// ============================================

/** Total project views for a client */
export const selectTotalProjectViews = createSelector(
  [selectClientEvents],
  (events) => events.filter((e) => e.eventType === 'PROJECT_VIEW').length
);

/** Total virtual tours completed for a client */
export const selectTotalVirtualTours = createSelector(
  [selectClientEvents],
  (events) => events.filter((e) => e.eventType === 'VIRTUAL_TOUR_END').length
);

/** Total appointments booked for a client */
export const selectTotalAppointments = createSelector(
  [selectClientEvents],
  (events) => events.filter((e) => e.eventType === 'APPOINTMENT_BOOKED').length
);

/** Rent vs Buy ratio - returns { rent: number, buy: number } */
export const selectRentVsBuyRatio = createSelector(
  [selectClientEvents],
  (events) => {
    const rent = events.filter((e) => e.eventType === 'RENT_INTEREST').length;
    const buy = events.filter((e) => e.eventType === 'BUY_INTEREST').length;
    return { rent, buy };
  }
);

/** Average virtual tour duration in minutes */
export const selectAverageTourDuration = createSelector(
  [selectClientEvents],
  (events) => {
    const completedTours = events.filter((e) => e.eventType === 'VIRTUAL_TOUR_END');
    if (completedTours.length === 0) return 0;
    const totalSeconds = completedTours.reduce((sum, e) => sum + (e.durationSeconds || 0), 0);
    return Math.round((totalSeconds / completedTours.length) / 60); // Convert to minutes
  }
);

/** Total unique users/visitors */
export const selectTotalUniqueUsers = createSelector(
  [selectClientEvents],
  (events) => {
    const uniqueUserIds = new Set(events.map((e) => e.userId));
    return uniqueUserIds.size;
  }
);

// ============================================
// 📌 TOP INSIGHTS SELECTORS
// ============================================

/** Most viewed project - returns { projectId, projectName, count } */
export const selectMostViewedProject = createSelector(
  [selectClientEvents],
  (events) => {
    const projectViews = events.filter((e) => e.eventType === 'PROJECT_VIEW');
    const projectCounts: Record<number, { projectId: number; projectName: string; count: number }> = {};
    
    projectViews.forEach((e) => {
      if (e.projectId) {
        if (!projectCounts[e.projectId]) {
          projectCounts[e.projectId] = {
            projectId: e.projectId,
            projectName: e.projectName || `Project ${e.projectId}`,
            count: 0,
          };
        }
        projectCounts[e.projectId].count++;
      }
    });

    const sorted = Object.values(projectCounts).sort((a, b) => b.count - a.count);
    return sorted[0] || null;
  }
);

/** Top 5 viewed projects with counts */
export const selectTop5ViewedProjects = createSelector(
  [selectClientEvents],
  (events) => {
    const projectViews = events.filter((e) => e.eventType === 'PROJECT_VIEW');
    const projectCounts: Record<number, { projectId: number; projectName: string; count: number }> = {};
    
    projectViews.forEach((e) => {
      if (e.projectId) {
        if (!projectCounts[e.projectId]) {
          projectCounts[e.projectId] = {
            projectId: e.projectId,
            projectName: e.projectName || `Project ${e.projectId}`,
            count: 0,
          };
        }
        projectCounts[e.projectId].count++;
      }
    });

    return Object.values(projectCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
);

/** Most viewed tower - returns { towerId, towerName, count } */
export const selectMostViewedTower = createSelector(
  [selectClientEvents],
  (events) => {
    const towerViews = events.filter((e) => e.eventType === 'TOWER_VIEW');
    const towerCounts: Record<number, { towerId: number; towerName: string; count: number }> = {};
    
    towerViews.forEach((e) => {
      if (e.towerId) {
        if (!towerCounts[e.towerId]) {
          towerCounts[e.towerId] = {
            towerId: e.towerId,
            towerName: e.towerName || `Tower ${e.towerId}`,
            count: 0,
          };
        }
        towerCounts[e.towerId].count++;
      }
    });

    const sorted = Object.values(towerCounts).sort((a, b) => b.count - a.count);
    return sorted[0] || null;
  }
);

/** Most viewed flat type - returns { flatType, count } */
export const selectMostViewedFlatType = createSelector(
  [selectClientEvents],
  (events) => {
    const flatViews = events.filter((e) => e.eventType === 'FLAT_VIEW' && e.flatType);
    const flatTypeCounts: Record<string, number> = {};
    
    flatViews.forEach((e) => {
      if (e.flatType) {
        flatTypeCounts[e.flatType] = (flatTypeCounts[e.flatType] || 0) + 1;
      }
    });

    const sorted = Object.entries(flatTypeCounts)
      .map(([flatType, count]) => ({ flatType, count }))
      .sort((a, b) => b.count - a.count);
    
    return sorted[0] || null;
  }
);

/** All flat type preferences with counts */
export const selectFlatTypePreferences = createSelector(
  [selectClientEvents],
  (events) => {
    const flatViews = events.filter((e) => e.eventType === 'FLAT_VIEW' && e.flatType);
    const flatTypeCounts: Record<string, number> = {};
    
    flatViews.forEach((e) => {
      if (e.flatType) {
        flatTypeCounts[e.flatType] = (flatTypeCounts[e.flatType] || 0) + 1;
      }
    });

    return Object.entries(flatTypeCounts)
      .map(([flatType, count]) => ({ flatType, count }))
      .sort((a, b) => b.count - a.count);
  }
);

// ============================================
// 📌 FUNNEL ANALYTICS SELECTORS
// ============================================

/** Users who viewed flats but didn't book appointment */
export const selectUsersViewedButNoAppointment = createSelector(
  [selectClientEvents],
  (events) => {
    const viewedUsers = new Set(
      events
        .filter((e) => e.eventType === 'FLAT_VIEW')
        .map((e) => e.userId)
    );
    
    const bookedUsers = new Set(
      events
        .filter((e) => e.eventType === 'APPOINTMENT_BOOKED')
        .map((e) => e.userId)
    );

    const notBookedUsers = Array.from(viewedUsers).filter((userId) => !bookedUsers.has(userId));
    return notBookedUsers.length;
  }
);

/** Users who completed tour but didn't book */
export const selectUsersCompletedTourButNoBooking = createSelector(
  [selectClientEvents],
  (events) => {
    const tourUsers = new Set(
      events
        .filter((e) => e.eventType === 'VIRTUAL_TOUR_END')
        .map((e) => e.userId)
    );
    
    const bookedUsers = new Set(
      events
        .filter((e) => e.eventType === 'APPOINTMENT_BOOKED')
        .map((e) => e.userId)
    );

    const notBookedUsers = Array.from(tourUsers).filter((userId) => !bookedUsers.has(userId));
    return notBookedUsers.length;
  }
);

/** Conversion funnel data */
export const selectConversionFunnel = createSelector(
  [selectClientEvents],
  (events) => {
    const projectViews = new Set(events.filter((e) => e.eventType === 'PROJECT_VIEW').map((e) => e.userId));
    const flatViews = new Set(events.filter((e) => e.eventType === 'FLAT_VIEW').map((e) => e.userId));
    const tours = new Set(events.filter((e) => e.eventType === 'VIRTUAL_TOUR_END').map((e) => e.userId));
    const appointments = new Set(events.filter((e) => e.eventType === 'APPOINTMENT_BOOKED').map((e) => e.userId));

    return {
      projectViews: projectViews.size,
      flatViews: flatViews.size,
      virtualTours: tours.size,
      appointments: appointments.size,
    };
  }
);

// ============================================
// 📌 RECENT ACTIVITY SELECTORS
// ============================================

/** Last 5 appointments with full details */
export const selectLast5Appointments = createSelector(
  [selectClientEvents],
  (events) => {
    return events
      .filter((e) => e.eventType === 'APPOINTMENT_BOOKED')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }
);

/** Last 5 virtual tours with duration */
export const selectLast5VirtualTours = createSelector(
  [selectClientEvents],
  (events) => {
    return events
      .filter((e) => e.eventType === 'VIRTUAL_TOUR_END')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }
);

/** Recent user activities (configurable limit) */
export const selectRecentUserActivities = createSelector(
  [selectClientEvents, (_state: RootState, _clientId: number, limit: number = 10) => limit],
  (events, limit) => {
    return events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
);

// ============================================
// 📌 CHART DATA SELECTORS (UI-READY)
// ============================================

/** Project views chart data - ready for bar/line charts */
export const selectProjectViewsChartData = createSelector(
  [selectClientEvents],
  (events) => {
    const projectViews = events.filter((e) => e.eventType === 'PROJECT_VIEW');
    const projectCounts: Record<string, number> = {};
    
    projectViews.forEach((e) => {
      const name = e.projectName || `Project ${e.projectId}`;
      projectCounts[name] = (projectCounts[name] || 0) + 1;
    });

    return {
      labels: Object.keys(projectCounts),
      data: Object.values(projectCounts),
    };
  }
);

/** Tower views chart data for a specific project */
export const selectTowerViewsChartData = createSelector(
  [
    selectAllEvents,
    (_state: RootState, projectId: number) => projectId,
  ],
  (events, projectId) => {
    const towerViews = events.filter(
      (e) => e.eventType === 'TOWER_VIEW' && e.projectId === projectId
    );
    const towerCounts: Record<string, number> = {};
    
    towerViews.forEach((e) => {
      const name = e.towerName || `Tower ${e.towerId}`;
      towerCounts[name] = (towerCounts[name] || 0) + 1;
    });

    return {
      labels: Object.keys(towerCounts),
      data: Object.values(towerCounts),
    };
  }
);

/** Flat type interest chart data - ready for pie/doughnut charts */
export const selectFlatTypeInterestChartData = createSelector(
  [selectClientEvents],
  (events) => {
    const flatViews = events.filter((e) => e.eventType === 'FLAT_VIEW' && e.flatType);
    const flatTypeCounts: Record<string, number> = {};
    
    flatViews.forEach((e) => {
      if (e.flatType) {
        flatTypeCounts[e.flatType] = (flatTypeCounts[e.flatType] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(flatTypeCounts),
      data: Object.values(flatTypeCounts),
    };
  }
);

/** Tour duration histogram - buckets of time ranges */
export const selectTourDurationHistogram = createSelector(
  [selectClientEvents],
  (events) => {
    const completedTours = events.filter((e) => e.eventType === 'VIRTUAL_TOUR_END');
    const buckets = {
      '0-5 min': 0,
      '5-10 min': 0,
      '10-15 min': 0,
      '15+ min': 0,
    };

    completedTours.forEach((e) => {
      const minutes = (e.durationSeconds || 0) / 60;
      if (minutes <= 5) buckets['0-5 min']++;
      else if (minutes <= 10) buckets['5-10 min']++;
      else if (minutes <= 15) buckets['10-15 min']++;
      else buckets['15+ min']++;
    });

    return {
      labels: Object.keys(buckets),
      data: Object.values(buckets),
    };
  }
);

/** Daily activity trend - events per day for the last 7 days */
export const selectDailyActivityTrend = createSelector(
  [selectClientEvents],
  (events) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyCounts: Record<string, number> = {};
    last7Days.forEach((date) => (dailyCounts[date] = 0));

    events.forEach((e) => {
      const eventDate = e.timestamp.split('T')[0];
      if (dailyCounts[eventDate] !== undefined) {
        dailyCounts[eventDate]++;
      }
    });

    return {
      labels: last7Days.map((date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      data: last7Days.map((date) => dailyCounts[date]),
    };
  }
);

/** Property type interest (RENT vs BUY) - for pie charts */
export const selectPropertyTypeInterestChartData = createSelector(
  [selectClientEvents],
  (events) => {
    const rent = events.filter((e) => e.eventType === 'RENT_INTEREST').length;
    const buy = events.filter((e) => e.eventType === 'BUY_INTEREST').length;

    return {
      labels: ['Rent', 'Buy'],
      data: [rent, buy],
    };
  }
);

// ============================================
// 🎯 EXPORT ALL
// ============================================

export {
  selectAnalyticsState,
  selectAllEvents,
  selectClientEvents,
};
