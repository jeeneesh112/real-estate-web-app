import { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Home,
  CheckCircle,
  Sell,
  Key,
  MoreVert,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Stats, type StatItem } from '../../components/ui/Stats';
import { type Flat, addFlat, updateFlatStatus } from '../../redux/slices/flatSlice';
import { FormModal, type FormFieldConfig } from '../../components/ui/FormModal';
import { ChangeStatusModal } from '../../components/ui/ChangeStatusModal';
import { flatFormFieldsBase } from '../../config/formConfigs';
import { useToast } from '../../hooks';
import { i18n } from '../../i18n';

export const FlatsPage: React.FC = () => {
  const flats = useSelector((state: RootState) => state.flat.flats);
  const towers = useSelector((state: RootState) => state.tower.towers);
  const projects = useSelector((state: RootState) => state.project.projects);
  const dispatch = useDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFlatForAction, setSelectedFlatForAction] = useState<Flat | null>(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<'sold' | 'rental' | 'available'>('available');

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
      field: 'id' as keyof Flat,
      headerName: 'Flat ID',
      sortable: true,
      searchable: true,
      width: 140,
    },
    {
      field: 'tower_id' as keyof Flat,
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
      field: 'floor' as keyof Flat,
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
      field: 'flat_type' as keyof Flat,
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
      field: 'size_sqft' as keyof Flat,
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
      field: 'gallery_json' as keyof Flat,
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
    } as any,
    {
      field: 'price' as keyof Flat,
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
      field: 'rent' as keyof Flat,
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
      field: 'status' as keyof Flat,
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
      field: 'created_at' as keyof Flat,
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
    {
      field: 'modified_at' as keyof Flat,
      headerName: 'Actions',
      sortable: false,
      width: 80,
      align: 'center',
      render: (row: Flat) => (
        <IconButton
          size="small"
          onClick={(e) => handleActionMenuOpen(e, row)}
          sx={{ color: 'text.secondary' }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      ),
    } as any,
  ];

  // Handle row click - navigate to flat detail
  const handleRowClick = (flat: Flat) => {
    setSelectedFlat(flat);
    console.log('Selected flat:', flat);
    // TODO: Navigate to flat detail page or 3D tour
    // navigate(`/client/flats/${flat.id}`);
  };

  // Action menu handlers
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, flat: Flat) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedFlatForAction(flat);
  };

  const handleActionMenuClose = () => {
    setAnchorEl(null);
    setSelectedFlatForAction(null);
  };

  const handleChangeStatusClick = () => {
    if (selectedFlatForAction) {
      setNewStatus(selectedFlatForAction.status);
      setOpenStatusDialog(true);
      setAnchorEl(null);
    }
  };

  const handleStatusDialogClose = () => {
    setOpenStatusDialog(false);
  };

  const handleStatusChange = (status: 'sold' | 'rental' | 'available') => {
    if (selectedFlatForAction) {
      dispatch(updateFlatStatus({ id: selectedFlatForAction.id, status }));
      const statusLabels = { sold: 'Sold', rental: 'Rented', available: 'Available' };
      toast.success(`Flat status updated to ${statusLabels[status]}`);
      setOpenStatusDialog(false);
      setSelectedFlatForAction(null);
    }
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
      <Button variant="contained" color="primary" onClick={() => setOpenFormModal(true)}>
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
      <DataTable
        columns={columns}
        rows={flats}
        loading={loading}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        onRowClick={handleRowClick}
        getRowId={(row) => row.id}
      />

      {/* New Flat Form Modal */}
      <FormModal
        open={openFormModal}
        title="Create New Flat"
        fields={(flatFormFieldsBase as FormFieldConfig[]).map((f) =>
          f.name === 'tower_id'
            ? {
                ...f,
                options: towers.map((t) => ({
                  label: `${t.name} (${projects.find((p) => p.id === t.project_id)?.name || 'Unknown'})`,
                  value: t.id,
                })),
              }
            : f
        )}
        onSubmit={async (values) => {
          setFormLoading(true);
          try {
            const tower = towers.find((t) => t.id === values.tower_id);
            const payload = {
              tower_id: String(values.tower_id),
              flat_type: String(values.flat_type),
              floor: Number(values.floor),
              size_sqft: Number(values.size_sqft),
              price: values.price ? Number(values.price) : null,
              rent: values.rent ? Number(values.rent) : null,
              status: String(values.status) as 'sold' | 'rental' | 'available',
              created_by: 'system',
            };
            dispatch(addFlat(payload));
            toast.success(`Flat (${payload.flat_type}) created in ${tower?.name || 'Tower'}`);
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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={handleChangeStatusClick}>
          Change Status
        </MenuItem>
      </Menu>

      {/* Status Change Modal */}
      <ChangeStatusModal
        open={openStatusDialog}
        selectedStatus={newStatus}
        onStatusChange={setNewStatus}
        onClose={handleStatusDialogClose}
        onConfirm={handleStatusChange}
        title={`Change Status: ${selectedFlatForAction?.id || ''}`}
        subtitle={selectedFlatForAction?.flat_type ? `Type: ${selectedFlatForAction.flat_type}` : undefined}
        loading={false}
        flatId={selectedFlatForAction?.id}
        flatType={selectedFlatForAction?.flat_type}
      />
    </PageLayout>
  );
};
