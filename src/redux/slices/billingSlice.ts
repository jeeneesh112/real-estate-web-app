import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Payment status types aligned with PAYMENT table
type PaymentStatus = 'PAID' | 'FAILED';

interface Payment {
  id: number;
  client_id: number;
  amount: number;
  status: PaymentStatus;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
  created_by: string;
}

interface BillingState {
  payments: Payment[];
  selectedPayment: Payment | null;
}

// Realistic mock data
const mockPayments: Payment[] = [
  {
    id: 1,
    client_id: 101,
    amount: 250000.00,
    status: 'PAID',
    created_at: '2025-12-01T10:00:00Z',
    modified_at: '2025-12-01T10:00:00Z',
    deleted_at: null,
    created_by: 'admin-001',
  },
  {
    id: 2,
    client_id: 102,
    amount: 150000.50,
    status: 'PAID',
    created_at: '2025-12-02T14:30:00Z',
    modified_at: '2025-12-02T14:30:00Z',
    deleted_at: null,
    created_by: 'admin-001',
  },
  {
    id: 3,
    client_id: 101,
    amount: 75000.00,
    status: 'PAID',
    created_at: '2025-12-05T09:15:00Z',
    modified_at: '2025-12-05T09:15:00Z',
    deleted_at: null,
    created_by: 'admin-001',
  },
  {
    id: 4,
    client_id: 103,
    amount: 320000.75,
    status: 'FAILED',
    created_at: '2025-12-08T11:45:00Z',
    modified_at: '2025-12-08T12:00:00Z',
    deleted_at: null,
    created_by: 'admin-002',
  },
  {
    id: 5,
    client_id: 104,
    amount: 500000.00,
    status: 'PAID',
    created_at: '2025-12-10T16:20:00Z',
    modified_at: '2025-12-10T16:20:00Z',
    deleted_at: null,
    created_by: 'admin-001',
  },
  {
    id: 6,
    client_id: 102,
    amount: 100000.00,
    status: 'PAID',
    created_at: '2025-12-12T08:30:00Z',
    modified_at: '2025-12-12T08:30:00Z',
    deleted_at: null,
    created_by: 'admin-001',
  },
  {
    id: 7,
    client_id: 105,
    amount: 275000.25,
    status: 'FAILED',
    created_at: '2025-12-14T13:00:00Z',
    modified_at: '2025-12-14T13:15:00Z',
    deleted_at: null,
    created_by: 'admin-002',
  },
  {
    id: 8,
    client_id: 103,
    amount: 150000.00,
    status: 'PAID',
    created_at: '2025-12-16T10:45:00Z',
    modified_at: '2025-12-16T10:45:00Z',
    deleted_at: null,
    created_by: 'admin-001',
  },
];

const initialState: BillingState = {
  payments: mockPayments,
  selectedPayment: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload;
    },
    selectPayment: (state, action: PayloadAction<Payment | null>) => {
      state.selectedPayment = action.payload;
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.push(action.payload);
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
    deletePayment: (state, action: PayloadAction<number>) => {
      state.payments = state.payments.filter(p => p.id !== action.payload);
    },
  },
});

export const { setPayments, selectPayment, addPayment, updatePayment, deletePayment } = billingSlice.actions;
export default billingSlice.reducer;

// Export types
export type { Payment, PaymentStatus };
