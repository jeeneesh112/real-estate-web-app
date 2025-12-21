import { useState, useMemo } from 'react';
import {
  Typography,
  Chip,
  Button,
  Stack,
} from '@mui/material';
import {
  Apartment,
  Layers,
  CheckCircle,
  Business,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Stats, type StatItem } from '../../components/ui/Stats';
import { TowerDetailModal } from '../../components/ui/TowerDetailModal';
import { type Tower } from '../../redux/slices/towerSlice';
import { addTower } from '../../redux/slices/towerSlice';
import { FormModal, type FormFieldConfig } from '../../components/ui/FormModal';
import { towerFormFieldsBase } from '../../config/formConfigs';
import { useToast } from '../../hooks';
import { i18n } from '../../i18n';

export const TowersPage: React.FC = () => {
  const towers = useSelector((state: RootState) => state.tower.towers);
  const projects = useSelector((state: RootState) => state.project.projects);
  const dispatch = useDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Helper to get project name by ID
  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  // Calculate statistics
  const stats: StatItem[] = useMemo(() => {
    const totalFloors = towers.reduce((sum, t) => sum + t.floors, 0);
    const avgFloors = towers.length > 0 ? Math.round(totalFloors / towers.length) : 0;

    return [
      {
        label: 'Total Towers',
        value: towers.length,
        icon: <Apartment fontSize="large" />,
        color: 'primary',
      },
      {
        label: 'Total Floors',
        value: totalFloors,
        icon: <Layers fontSize="large" />,
        color: 'info',
      },
      {
        label: 'Avg. Floors',
        value: avgFloors,
        icon: <Business fontSize="large" />,
        color: 'warning',
      },
      {
        label: 'Active',
        value: towers.filter((t) => !t.deleted_at).length,
        icon: <CheckCircle fontSize="large" />,
        color: 'success',
      },
    ];
  }, [towers]);

  // Define columns with MUI styling
  const columns: DataTableColumn<Tower>[] = [
    {
      field: 'name',
      headerName: 'Tower Name',
      sortable: true,
      searchable: true,
      width: 180,
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.name}
        </Typography>
      ),
    },
    {
      field: 'project_id',
      headerName: 'Project',
      sortable: true,
      searchable: true,
      width: 220,
      render: (row) => (
        <Typography variant="body2">
          {getProjectName(row.project_id)}
        </Typography>
      ),
    },
    {
      field: 'floors',
      headerName: 'Floors',
      sortable: true,
      width: 120,
      align: 'center',
      render: (row) => (
        <Chip
          label={`${row.floors} Floors`}
          size="small"
          variant="outlined"
          color="primary"
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

  // Handle row click - open modal
  const handleRowClick = (tower: Tower) => {
    setSelectedTower(tower);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedTower(null);
  };

  // Simulate loading
  const handleToggleLoading = () => {
    setLoading(!loading);
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
        onClick={() => setOpenFormModal(true)}
        sx={{
          borderRadius: '12px',
          textTransform: 'none',
          fontSize: '0.95rem',
          fontWeight: 600,
          px: 3,
          py: 1.2,
          boxShadow: '0 4px 12px rgba(25, 103, 210, 0.25)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(25, 103, 210, 0.35)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        + New Tower
      </Button>
    </Stack>
  );

  return (
    <PageLayout
      title={i18n.t('client.towersTitle')}
      subtitle="Manage all towers across your projects. Click any row to view details."
      actions={actions}
    >
      {/* Statistics Section */}
      <Stats stats={stats} />

      {/* DataTable */}
      <DataTable
        columns={columns}
        rows={towers}
        loading={loading}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        onRowClick={handleRowClick}
        getRowId={(row) => row.id}
      />

      {/* Tower Detail Modal */}
      {selectedTower && (
        <TowerDetailModal
          open={!!selectedTower}
          onClose={handleCloseModal}
          tower={{
            id: selectedTower.id,
            towerName: selectedTower.name,
            projectName: getProjectName(selectedTower.project_id),
            totalFloors: selectedTower.floors,
            perFloorUnits: selectedTower.units_per_floor || 0,
            totalFlats: (selectedTower.floors * (selectedTower.units_per_floor || 0)),
            totalSellFlats: Math.floor((selectedTower.floors * (selectedTower.units_per_floor || 0)) * 0.6),
            totalRentalFlats: Math.floor((selectedTower.floors * (selectedTower.units_per_floor || 0)) * 0.4),
            availableFlats: Math.floor((selectedTower.floors * (selectedTower.units_per_floor || 0)) * 0.3),
          }}
        />
      )}

      {/* New Tower Form Modal */}
      <FormModal
        open={openFormModal}
        title="Create New Tower"
        fields={(towerFormFieldsBase as FormFieldConfig[]).map((f) =>
          f.name === 'project_id'
            ? {
                ...f,
                options: projects.map((p) => ({ label: p.name, value: p.id })),
              }
            : f
        )}
        onSubmit={async (values) => {
          setFormLoading(true);
          try {
            const payload = {
              project_id: String(values.project_id),
              name: String(values.name),
              image_id: null,
              floors: Number(values.floors),
              units_per_floor: Number(values.units_per_floor),
              created_by: 'system',
            };
            dispatch(addTower(payload));
            toast.success(`Tower "${payload.name}" created successfully`);
            setOpenFormModal(false);
          } finally {
            setFormLoading(false);
          }
        }}
        onClose={() => setOpenFormModal(false)}
        loading={formLoading}
        maxWidth="sm"
        submitLabel="Create"
      />
    </PageLayout>
  );
};
