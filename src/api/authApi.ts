import { User, ClientProfile } from '../redux/slices/authSlice';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  clientProfile?: ClientProfile;
}

// Re-export types
export type { User, ClientProfile };

export const authApi = {
  login: async (_credentials: LoginCredentials): Promise<AuthResponse> => {
    // TODO: Implement API call
    throw new Error('Not implemented');
  },
  
  logout: async (): Promise<void> => {
    // TODO: Implement API call
    throw new Error('Not implemented');
  },
  
  getCurrentUser: async (): Promise<User> => {
    // TODO: Implement API call
    throw new Error('Not implemented');
  },
};
