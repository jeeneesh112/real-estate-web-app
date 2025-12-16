import { Box, Typography } from '@mui/material';

export const TourViewer: React.FC = () => {
  return (
    <Box sx={{ height: 500, backgroundColor: '#263238', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h6" color="white">
        Three.js 3D Tour Placeholder
      </Typography>
    </Box>
  );
};
