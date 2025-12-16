import { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  Chip,
  Button,
  Stack,
} from '@mui/material';
import {
  Home,
  CheckCircle,
  Sell,
  Key,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Stats, type StatItem } from '../../components/ui/Stats';
import { type Flat } from '../../redux/slices/flatSlice';
import { i18n } from '../../i18n';

export const FlatsPage: React.FC = () => {
  const flats = useSelector((state: RootState) => state.flat.flats);
  const towers = useSelector((state: RootState) => state.tower.towers);
  const projects = useSelector((state: RootState) => state.project.projects);
  const [loading, setLoading] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);

  // Helper to get tower and project names
  const getTowerName = (towerId: string) => {
    const tower = towers.find((t) => t.id === towerId);
    return tower ? tower.name : 'Unknown Tower';
  };

  const getProjectName = (towerId: string) => {
    const tower = towers.find((t) => t.id === towerId);
    if (tower) {
      const project = projects.find((p) => p.id === tower.project_id);
      return project ? project.name : 'Unknown Project';
    }
    return 'Unknown Project';
  };

  // Helper to determine flat availability type
  const getAvailabilityType = (flat: Flat): string => {
    const hasPrice = flat.price !== null;
    const hasRent = flat.rent !== null;
    
    if (hasPrice && hasRent) return 'BOTH';
    if (hasPrice) return 'FOR SALE';
    if (hasRent) return 'FOR RENT';
    return 'N/A';
  };

  // Helper to determine flat status
  const getFlatStatus = (flat: Flat): string => {
    if (flat.deleted_at) return 'SOLD';
    if (flat.rent !== null && flat.price === null) return 'RENTED';
    if (flat.price !== null || flat.rent !== null) return 'AVAILABLE';
    return 'UNAVAILABLE';
  };

  // Calculate statistics
  const stats: StatItem[] = useMemo(() => {
    const availableCount = flats.filter((f) => getFlatStatus(f) === 'AVAILABLE').length;
    const soldCount = flats.filter((f) => getFlatStatus(f) === 'SOLD').length;
    const rentedCount = flats.filter((f) => getFlatStatus(f) === 'RENTED').length;
    const forSaleCount = flats.filter((f) => {
      const type = getAvailabilityType(f);
      return type === 'FOR SALE' || type === 'BOTH';
    }).length;
    const forRentCount = flats.filter((f) => {
      const type = getAvailabilityType(f);
      return type === 'FOR RENT' || type === 'BOTH';
    }).length;

    return [
      {
        label: 'Total Flats',
        value: flats.length,
        icon: <Home fontSize="large" />,
        color: 'primary',
      },
      {
        label: 'For Sale',
        value: forSaleCount,
        icon: <Sell fontSize="large" />,
        color: 'success',
      },
      {
        label: 'For Rent',
        value: forRentCount,
        icon: <Key fontSize="large" />,
        color: 'warning',
      },
      {
        label: 'Sold/Rented',
        value: soldCount + rentedCount,
        icon: <CheckCircle fontSize="large" />,
        color: 'info',
      },
    ];
  }, [flats]);

  // Define columns with MUI styling
  const columns: DataTableColumn<Flat>[] = [
    {
      field: 'id',
      headerName: 'Flat ID',
      sortable: true,
      searchable: true,
      width: 140,
    },
    {
      field: 'tower_id',
      headerName: 'Project',
      sortable: true,
      searchable: true,
      width: 200,
      render: (row) => (
        <Typography variant="body2">
          {getProjectName(row.tower_id)}
        </Typography>
      ),
    },
    {
      field: 'tower_id',
      headerName: 'Tower',
      sortable: true,
      searchable: true,
      width: 160,
      render: (row) => (
        <Typography variant="body2">
          {getTowerName(row.tower_id)}
        </Typography>
      ),
    },
    {
      field: 'flat_type',
      headerName: 'Type',
      sortable: true,
      width: 100,
      align: 'center',
      render: (row) => (
        <Chip
          label={row.flat_type}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      field: 'size_sqft',
      headerName: 'Area (sqft)',
      sortable: true,
      width: 120,
      align: 'center',
      render: (row) => (
        <Typography variant="body2">
          {row.size_sqft ? row.size_sqft.toLocaleString() : 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'id',
      headerName: 'Availability',
      sortable: false,
      width: 120,
      align: 'center',
      render: (row) => {
        const type = getAvailabilityType(row);
        return (
          <Chip
            label={type}
            size="small"
            color={
              type === 'BOTH'
                ? 'secondary'
                : type === 'FOR SALE'
                ? 'success'
                : type === 'FOR RENT'
                ? 'warning'
                : 'default'
            }
            variant="filled"
          />
        );
      },
    },
    {
      field: 'price',
      headerName: 'Sale Price',
      sortable: true,
      width: 130,
      align: 'right',
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.price ? `₹${(row.price / 100000).toFixed(2)}L` : '—'}
        </Typography>
      ),
    },
    {
      field: 'rent',
      headerName: 'Rent/Month',
      sortable: true,
      width: 130,
      align: 'right',
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.rent ? `₹${(row.rent / 1000).toFixed(0)}K` : '—'}
        </Typography>
      ),
    },
    {
      field: 'id',
      headerName: 'Status',
      sortable: false,
      width: 120,
      align: 'center',
      render: (row) => {
        const status = getFlatStatus(row);
        return (
          <Chip
            label={status}
            size="small"
            color={
              status === 'AVAILABLE'
                ? 'success'
                : status === 'SOLD'
                ? 'info'
                : 'warning'
            }
            variant="outlined"
          />
        );
      },
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

  // Handle row click - navigate to flat detail
  const handleRowClick = (flat: Flat) => {
    setSelectedFlat(flat);
    console.log('Selected flat:', flat);
    // TODO: Navigate to flat detail page or 3D tour
    // navigate(`/client/flats/${flat.id}`);
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
        + New Flat
      </Button>
    </Stack>
  );

  return (
    <PageLayout
      title={i18n.t('client.flatsTitle')}
      subtitle="Manage all flats across towers and projects. Click any row to view details."
      actions={actions}
    >
      {/* Statistics Section */}
      <Stats stats={stats} />

      {/* Selected Flat Info */}
      {selectedFlat && (
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
            <strong>Selected Flat:</strong> {selectedFlat.id} - {getTowerName(selectedFlat.tower_id)}, {getProjectName(selectedFlat.tower_id)} ({selectedFlat.flat_type}, {selectedFlat.size_sqft} sqft)
            {selectedFlat.price && selectedFlat.rent && (
              <span> | Sale: ₹{(selectedFlat.price / 100000).toFixed(2)}L | Rent: ₹{(selectedFlat.rent / 1000).toFixed(0)}K/mo</span>
            )}
            {selectedFlat.price && !selectedFlat.rent && (
              <span> | Sale Price: ₹{(selectedFlat.price / 100000).toFixed(2)}L</span>
            )}
            {!selectedFlat.price && selectedFlat.rent && (
              <span> | Rent: ₹{(selectedFlat.rent / 1000).toFixed(0)}K/mo</span>
            )}
          </Typography>
        </Box>
      )}

      {/* DataTable */}
      <DataTable<Flat>
        columns={columns}
        rows={flats}
        loading={loading}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        onRowClick={handleRowClick}
        getRowId={(row) => row.id}
      />
    </PageLayout>
  );
};
