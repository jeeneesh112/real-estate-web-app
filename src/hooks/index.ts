import { useContext } from 'react';
import { ToastContext } from '../components/ui/ToastProvider';

/**
 * Custom hook to show toast notifications
 * 
 * Usage:
 * const toast = useToast();
 * toast.success('Operation completed!');
 * toast.error('Something went wrong');
 * toast.warning('Please check your input');
 * toast.info('Here is some info');
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

export default useToast;
