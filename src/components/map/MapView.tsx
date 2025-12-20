import { Box, Chip, Stack, Typography } from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useMemo } from 'react';
import { Project } from '../../redux/slices/projectSlice';

interface MapViewProps {
  projects: Project[];
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: 12,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  gestureHandling: 'cooperative',
  styles: [
    {
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }],
    },
    {
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#616161' }],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#f5f5f5' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{ color: '#dbeafe' }],
    },
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{ color: '#e0f2fe' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }],
    },
  ],
};

export const MapView: React.FC<MapViewProps> = ({ projects }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const center = useMemo(() => {
    if (!projects.length) return { lat: 21.1466, lng: 79.0889 }; // India-ish center
    const sum = projects.reduce(
      (acc, p) => {
        acc.lat += p.lat;
        acc.lng += p.lng;
        return acc;
      },
      { lat: 0, lng: 0 }
    );
    return { lat: sum.lat / projects.length, lng: sum.lng / projects.length };
  }, [projects]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
  });

  if (!apiKey) {
    return (
      <Box sx={{ height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f1f5f9', borderRadius: 3 }}>
        <Typography variant="body1" color="text.secondary">Add VITE_GOOGLE_MAPS_API_KEY to enable map view.</Typography>
      </Box>
    );
  }

  if (!projects.length) {
    return (
      <Box sx={{ height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f1f5f9', borderRadius: 3 }}>
        <Typography variant="body1" color="text.secondary">No projects to display on the map</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: 420,
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        boxShadow: '0 14px 38px rgba(15,23,42,0.12)',
        background: '#f8fafc',
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2, bgcolor: 'rgba(255,255,255,0.92)', p: 1.25, borderRadius: 2, boxShadow: '0 8px 20px rgba(15,23,42,0.12)' }}>
        <Chip icon={<RoomIcon />} label="Projects" size="small" color="primary" variant="outlined" />
        <Typography variant="body2" color="text.secondary">Google Maps</Typography>
      </Stack>

      <Box sx={{ height: '100%', width: '100%' }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={5}
            options={mapOptions}
          >
            {projects.map((project) => (
              <Marker
                key={project.id}
                position={{ lat: project.lat, lng: project.lng }}
                title={`${project.name} • ${project.city}`}
              />
            ))}
          </GoogleMap>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary">Loading map…</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
