import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// User types aligned with USERS table
type UserRole = 'USER' | 'CLIENT' | 'ADMIN';
type UserStatus = 'ACTIVE' | 'BLOCKED';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
  created_by: string;
}

// ClientProfile aligned with CLIENT_PROFILE table
interface ClientProfile {
  id: string;
  user_id: string;
  company_name: string;
  logo_image_id: string | null;
  address: string;
  subscription_id: string;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
  created_by: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  clientProfile: ClientProfile | null;
}

const loadAuthFromStorage = (): AuthState | null => {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem('auth-state');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthState;
  } catch (err) {
    return null;
  }
};

// Mock data - Initial state with logged-in CLIENT
const mockClientUser: User = {
  id: 'user-001',
  name: 'Acme Corporation',
  email: 'client@acme.com',
  role: 'CLIENT',
  status: 'ACTIVE',
  created_at: '2025-01-15T10:30:00Z',
  modified_at: '2025-12-17T08:20:00Z',
  deleted_at: null,
  created_by: 'system',
};

const mockClientProfile: ClientProfile = {
  id: 'profile-001',
  user_id: 'user-001',
  company_name: 'Acme Real Estate Corporation',
  logo_image_id: 'img-logo-001',
  address: '123 Business Ave, Suite 400, Mumbai, Maharashtra 400001',
  subscription_id: 'sub-premium-001',
  created_at: '2025-01-15T10:30:00Z',
  modified_at: '2025-12-17T08:20:00Z',
  deleted_at: null,
  created_by: 'user-001',
};

const mockUser: User = {
  id: 'user-101',
  name: 'Jane Resident',
  email: 'user@example.com',
  role: 'USER',
  status: 'ACTIVE',
  created_at: '2025-01-10T10:00:00Z',
  modified_at: '2025-12-17T08:20:00Z',
  deleted_at: null,
  created_by: 'system',
};

const initialState: AuthState =
  loadAuthFromStorage() || {
    isAuthenticated: true,
    user: mockUser,
    clientProfile: null,
  };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: User;
        clientProfile?: ClientProfile;
      }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.clientProfile = action.payload.clientProfile || null;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          'auth-state',
          JSON.stringify({
            isAuthenticated: true,
            user: action.payload.user,
            clientProfile: action.payload.clientProfile || null,
          })
        );
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.clientProfile = null;
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth-state');
      }
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

// Export types
export type { User, ClientProfile, UserRole, UserStatus };
