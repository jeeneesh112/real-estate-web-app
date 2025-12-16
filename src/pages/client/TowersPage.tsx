import { useState, useMemo } from 'react';
import {
  Typography,
  Box,
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
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Stats, type StatItem } from '../../components/ui/Stats';
import { type Tower } from '../../redux/slices/towerSlice';
import { i18n } from '../../i18n';

export const TowersPage: React.FC = () => {
  const towers = useSelector((state: RootState) => state.tower.towers);
  const projects = useSelector((state: RootState) => state.project.projects);
  const [loading, setLoading] = useState(false);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);

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

  // Handle row click - navigate to tower detail
  const handleRowClick = (tower: Tower) => {
    setSelectedTower(tower);
    console.log('Selected tower:', tower);
    // TODO: Navigate to tower detail page or flats page
    // navigate(`/client/towers/${tower.id}/flats`);
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
      <Button variant="contained" color="primary">
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

      {/* Selected Tower Info */}
      {selectedTower && (
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
            <strong>Selected Tower:</strong> {selectedTower.name} - {getProjectName(selectedTower.project_id)} ({selectedTower.floors} Floors)
          </Typography>
        </Box>
      )}

      {/* DataTable */}
      <DataTable<Tower>
        columns={columns}
        rows={towers}
        loading={loading}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        onRowClick={handleRowClick}
        getRowId={(row) => row.id}
      />
    </PageLayout>
  );
};
