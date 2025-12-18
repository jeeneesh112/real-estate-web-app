import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ClientProfile aligned with CLIENT_PROFILE table structure
interface ClientProfile {
  id: number;
  user_id: number;
  company_name: string;
  logo_image_id: string | null;
  address: string | null;
  subscription_id: number;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
  created_by: string;
}

interface ClientProfileState {
  profile: ClientProfile | null;
  loading: boolean;
  error: string | null;
}

// Mock data - Client profile based on CLIENT_PROFILE table
const mockClientProfile: ClientProfile = {
  id: 101,
  user_id: 1,
  company_name: 'Acme Real Estate Corporation',
  logo_image_id: 'img-logo-001',
  address: '123 Business Ave, Suite 400, Mumbai, Maharashtra 400001, India',
  subscription_id: 5,
  created_at: '2025-01-15T10:30:00Z',
  modified_at: '2025-12-17T08:20:00Z',
  deleted_at: null,
  created_by: 'user-001',
};

const initialState: ClientProfileState = {
  profile: mockClientProfile,
  loading: false,
  error: null,
};

const clientProfileSlice = createSlice({
  name: 'clientProfile',
  initialState,
  reducers: {
    setClientProfile: (state, action: PayloadAction<ClientProfile>) => {
      state.profile = action.payload;
      state.error = null;
    },
    updateClientProfile: (state, action: PayloadAction<Partial<ClientProfile>>) => {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload,
          modified_at: new Date().toISOString(),
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearClientProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
});

export const {
  setClientProfile,
  updateClientProfile,
  setLoading,
  setError,
  clearClientProfile,
} = clientProfileSlice.actions;
export default clientProfileSlice.reducer;

// Export types
export type { ClientProfile };
