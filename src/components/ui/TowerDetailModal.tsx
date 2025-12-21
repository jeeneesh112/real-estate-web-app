import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Stack,
  Typography,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Close,
  Layers,
  BuildOutlined,
  Home,
  CheckCircle,
} from '@mui/icons-material';

interface TowerDetailModalProps {
  open: boolean;
  onClose: () => void;
  tower: {
    id: number | string;
    towerName: string;
    projectName: string;
    totalFloors: number;
    perFloorUnits: number;
    totalFlats: number;
    totalSellFlats: number;
    totalRentalFlats: number;
    availableFlats: number;
  } | null;
}

export const TowerDetailModal: React.FC<TowerDetailModalProps> = ({
  open,
  onClose,
  tower,
}) => {
  if (!tower) return null;

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
          Tower Details
        </Typography>
        <Close
          onClick={onClose}
          sx={{
            cursor: 'pointer',
            fontSize: '1.5rem',
            '&:hover': { opacity: 0.8 },
          }}
        />
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Stack spacing={3}>
          {/* Tower ID and Name */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Tower ID: <strong>#{tower.id}</strong>
            </Typography>
          </Box>

          <Divider />

          {/* Tower Information Section */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 2, color: '#667eea' }}
            >
              🏢 Tower Information
            </Typography>
            <Stack spacing={1.5}>
              {/* Tower Name with Avatar */}
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
                  {tower.towerName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={600}>
                    {tower.towerName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {tower.projectName}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Structure Information Section */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 2, color: '#667eea' }}
            >
              🏗️ Structure Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
              {/* Total Floors */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Layers sx={{ fontSize: '1.1rem', color: '#667eea' }} />
                  <Typography variant="caption" color="text.secondary">
                    Total Floors
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={500} sx={{ ml: 3.2 }}>
                  {tower.totalFloors}
                </Typography>
              </Box>

              {/* Per Floor Units */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <BuildOutlined sx={{ fontSize: '1rem', color: '#667eea' }} />
                  <Typography variant="caption" color="text.secondary">
                    Per Floor Units
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight={500} sx={{ ml: 3.2 }}>
                  {tower.perFloorUnits}
                </Typography>
              </Box>

              {/* Total Flats */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Home sx={{ fontSize: '1rem', color: '#667eea' }} />
                  <Typography variant="caption" color="text.secondary">
                    Total Flats
                  </Typography>
                </Box>
                <Box sx={{ ml: 3.2 }}>
                  <Chip label={tower.totalFlats} size="small" variant="outlined" />
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Flat Type Distribution Section */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 2, color: '#667eea' }}
            >
              📊 Flat Distribution
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
              {/* Total Sell Flats */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <CheckCircle sx={{ fontSize: '1rem', color: '#43e97b' }} />
                  <Typography variant="caption" color="text.secondary">
                    Sell Flats
                  </Typography>
                </Box>
                <Box sx={{ ml: 3.2 }}>
                  <Chip
                    label={tower.totalSellFlats}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: '#43e97b', color: '#43e97b' }}
                  />
                </Box>
              </Box>

              {/* Total Rental Flats */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Home sx={{ fontSize: '1rem', color: '#4facfe' }} />
                  <Typography variant="caption" color="text.secondary">
                    Rental Flats
                  </Typography>
                </Box>
                <Box sx={{ ml: 3.2 }}>
                  <Chip
                    label={tower.totalRentalFlats}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: '#4facfe', color: '#4facfe' }}
                  />
                </Box>
              </Box>

              {/* Available Flats */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: '0.9rem !important' }} />}
                    label="Available"
                    size="small"
                    sx={{ height: 20, fontSize: '0.65rem' }}
                  />
                </Box>
                <Box sx={{ ml: 0 }}>
                  <Chip
                    label={tower.availableFlats}
                    size="small"
                    variant="filled"
                    color="success"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, display: 'none' }} />
    </Dialog>
  );
};
