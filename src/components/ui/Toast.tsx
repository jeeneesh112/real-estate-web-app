import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { useState, useEffect, createContext } from 'react';
import {
  CheckCircle,
  Error,
  Warning,
  Close,
  Info,
} from '@mui/icons-material';
import React from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // milliseconds, default 5000
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

export interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastConfig = {
  success: {
    bgColor: '#000',
    icon: CheckCircle,
    iconColor: '#10b981',
    label: 'Success',
  },
  error: {
    bgColor: '#000',
    icon: Error,
    iconColor: '#ef4444',
    label: 'Error',
  },
  warning: {
    bgColor: '#000',
    icon: Warning,
    iconColor: '#f59e0b',
    label: 'Warning',
  },
  info: {
    bgColor: '#000',
    icon: Info,
    iconColor: '#3b82f6',
    label: 'Info',
  },
};

export const ToastItem: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => onClose(id), 300); // Allow animation to finish
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <Collapse in={isOpen} timeout={300}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          backgroundColor: config.bgColor,
          color: '#fff',
          padding: '14px 20px',
          borderRadius: 2.5,
          marginBottom: 2,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          minWidth: '340px',
          maxWidth: '420px',
          animation: 'slideIn 0.3s ease-out',
          backdropFilter: 'blur(10px)',
          '@keyframes slideIn': {
            from: {
              transform: 'translateX(450px)',
              opacity: 0,
            },
            to: {
              transform: 'translateX(0)',
              opacity: 1,
            },
          },
        }}
      >
        <Icon sx={{ fontSize: '1.4rem', flexShrink: 0, color: config.iconColor }} />
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            flex: 1,
            wordBreak: 'break-word',
            fontSize: '0.95rem',
            lineHeight: 1.5,
          }}
        >
          {message}
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: '#fff',
            padding: 0.25,
            minWidth: 28,
            minHeight: 28,
            flexShrink: 0,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>
    </Collapse>
  );
};

export default ToastItem;

// ============= TOAST PROVIDER =============

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = React.useCallback(
    (message: string, type: ToastType, duration = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration + 300);

      return () => clearTimeout(timer);
    },
    []
  );

  const success = React.useCallback(
    (message: string, duration = 5000) =>
      showToast(message, 'success', duration),
    [showToast]
  );

  const error = React.useCallback(
    (message: string, duration = 5000) =>
      showToast(message, 'error', duration),
    [showToast]
  );

  const warning = React.useCallback(
    (message: string, duration = 5000) =>
      showToast(message, 'warning', duration),
    [showToast]
  );

  const info = React.useCallback(
    (message: string, duration = 5000) =>
      showToast(message, 'info', duration),
    [showToast]
  );

  const value: ToastContextType = {
    showToast,
    success,
    error,
    warning,
    info,
  };

  const handleRemoveToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container - Fixed position at top right */}
      <Box
        sx={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            pointerEvents: 'auto',
          }}
        >
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              {...toast}
              onClose={handleRemoveToast}
            />
          ))}
        </Box>
      </Box>
    </ToastContext.Provider>
  );
};
