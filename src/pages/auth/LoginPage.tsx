import { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, type User, type ClientProfile } from '../../redux/slices/authSlice';
import { i18n } from '../../i18n';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const demoAccounts = [
    {
      id: 'user-demo',
      label: 'Demo User',
      email: 'user@example.com',
      password: 'password',
      user: {
        id: 'user-100',
        name: 'Demo User',
        email: 'user@example.com',
        role: 'USER' as const,
        status: 'ACTIVE' as const,
        created_at: '2025-01-01T00:00:00Z',
        modified_at: '2025-12-17T00:00:00Z',
        deleted_at: null,
        created_by: 'system',
      } as User,
      redirectTo: '/user/home',
    },
    {
      id: 'client-demo',
      label: 'Demo Client',
      email: 'client@example.com',
      password: 'password',
      user: {
        id: 'user-200',
        name: 'Demo Client Company',
        email: 'client@example.com',
        role: 'CLIENT' as const,
        status: 'ACTIVE' as const,
        created_at: '2025-01-01T00:00:00Z',
        modified_at: '2025-12-17T00:00:00Z',
        deleted_at: null,
        created_by: 'system',
      } as User,
      clientProfile: {
        id: 'profile-200',
        user_id: 'user-200',
        company_name: 'Demo Client Real Estate',
        logo_image_id: 'img-demo-logo',
        address: '456 Demo Street, City, State 12345',
        subscription_id: 'sub-demo-001',
        created_at: '2025-01-01T00:00:00Z',
        modified_at: '2025-12-17T00:00:00Z',
        deleted_at: null,
        created_by: 'user-200',
      } as ClientProfile,
      redirectTo: '/client/dashboard',
    },
    {
      id: 'admin-demo',
      label: 'Demo Admin',
      email: 'admin@example.com',
      password: 'password',
      user: {
        id: 'user-300',
        name: 'Demo Admin',
        email: 'admin@example.com',
        role: 'ADMIN' as const,
        status: 'ACTIVE' as const,
        created_at: '2025-01-01T00:00:00Z',
        modified_at: '2025-12-17T00:00:00Z',
        deleted_at: null,
        created_by: 'system',
      } as User,
      redirectTo: '/admin/system-dashboard',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const account = demoAccounts.find(
        (acc) => acc.email === email && acc.password === password
      );

      if (!account) {
        setError(i18n.t('auth.invalidCredentials'));
        setLoading(false);
        return;
      }

      dispatch(loginSuccess({
        user: account.user,
        clientProfile: account.clientProfile,
      }));
      navigate(account.redirectTo);
    } catch (err) {
      setError(i18n.t('auth.invalidCredentials'));
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
      {/* Left Side - Image & Branding */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          padding: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 500 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h2" sx={{ fontWeight: 800 }}>
              🏢
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            RealEstate Hub
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, lineHeight: 1.6 }}>
            Discover, Explore & Invest in Premium Properties. Your Dream Home Awaits!
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>500+</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Properties</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>50K+</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Happy Users</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>24/7</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Support</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          backgroundColor: '#fff',
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                }}
              >
                <LockOutlinedIcon sx={{ color: '#fff', fontSize: '2rem' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Sign in to access your property portfolio
              </Typography>
            </Box>

            {/* Demo Accounts Info */}
            <Alert severity="info" sx={{ mb: 3, backgroundColor: '#f0f9ff', borderColor: '#0284c7' }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Demo Credentials:
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                👤 User: user@example.com / password
              </Typography>
              <Typography variant="caption" display="block" sx={{ fontSize: '0.75rem' }}>
                🏢 Client: client@example.com / password
              </Typography>
              <Typography variant="caption" display="block" sx={{ fontSize: '0.75rem' }}>
                👨‍💼 Admin: admin@example.com / password
              </Typography>
            </Alert>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '0.95rem',
                  },
                  '& .MuiFormLabel-root': {
                    fontSize: '0.95rem',
                    fontWeight: 500,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '0.95rem',
                  },
                  '& .MuiFormLabel-root': {
                    fontSize: '0.95rem',
                    fontWeight: 500,
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                  },
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 3, pt: 3, borderTop: '1px solid #e5e7eb' }}>
              <Typography variant="caption" color="textSecondary">
                © 2026 RealEstate Hub. All rights reserved.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
