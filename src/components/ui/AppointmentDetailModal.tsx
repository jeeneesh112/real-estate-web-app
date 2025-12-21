import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stack,
  Typography,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Close,
  Phone,
  Event,
  ApartmentOutlined,
  Home,
  CheckCircle,
  HourglassEmpty,
  Cancel,
} from '@mui/icons-material';

interface AppointmentDetailModalProps {
  open: boolean;
  onClose: () => void;
  appointment: {
    id: number | string;
    userName: string;
    userEmail: string;
    userPhone?: string;
    projectName: string;
    towerName: string;
    flatType: string;
    visit_date: string;
    status: string;
    notes?: string;
  } | null;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  open,
  onClose,
  appointment,
}) => {
  if (!appointment) return null;

  const getStatusConfig = (status: string) => {
    const configs: {
      [key: string]: { color: 'success' | 'error' | 'warning' | 'info'; icon: React.ReactNode };
    } = {
      COMPLETED: {
        color: 'success',
        icon: <CheckCircle sx={{ fontSize: '1.2rem' }} />,
      },
      UPCOMING: {
        color: 'info',
        icon: <Event sx={{ fontSize: '1.2rem' }} />,
      },
      CANCELLED: {
        color: 'error',
        icon: <Cancel sx={{ fontSize: '1.2rem' }} />,
      },
      PENDING: {
        color: 'warning',
        icon: <HourglassEmpty sx={{ fontSize: '1.2rem' }} />,
      },
    };
    return configs[status] || configs.PENDING;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const statusConfig = getStatusConfig(appointment.status);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: '#ffffff',
        },
      }}
    >
      {/* Header with gradient background */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Appointment Details
        </Typography>
        <Close
          onClick={onClose}
          sx={{
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
          }}
        />
      </DialogTitle>

      <DialogContent sx={{ pb: 0 }}>
        <Stack spacing={3}>
          {/* Status and ID */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Appointment ID: <strong>#{appointment.id}</strong>
            </Typography>
            <Chip
              label={appointment.status}
              color={statusConfig.color}
              variant="filled"
            />
          </Box>

          <Divider />

          {/* User Information Section */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 2, color: '#667eea' }}
            >
              👤 User Information
            </Typography>
            <Stack spacing={1.5}>
              {/* User Name with Avatar and Email */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                  }}
                >
                  {appointment.userName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={600}>
                    {appointment.userName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {appointment.userEmail}
                  </Typography>
                </Box>
              </Box>

              {/* Phone - if available */}
              {appointment.userPhone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 7 }}>
                  <Phone sx={{ fontSize: '1.1rem', color: '#667eea' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body2">{appointment.userPhone}</Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </Box>

          <Divider />

          {/* Property Information Section */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 2, color: '#667eea' }}
            >
              🏢 Property Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
              {/* Project */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <ApartmentOutlined sx={{ fontSize: '1.1rem', color: '#667eea' }} />
                  <Typography variant="caption" color="text.secondary">
                    Project
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={500} sx={{ ml: 3.2 }}>
                  {appointment.projectName}
                </Typography>
              </Box>

              {/* Tower */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <ApartmentOutlined sx={{ fontSize: '1rem', color: '#667eea' }} />
                  <Typography variant="caption" color="text.secondary">
                    Tower
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={500} sx={{ ml: 3.2 }}>
                  {appointment.towerName}
                </Typography>
              </Box>

              {/* Flat Type with chip below */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Home sx={{ fontSize: '1rem', color: '#667eea' }} />
                  <Typography variant="caption" color="text.secondary">
                    Flat Type
                  </Typography>
                </Box>
                <Box sx={{ ml: 3.2 }}>
                  <Chip label={appointment.flatType} size="small" variant="outlined" />
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Appointment Details Section */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 2, color: '#667eea' }}
            >
              📅 Appointment Details
            </Typography>
            <Stack spacing={1.5}>
              {/* Date */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Event sx={{ fontSize: '1.1rem', color: '#667eea' }} />
                <Box flex={1}>
                  <Typography variant="caption" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(appointment.visit_date)}
                  </Typography>
                </Box>
              </Box>

              {/* Time */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Event sx={{ fontSize: '1.1rem', color: '#667eea' }} />
                <Box flex={1}>
                  <Typography variant="caption" color="text.secondary">
                    Time
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatTime(appointment.visit_date)}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>

          {/* Notes Section - if available */}
          {appointment.notes && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ mb: 2, color: '#667eea' }}
                >
                  📝 Notes
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: '#f5f7fa',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <Typography variant="body2">{appointment.notes}</Typography>
                </Box>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
