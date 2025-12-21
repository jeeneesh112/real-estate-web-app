import { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  Chip,
  Button,
  Stack,
} from '@mui/material';
import {
  Business,
  Sell,
  Key,
  CheckCircle,
  AddCircleOutline,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Stats, type StatItem } from '../../components/ui/Stats';
import { FormModal, type FormFieldConfig } from '../../components/ui/FormModal';
import { type Project } from '../../redux/slices/projectSlice';
import { projectFormFields } from '../../config/formConfigs';
import { useToast } from '../../hooks/useToast';
import { i18n } from '../../i18n';

export const ProjectsPage: React.FC = () => {
  const projects = useSelector((state: RootState) => state.project.projects);
  // const dispatch = useDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Calculate statistics
  const stats: StatItem[] = useMemo(() => [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: <Business fontSize="large" />,
      color: 'primary',
    },
    {
      label: 'For Sale',
      value: projects.filter((p) => p.type === 'BUY' || p.type === 'BOTH').length,
      icon: <Sell fontSize="large" />,
      color: 'info',
    },
    {
      label: 'For Rent',
      value: projects.filter((p) => p.type === 'RENT' || p.type === 'BOTH').length,
      icon: <Key fontSize="large" />,
      color: 'warning',
    },
    {
      label: 'Active',
      value: projects.filter((p) => !p.deleted_at).length,
      icon: <CheckCircle fontSize="large" />,
      color: 'success',
    },
  ], [projects]);

  // Define columns with MUI styling
  const columns: DataTableColumn<Project>[] = [
    {
      field: 'name',
      headerName: 'Project Name',
      sortable: true,
      searchable: true,
      width: 220,
    },
    {
      field: 'city',
      headerName: 'City',
      sortable: true,
      searchable: true,
      width: 140,
    },
    {
      field: 'type',
      headerName: 'Type',
      sortable: true,
      width: 140,
      align: 'center',
      render: (row) => (
        <Chip
          label={row.type}
          size="small"
          variant="outlined"
          color={
            row.type === 'BUY'
              ? 'primary'
              : row.type === 'RENT'
              ? 'warning'
              : 'secondary'
          }
        />
      ),
    },
    {
      field: 'deleted_at',
      headerName: 'Status',
      sortable: true,
      width: 120,
      align: 'center',
      render: (row) => (
        <Chip
          label={row.deleted_at ? 'Archived' : 'Active'}
          size="small"
          color={row.deleted_at ? 'error' : 'success'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created Date',
      sortable: true,
      width: 160,
      align: 'center',
      render: (row) => (
        <Typography variant="body2">
          {new Date(row.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Typography>
      ),
    },
  ];

  // Handle row click - navigate to project detail
  const handleRowClick = (project: Project) => {
    setSelectedProject(project);
    console.log('Selected project:', project);
    // TODO: Navigate to project detail page
    // navigate(`/client/projects/${project.id}`);
  };

  // Simulate loading
  const handleToggleLoading = () => {
    setLoading(!loading);
  };

  // Handle new project form submission
  const handleFormSubmit = async (values: Record<string, any>) => {
    setFormLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      console.log('New project submitted:', values);
      // TODO: Dispatch action to add project to Redux store
      // dispatch(addProject({...values, id: generateId(), created_at: new Date().toISOString(), ...}));
      
      toast.success(`Project "${values.name}" created successfully!`);
      setOpenFormModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  // Action buttons
  const actions = (
    <Stack direction="row" spacing={1}>
      <Button
        size="small"
        variant="outlined"
        onClick={handleToggleLoading}
      >
        {loading ? '⏹ Loading' : '▶ Demo'}
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleOutline />}
        onClick={() => setOpenFormModal(true)}
      >
        New Project
      </Button>
    </Stack>
  );

  return (
    <PageLayout
      title={i18n.t('client.projectsTitle')}
      subtitle="Manage and monitor all your real estate projects. Click any row to view details."
      actions={actions}
    >
      {/* Statistics Section */}
      <Stats stats={stats} />

      {/* Selected Project Info */}
      {selectedProject && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: '#e3f2fd',
            borderRadius: 1,
            borderLeft: '4px solid',
            borderLeftColor: 'primary.main',
          }}
        >
          <Typography variant="body2">
            <strong>Selected Project:</strong> {selectedProject.name} ({selectedProject.city})
          </Typography>
        </Box>
      )}

      {/* DataTable */}
      <DataTable<Project>
        columns={columns}
        rows={projects}
        loading={loading}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        onRowClick={handleRowClick}
        getRowId={(row) => row.id}
      />

      {/* New Project Form Modal */}
      <FormModal
        open={openFormModal}
        title="Create New Project"
        fields={projectFormFields}
        onSubmit={handleFormSubmit}
        onClose={() => setOpenFormModal(false)}
        loading={formLoading}
        maxWidth="sm"
      />
    </PageLayout>
  );
};
