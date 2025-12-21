import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  SxProps,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import React from 'react';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message?: string;
  children?: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  isDangerous?: boolean;
  icon?: React.ReactNode;
  contentSx?: SxProps;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  title,
  message,
  children,
  onCancel,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  isDangerous = false,
  icon,
  contentSx,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
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
      {/* Close Button */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={onCancel}
          size="small"
          disabled={loading}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
            },
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          pt: 4,
          pb: 3,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          ...contentSx,
        }}
      >
        {/* Icon */}
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: isDangerous ? 'rgba(244, 67, 54, 0.1)' : 'rgba(25, 103, 210, 0.1)',
              color: isDangerous ? 'error.main' : 'primary.main',
              mb: 2.5,
              fontSize: '2.5rem',
            }}
          >
            {icon}
          </Box>
        )}

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: '1.8rem',
            mb: 1.5,
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>

        {/* Message */}
        {message && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: children ? 2 : 0,
              lineHeight: 1.7,
              fontSize: '1rem',
              letterSpacing: 0.3,
            }}
          >
            {message}
          </Typography>
        )}

        {/* Children */}
        {children}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          gap: 1.5,
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.01)',
          flexDirection: 'column',
          display: 'flex',
        }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          disabled={loading}
          fullWidth
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            py: 1.4,
            borderColor: 'rgba(0, 0, 0, 0.15)',
            color: 'text.primary',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.25)',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={isDangerous ? 'error' : 'primary'}
          disabled={loading}
          fullWidth
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 2,
            py: 1.4,
            boxShadow: isDangerous
              ? '0 6px 20px rgba(244, 67, 54, 0.4)'
              : '0 6px 20px rgba(25, 103, 210, 0.4)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: isDangerous
                ? '0 10px 30px rgba(244, 67, 54, 0.5)'
                : '0 10px 30px rgba(25, 103, 210, 0.5)',
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
