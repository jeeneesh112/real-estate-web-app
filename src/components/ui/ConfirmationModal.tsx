import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  SxProps,
} from '@mui/material';
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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '1.4rem',
          fontWeight: 700,
          pb: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDangerous ? 'error.main' : 'primary.main',
            }}
          >
            {icon}
          </Box>
        )}
        {title}
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5, ...contentSx }}>
        {message && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              lineHeight: 1.6,
              fontSize: '0.95rem',
            }}
          >
            {message}
          </Typography>
        )}
        {children}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          gap: 1,
          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          backgroundColor: 'rgba(0, 0, 0, 0.01)',
        }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 500,
            borderColor: 'rgba(0, 0, 0, 0.12)',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.2)',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
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
          sx={{
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            minWidth: 100,
            boxShadow: isDangerous
              ? '0 4px 12px rgba(244, 67, 54, 0.3)'
              : '0 4px 12px rgba(33, 150, 243, 0.3)',
            '&:hover': {
              boxShadow: isDangerous
                ? '0 6px 16px rgba(244, 67, 54, 0.4)'
                : '0 6px 16px rgba(33, 150, 243, 0.4)',
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
