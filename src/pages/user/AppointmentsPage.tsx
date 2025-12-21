import { useMemo, type ReactElement } from 'react';
import { Typography, Chip } from '@mui/material';
import { EventAvailable, CheckCircle, Cancel, CalendarToday } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Stats, type StatItem } from '../../components/ui/Stats';
import { Appointment, AppointmentStatus } from '../../redux/slices/appointmentSlice';
import { i18n } from '../../i18n';

const statusConfig: Record<AppointmentStatus, { label: string; color: 'primary' | 'success' | 'error'; icon: ReactElement }> = {
  UPCOMING: { label: 'Upcoming', color: 'primary', icon: <CalendarToday fontSize="small" /> },
  COMPLETED: { label: 'Completed', color: 'success', icon: <CheckCircle fontSize="small" /> },
  CANCELLED: { label: 'Cancelled', color: 'error', icon: <Cancel fontSize="small" /> },
};

export const AppointmentsPage: React.FC = () => {
  const appointments = useSelector((state: RootState) => state.appointment.appointments);
  const projects = useSelector((state: RootState) => state.project.projects);

  const getProjectName = (projectId: string) => projects.find((p) => p.id === projectId)?.name || 'Unknown Project';

  const stats: StatItem[] = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter((b) => b.status === 'UPCOMING').length;
    const completed = appointments.filter((b) => b.status === 'COMPLETED').length;
    const cancelled = appointments.filter((b) => b.status === 'CANCELLED').length;

    return [
      { label: 'Total Appointments', value: total, icon: <EventAvailable fontSize="large" />, color: 'primary' },
      { label: 'Upcoming', value: upcoming, icon: <CalendarToday fontSize="large" />, color: 'info' },
      { label: 'Completed', value: completed, icon: <CheckCircle fontSize="large" />, color: 'success' },
      { label: 'Cancelled', value: cancelled, icon: <Cancel fontSize="large" />, color: 'error' },
    ];
  }, [appointments]);

  const columns: DataTableColumn<Appointment>[] = [
    {
      field: 'project_id',
      headerName: 'Project',
      searchable: true,
      width: 220,
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>
          {getProjectName(row.project_id)}
        </Typography>
      ),
    },
    {
      field: 'visit_date',
      headerName: 'Visit Date',
      width: 140,
      render: (row) => (
        <Typography variant="body2">
          {new Date(row.visit_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      align: 'center',
      render: (row) => {
        const cfg = statusConfig[row.status];
        return (
          <Chip
            icon={cfg.icon}
            label={cfg.label}
            size="small"
            color={cfg.color}
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 160,
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Typography>
      ),
    },
  ];

  return (
    <PageLayout
      title={i18n.t('user.bookingTitle')}
      subtitle="View and track your site visit appointments"
    >
      <Stats stats={stats} />
      <DataTable
        columns={columns}
        rows={appointments}
        loading={false}
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50]}
        getRowId={(row) => row.id}
      />
    </PageLayout>
  );
};
