import { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  Chip,
  Button,
  Stack,
} from '@mui/material';
import {
  Receipt,
  AttachMoney,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Stats, type StatItem } from '../../components/ui/Stats';
import { type Payment } from '../../redux/slices/billingSlice';
import { i18n } from '../../i18n';
import { formatCurrency } from '../../utils/currency';

export const BillingPage: React.FC = () => {
  const payments = useSelector((state: RootState) => state.billing.payments);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Calculate statistics
  const stats: StatItem[] = useMemo(() => {
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    return [
      {
        label: 'Total Payments',
        value: payments.length,
        icon: <Receipt fontSize="large" />,
        color: 'primary',
      },
      {
        label: 'Total Amount',
        value: formatCurrency(totalAmount),
        icon: <AttachMoney fontSize="large" />,
        color: 'info',
      },
      {
        label: 'Paid',
        value: payments.filter((p) => p.status === 'PAID').length,
        icon: <CheckCircle fontSize="large" />,
        color: 'success',
      },
      {
        label: 'Failed',
        value: payments.filter((p) => p.status === 'FAILED').length,
        icon: <Error fontSize="large" />,
        color: 'error',
      },
    ];
  }, [payments]);

  // Define columns with MUI styling
  const columns: DataTableColumn<Payment>[] = [
    {
      field: 'id',
      headerName: 'Payment ID',
      sortable: true,
      width: 120,
      render: (row) => `#${row.id}`,
    },
    {
      field: 'client_id',
      headerName: 'Client ID',
      sortable: true,
      width: 120,
      render: (row) => `Client-${row.client_id}`,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      sortable: true,
      width: 140,
      align: 'right',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatCurrency(row.amount)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      width: 120,
      align: 'center',
      render: (row) => (
        <Chip
          label={row.status}
          size="small"
          color={row.status === 'PAID' ? 'success' : 'error'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'created_by',
      headerName: 'Created By',
      sortable: true,
      searchable: true,
      width: 140,
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

  // Handle row click
  const handleRowClick = (payment: Payment) => {
    setSelectedPayment(payment);
    console.log('Selected payment:', payment);
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
        + New Payment
      </Button>
    </Stack>
  );

  return (
    <PageLayout
      title={i18n.t('client.billingTitle')}
      subtitle="View and manage all your payments and invoices. Click any row to view details."
      actions={actions}
    >
      {/* Statistics Section */}
      <Stats stats={stats} />

      {/* Selected Payment Info */}
      {selectedPayment && (
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
            <strong>Selected Payment:</strong> #{selectedPayment.id} - {formatCurrency(selectedPayment.amount)} ({selectedPayment.status})
          </Typography>
        </Box>
      )}

      {/* DataTable */}
      <DataTable<Payment>
        columns={columns}
        rows={payments}
        loading={loading}
        defaultPageSize={10}
        pageSizeOptions={[5, 10, 25, 50]}
        onRowClick={handleRowClick}
        getRowId={(row) => row.id.toString()}
      />
    </PageLayout>
  );
};
