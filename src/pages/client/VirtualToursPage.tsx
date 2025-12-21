import { useMemo, type ReactElement } from 'react';
import { Typography, Chip } from '@mui/material';
import { PlayCircle, CheckCircle, Schedule, Cancel } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Stats, type StatItem } from '../../components/ui/Stats';
import { VirtualTour, VirtualTourStatus } from '../../redux/slices/virtualTourSlice';

const statusConfig: Record<VirtualTourStatus, { label: string; color: 'primary' | 'success' | 'error' | 'warning'; icon: ReactElement }> = {
  IN_PROGRESS: { label: 'In Progress', color: 'warning', icon: <PlayCircle fontSize="small" /> },
  COMPLETED: { label: 'Completed', color: 'success', icon: <CheckCircle fontSize="small" /> },
};

export const VirtualToursPage: React.FC = () => {
  const virtualTours = useSelector((state: RootState) => state.virtualTour.virtualTours);
  const projects = useSelector((state: RootState) => state.project.projects);

  const getProjectName = (projectId: string) => projects.find((p) => p.id === projectId)?.name || 'Unknown Project';

  const stats: StatItem[] = useMemo(() => {
    const total = virtualTours.length;
    const inProgress = virtualTours.filter((vt) => vt.status === 'IN_PROGRESS').length;
    const completed = virtualTours.filter((vt) => vt.status === 'COMPLETED').length;

    return [
      { label: 'Total Virtual Tours', value: total, icon: <PlayCircle fontSize="large" />, color: 'primary' },
      { label: 'In Progress', value: inProgress, icon: <PlayCircle fontSize="large" />, color: 'warning' },
      { label: 'Completed', value: completed, icon: <CheckCircle fontSize="large" />, color: 'success' },
    ];
  }, [virtualTours]);

  const columns: DataTableColumn<VirtualTour>[] = [
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
      field: 'start_time',
      headerName: 'Start Time',
      width: 180,
      render: (row) => (
        <Typography variant="body2">
          {new Date(row.start_time).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
      ),
    },
    {
      field: 'end_time',
      headerName: 'End Time',
      width: 180,
      render: (row) => (
        <Typography variant="body2">
          {new Date(row.end_time).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
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
      title="Virtual Tours"
      subtitle="Manage and track virtual tour sessions with users"
    >
      <Stats stats={stats} />
      <DataTable
        columns={columns}
        rows={virtualTours}
        loading={false}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 25]}
        getRowId={(row) => row.id}
      />
    </PageLayout>
  );
};
