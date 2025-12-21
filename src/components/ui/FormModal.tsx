import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
} from '@mui/material';
import { useState, useCallback, useMemo } from 'react';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'password';
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  patternMessage?: string;
  options?: Array<{ label: string; value: string | number }>;
  helperText?: string;
  disabled?: boolean;
  defaultValue?: any;
}

export interface FormModalProps {
  open: boolean;
  title: string;
  fields: FormFieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
  onClose: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  fullWidth?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

interface FormErrors {
  [key: string]: string;
}

export const FormModal: React.FC<FormModalProps> = ({
  open,
  title,
  fields,
  initialValues,
  onSubmit,
  onClose,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  fullWidth = true,
  maxWidth = 'sm',
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form values when modal opens or initialValues change
  useMemo(() => {
    if (open) {
      const values: Record<string, any> = {};
      fields.forEach((field) => {
        values[field.name] =
          initialValues?.[field.name] ?? field.defaultValue ?? '';
      });
      setFormValues(values);
      setErrors({});
    }
  }, [open, initialValues, fields]);

  // Validate a single field
  const validateField = useCallback(
    (fieldName: string, value: any): string | null => {
      const field = fields.find((f) => f.name === fieldName);
      if (!field) return null;

      // Check required
      if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        return `${field.label} is required`;
      }

      // Skip other validations if value is empty and not required
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return null;
      }

      // Check minLength
      if (field.minLength && value.length < field.minLength) {
        return `${field.label} must be at least ${field.minLength} characters`;
      }

      // Check maxLength
      if (field.maxLength && value.length > field.maxLength) {
        return `${field.label} must not exceed ${field.maxLength} characters`;
      }

      // Check min (for numbers)
      if (field.min !== undefined && Number(value) < field.min) {
        return `${field.label} must be at least ${field.min}`;
      }

      // Check max (for numbers)
      if (field.max !== undefined && Number(value) > field.max) {
        return `${field.label} must not exceed ${field.max}`;
      }

      // Check pattern (regex)
      if (field.pattern && !field.pattern.test(value)) {
        return field.patternMessage || `${field.label} has invalid format`;
      }

      // Check email
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return `${field.label} must be a valid email address`;
        }
      }

      return null;
    },
    [fields]
  );

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(field.name, formValues[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [fields, formValues, validateField]);

  // Handle field change
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error || '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formValues);
      setFormValues({});
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Render a single form field
  const renderField = (field: FormFieldConfig) => {
    const key = field.name;
    const value = formValues[field.name] ?? '';
    const error = errors[field.name];
    const hasError = !!error;

    if (field.type === 'select') {
      return (
        <FormControl
          key={key}
          fullWidth
          error={hasError}
          disabled={field.disabled || loading}
        >
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={value}
            label={field.label}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          >
            {field.options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {hasError && <FormHelperText>{error}</FormHelperText>}
          {field.helperText && !hasError && (
            <FormHelperText>{field.helperText}</FormHelperText>
          )}
        </FormControl>
      );
    }

    return (
      <TextField
        key={key}
        fullWidth
        label={field.label}
        type={field.type}
        value={value}
        onChange={(e) => handleFieldChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        multiline={field.multiline}
        rows={field.rows}
        disabled={field.disabled || loading}
        error={hasError}
        helperText={error || field.helperText}
        inputProps={{
          maxLength: field.maxLength,
          min: field.min,
          max: field.max,
        }}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      disableEscapeKeyDown={isSubmitting}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {fields.map((field) => (
            <Box key={field.name}>
              {renderField(field)}
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={isSubmitting || loading}
          variant="outlined"
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || loading}
          variant="contained"
          startIcon={isSubmitting || loading ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting || loading ? 'Saving...' : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormModal;
