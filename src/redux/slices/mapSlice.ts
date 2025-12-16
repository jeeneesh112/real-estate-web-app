import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapCenter {
  lat: number;
  lng: number;
}

interface MapState {
  selectedProjectId: string | null;
  mapCenter: MapCenter;
  zoomLevel: number;
}

// Initial map center (India center)
const initialState: MapState = {
  selectedProjectId: null,
  mapCenter: {
    lat: 20.5937,
    lng: 78.9629,
  },
  zoomLevel: 5,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    selectProjectOnMap: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload;
    },
    setMapCenter: (state, action: PayloadAction<MapCenter>) => {
      state.mapCenter = action.payload;
    },
    setZoomLevel: (state, action: PayloadAction<number>) => {
      state.zoomLevel = Math.max(1, Math.min(action.payload, 20)); // Clamp between 1 and 20
    },
  },
});

export const { selectProjectOnMap, setMapCenter, setZoomLevel } = mapSlice.actions;
export default mapSlice.reducer;

// Export types
export type { MapCenter, MapState };
