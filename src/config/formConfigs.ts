import type { FormFieldConfig } from '../../components/ui/FormModal';

// Project form field configuration with all validations
export const projectFormFields: FormFieldConfig[] = [
  {
    name: 'name',
    label: 'Project Name',
    type: 'text',
    required: true,
    placeholder: 'Enter project name',
    minLength: 3,
    maxLength: 100,
    helperText: 'Project name must be 3-100 characters',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: true,
    placeholder: 'Enter detailed project description',
    minLength: 10,
    maxLength: 1000,
    multiline: true,
    rows: 4,
    helperText: 'Description must be 10-1000 characters',
  },
  {
    name: 'type',
    label: 'Project Type',
    type: 'select',
    required: true,
    helperText: 'Select whether project is for buying, renting, or both',
    options: [
      { label: 'For Sale (Buy)', value: 'BUY' },
      { label: 'For Rent', value: 'RENT' },
      { label: 'Both Buy & Rent', value: 'BOTH' },
    ],
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    required: true,
    placeholder: 'e.g., Mumbai, Pune, Bangalore',
    minLength: 2,
    maxLength: 50,
    helperText: 'City where the project is located',
  },
  {
    name: 'lat',
    label: 'Latitude',
    type: 'number',
    required: true,
    placeholder: 'e.g., 19.0760',
    min: -90,
    max: 90,
    helperText: 'Geographic latitude coordinate (-90 to 90)',
  },
  {
    name: 'lng',
    label: 'Longitude',
    type: 'number',
    required: true,
    placeholder: 'e.g., 72.8777',
    min: -180,
    max: 180,
    helperText: 'Geographic longitude coordinate (-180 to 180)',
  },
];

export default projectFormFields;
