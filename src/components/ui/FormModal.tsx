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
  Stack,
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
  order?: number; // Group fields with same order in one row (2 fields per row)
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
          <InputLabel sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
            {field.label}
          </InputLabel>
          <Select
            value={value}
            label={field.label}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            sx={{
              borderRadius: 1.5,
              fontSize: '0.95rem',
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.3s ease',
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                  borderWidth: 2,
                },
              },
            }}
          >
            {field.options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {hasError && (
            <FormHelperText sx={{ marginLeft: 0, marginTop: '6px', fontSize: '0.8rem' }}>
              {error}
            </FormHelperText>
          )}
          {field.helperText && !hasError && (
            <FormHelperText sx={{ marginLeft: 0, marginTop: '6px', fontSize: '0.8rem' }}>
              {field.helperText}
            </FormHelperText>
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
          style: { textAlign: 'left' },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1.5,
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            '&:hover fieldset': {
              borderColor: '#667eea',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#667eea',
              borderWidth: 2,
            },
          },
          '& .MuiInputBase-input': {
            padding: '12px 14px',
          },
          '& .MuiFormLabel-root': {
            fontWeight: 400,
            fontSize: '0.9rem',
            color: '#333',
            '&.Mui-focused': {
              color: '#667eea',
            },
          },
          '& .MuiFormHelperText-root': {
            marginLeft: 0,
            marginTop: '6px',
            fontSize: '0.8rem',
          },
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
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: '1.5rem',
          pb: 2,
          pt: 3,
          px: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          borderRadius: '8px 8px 0 0',
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{ pt: 0, px: 3, pb: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {(() => {
            const rows: FormFieldConfig[][] = [];
            const processed = new Set<string>();

            fields.forEach((field) => {
              // Skip if already processed
              if (processed.has(field.name)) return;

              // If field has an order, find all fields with same order
              if (field.order !== undefined) {
                const fieldsWithSameOrder = fields.filter(
                  (f) => f.order === field.order && !processed.has(f.name)
                );

                if (fieldsWithSameOrder.length > 1) {
                  // Multiple fields with same order - add as one row
                  rows.push(fieldsWithSameOrder);
                  fieldsWithSameOrder.forEach((f) => processed.add(f.name));
                } else {
                  // Single field with order - takes full width
                  rows.push([field]);
                  processed.add(field.name);
                }
              } else {
                // No order - takes full width
                rows.push([field]);
                processed.add(field.name);
              }
            });

            return rows.map((row, rowIdx) => (
              <Stack key={rowIdx} direction="row" spacing={2}>
                {row.map((field) => (
                  <Box
                    key={field.name}
                    sx={{
                      flex: row.length > 1 ? `0 0 calc(50% - 4px)` : 1,
                    }}
                  >
                    {renderField(field)}
                  </Box>
                ))}
              </Stack>
            ));
          })()}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1.5 }}>
        <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
          <Button
            onClick={handleClose}
            disabled={isSubmitting || loading}
            variant="outlined"
            sx={{
              flex: 1,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              borderColor: '#e0e0e0',
              color: '#666',
              borderWidth: 2,
              '&:hover': {
                borderColor: '#999',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || loading}
            variant="contained"
            startIcon={isSubmitting || loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : null}
            sx={{
              flex: 1,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isSubmitting || loading ? 'Saving...' : submitLabel}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default FormModal;
