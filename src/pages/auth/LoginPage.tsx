import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, type User, type ClientProfile } from '../../redux/slices/authSlice';
import { i18n } from '../../i18n';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // TODO: Replace with actual API call
      // Demo credentials for development
      const demoAccounts = [
        {
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

      const account = demoAccounts.find(
        (acc) => acc.email === email && acc.password === password
      );

      if (!account) {
        setError(i18n.t('auth.invalidCredentials'));
        return;
      }

      dispatch(loginSuccess({
        user: account.user,
        clientProfile: account.clientProfile,
      }));
      navigate(account.redirectTo);
    } catch (err) {
      setError(i18n.t('auth.invalidCredentials'));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            {i18n.t('auth.loginTitle')}
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            {i18n.t('auth.loginSubtitle')}
          </Typography>

          <Alert severity="info" sx={{ mb: 2, fontSize: '0.85rem' }}>
            <strong>Demo Accounts:</strong><br />
            USER: user@example.com / password<br />
            CLIENT: client@example.com / password<br />
            ADMIN: admin@example.com / password
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={i18n.t('common.email')}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={i18n.t('auth.emailPlaceholder')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={i18n.t('common.password')}
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={i18n.t('auth.passwordPlaceholder')}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {i18n.t('auth.loginButton')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
