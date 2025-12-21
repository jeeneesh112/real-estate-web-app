import React, { useState } from 'react';
import { Stack, Button, Box, Chip, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CheckCircle, BlockOutlined, VpnKey } from '@mui/icons-material';

export type StatusType = 'available' | 'sold' | 'rental';

interface StatusOption {
  value: StatusType;
  label: string;
  color: 'success' | 'info' | 'warning';
  icon: React.ReactNode;
  description: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'available',
    label: 'Available',
    color: 'success',
    icon: <CheckCircle fontSize="small" />,
    description: 'Ready for sale or rent',
  },
  {
    value: 'sold',
    label: 'Sold',
    color: 'info',
    icon: <BlockOutlined fontSize="small" />,
    description: 'Property has been sold',
  },
  {
    value: 'rental',
    label: 'Rented',
    color: 'warning',
    icon: <VpnKey fontSize="small" />,
    description: 'Property is being rented',
  },
];

interface ChangeStatusModalProps {
  open: boolean;
  selectedStatus: StatusType;
  onStatusChange: (status: StatusType) => void;
  onClose: () => void;
  onConfirm: (status: StatusType) => void;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  flatId?: string;
  flatType?: string;
}

export const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
  open,
  selectedStatus,
  onStatusChange,
  onClose,
  onConfirm,
  title = 'Change Status',
  subtitle,
  loading = false,
  flatId,
  flatType,
}) => {
  const [confirmingStatus, setConfirmingStatus] = useState<StatusType | null>(null);

  const handleUpdateClick = (status: StatusType) => {
    setConfirmingStatus(status);
  };

  const handleConfirmUpdate = () => {
    if (confirmingStatus) {
      onConfirm(confirmingStatus);
      setConfirmingStatus(null);
    }
  };

  const getStatusLabel = (status: StatusType) => {
    return status === 'available' ? 'Available' : status === 'sold' ? 'Sold' : 'Rented';
  };
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: '1.2rem', fontWeight: 600, pb: 1 }}>
          {title}
        </DialogTitle>
        {subtitle && (
          <Typography variant="caption" sx={{ px: 3, pt: 0, display: 'block', color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        )}
        <DialogContent sx={{ pt: 2.5 }}>
          <Box sx={{ mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontWeight: 600,
                color: 'text.secondary',
                mb: 1.5,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                fontSize: '0.75rem',
              }}
            >
              Select New Status
            </Typography>

            <Stack spacing={1.2}>
              {STATUS_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => onStatusChange(option.value)}
                  variant={selectedStatus === option.value ? 'contained' : 'outlined'}
                  color={option.color}
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontWeight: selectedStatus === option.value ? 600 : 500,
                    borderWidth: 2,
                    borderColor:
                      selectedStatus === option.value
                        ? `${option.color}.main`
                        : 'rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor:
                        selectedStatus === option.value
                          ? `${option.color}.main`
                          : `${option.color}.main`,
                      backgroundColor:
                        selectedStatus === option.value
                          ? undefined
                          : `${option.color}.lighter`,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {option.icon}
                    </Box>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: selectedStatus === option.value ? 600 : 500,
                        }}
                      >
                        {option.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: selectedStatus === option.value ? 'none' : 'block',
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                        }}
                      >
                        {option.description}
                      </Typography>
                    </Box>
                  </Box>
                  {selectedStatus === option.value && (
                    <Chip
                      label="Selected"
                      size="small"
                      variant="filled"
                      color={option.color}
                      sx={{
                        height: 24,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Button>
              ))}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={() => handleUpdateClick(selectedStatus)}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Inline Confirmation Dialog */}
      <Dialog 
        open={confirmingStatus !== null} 
        onClose={() => setConfirmingStatus(null)} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent
          sx={{
            pt: 3.5,
            pb: 3,
            px: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Status Icon */}
          {confirmingStatus && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 70,
                height: 70,
                borderRadius: '50%',
                backgroundColor: confirmingStatus === 'sold' 
                  ? 'rgba(25, 103, 210, 0.1)' 
                  : confirmingStatus === 'rental'
                  ? 'rgba(255, 152, 0, 0.1)'
                  : 'rgba(76, 175, 80, 0.1)',
                color: confirmingStatus === 'sold' 
                  ? '#1967d2' 
                  : confirmingStatus === 'rental'
                  ? '#ff9800'
                  : '#4caf50',
                mb: 2,
                fontSize: '2rem',
              }}
            >
              {confirmingStatus === 'sold' ? (
                <BlockOutlined sx={{ fontSize: '2rem' }} />
              ) : confirmingStatus === 'rental' ? (
                <VpnKey sx={{ fontSize: '2rem' }} />
              ) : (
                <CheckCircle sx={{ fontSize: '2rem' }} />
              )}
            </Box>
          )}

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.2rem',
              mb: 1.5,
              color: 'text.primary',
            }}
          >
            Confirm Status Change
          </Typography>

          {flatId && flatType && (
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Flat: <strong style={{ color: '#000' }}>{flatId}</strong> ({flatType})
            </Typography>
          )}
          
          <Typography 
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              fontSize: '0.95rem',
            }}
          >
            Update status to <strong style={{ color: '#000' }}>{confirmingStatus ? getStatusLabel(confirmingStatus) : ''}</strong>?
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2.5,
            gap: 1.5,
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.01)',
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button 
            onClick={() => setConfirmingStatus(null)} 
            variant="outlined"
            disabled={loading}
            sx={{
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: 2,
              py: 1.2,
              px: 3,
              minWidth: 120,
              borderColor: 'rgba(0, 0, 0, 0.15)',
              color: 'text.primary',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'rgba(0, 0, 0, 0.25)',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmUpdate} 
            variant="contained" 
            color="primary" 
            disabled={loading}
            sx={{
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: 2,
              py: 1.2,
              px: 3,
              minWidth: 140,
              boxShadow: '0 6px 20px rgba(25, 103, 210, 0.4)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 10px 30px rgba(25, 103, 210, 0.5)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            Yes, Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
