import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import towerReducer from './slices/towerSlice';
import flatReducer from './slices/flatSlice';
import tourReducer from './slices/tourSlice';
import mapReducer from './slices/mapSlice';
import uiReducer from './slices/uiSlice';
import galleryReducer from './slices/gallerySlice';
import billingReducer from './slices/billingSlice';
import clientProfileReducer from './slices/clientProfileSlice';
import analyticsReducer from './slices/analyticsSlice';
import bookedAppointmentReducer from './slices/bookedAppointmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    tower: towerReducer,
    flat: flatReducer,
    tour: tourReducer,
    map: mapReducer,
    ui: uiReducer,
    gallery: galleryReducer,
    billing: billingReducer,
    clientProfile: clientProfileReducer,
    analytics: analyticsReducer,
    bookedAppointment: bookedAppointmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
