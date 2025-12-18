import React, { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Typography,
  Button,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Event,
  CheckCircle,
  HourglassEmpty,
  TaskAlt,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Stats, type StatItem } from '../../components/ui/Stats';
import { type BookedAppointment } from '../../redux/slices/bookedAppointmentSlice';
import { getProjectById } from '../../redux/slices/projectSlice';
import { getTowerById } from '../../redux/slices/towerSlice';
import { getFlatById } from '../../redux/slices/flatSlice';

type EnrichedAppointment = BookedAppointment & {
  flatType: string;
  towerName: string;
  projectName: string;
};

export const AppointmentsPage: React.FC = () => {
  const state = useSelector((state: RootState) => state);
  const appointments = state.bookedAppointment?.appointments || [];
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<EnrichedAppointment | null>(null);


  // Enrich appointments with flat/tower/project details
  const enrichedAppointments: EnrichedAppointment[] = useMemo(() => {
    if (!Array.isArray(appointments)) return [];

    return appointments.map((appointment) => {
      const project = getProjectById(state, appointment.project_id);
      const tower = getTowerById(state, appointment.tower_id);
      const flat = getFlatById(state, appointment.flat_id);

      return {
        ...appointment,
        flatType: flat?.flat_type || 'N/A',
        towerName: tower?.name || 'Unknown Tower',
        projectName: project?.name || 'Unknown Project',
      };
    });
  }, [appointments, state]);

  // Calculate stats
  const stats: StatItem[] = useMemo(() => {
    if (!Array.isArray(appointments)) return [];

    const total = appointments.length;
    const upcoming = appointments.filter((a) => a.status === 'UPCOMING').length;
    const completed = appointments.filter((a) => a.status === 'COMPLETED').length;
    const cancelled = appointments.filter((a) => a.status === 'CANCELLED').length;

    return [
      {
        label: 'Total Appointments',
        value: total,
        icon: <Event fontSize="large" />,
        color: 'primary',
      },
      {
        label: 'Upcoming',
        value: upcoming,
        icon: <CheckCircle fontSize="large" />,
        color: 'success',
      },
      {
        label: 'Completed',
        value: completed,
        icon: <TaskAlt fontSize="large" />,
        color: 'secondary',
      },
      {
        label: 'Cancelled',
        value: cancelled,
        icon: <HourglassEmpty fontSize="large" />,
        color: 'error',
      },
    ];
  }, [appointments]);

  // Status chip renderer
  const getStatusChip = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'info' as const, label: 'Pending' },
      UPCOMING: { color: 'success' as const, label: 'Upcoming' },
      CANCELLED: { color: 'error' as const, label: 'Cancelled' },
      COMPLETED: { color: 'secondary' as const, label: 'Completed' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <Chip
        label={config.label}
        size="small"
        color={config.color}
        variant="outlined"
      />
    );
  };

  // DataTable columns
  const columns: DataTableColumn<EnrichedAppointment>[] = [
    {
      field: 'id',
      headerName: 'ID',
      sortable: true,
      width: 70,
      align: 'center',
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          #{row.id}
        </Typography>
      ),
    },
    {
      field: 'userName',
      headerName: 'User',
      sortable: true,
      searchable: true,
      width: 200,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mr: 1,
              backgroundColor: 'primary.main',
              fontSize: '0.875rem',
            }}
          >
            {row.userName?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.userName || 'Unknown User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.userEmail || ''}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'projectName',
      headerName: 'Project',
      sortable: true,
      searchable: true,
      width: 180,
      render: (row) => (
        <Typography variant="body2" fontWeight={500}>
          {row.projectName}
        </Typography>
      ),
    },
    {
      field: 'towerName',
      headerName: 'Tower',
      sortable: true,
      width: 140,
      render: (row) => (
        <Typography variant="body2">
          {row.towerName}
        </Typography>
      ),
    },
    {
      field: 'flatType',
      headerName: 'Flat Type',
      sortable: true,
      width: 120,
    //   align: 'center',
      render: (row) => (
        <Chip
          label={row.flatType}
          size="small"
          color="secondary"
          variant="outlined"
        />
      ),
    },
    {
      field: 'visit_date',
      headerName: 'Visit Date',
      sortable: true,
      width: 150,
      render: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {new Date(row.visit_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(row.visit_date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      width: 120,
      align: 'center',
      render: (row) => getStatusChip(row.status),
    },
  ];

  // Handle row click
  const handleRowClick = (appointment: EnrichedAppointment) => {
    setSelectedAppointment(appointment);
    console.log('Appointment clicked:', appointment);
  };

  // Simulate loading toggle
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
        + New Appointment
      </Button>
    </Stack>
  );

  return (
    <PageLayout
      title="Appointments"
      subtitle="Manage all appointments. Click any row to view details."
      actions={actions}
    >
      {/* Statistics Section */}
      <Stats stats={stats} />

      {/* Selected Appointment Info */}
      {selectedAppointment && (
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
            <strong>Selected:</strong> {selectedAppointment.userName} - {selectedAppointment.projectName} / {selectedAppointment.towerName} ({selectedAppointment.flatType}) on{' '}
            {new Date(selectedAppointment.visit_date).toLocaleDateString()}
          </Typography>
        </Box>
      )}

      {/* DataTable */}
      <DataTable<EnrichedAppointment>
        columns={columns}
        rows={enrichedAppointments}
        loading={loading}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        onRowClick={handleRowClick}
        getRowId={(row) => String(row.id)}
      />
    </PageLayout>
  );
};
