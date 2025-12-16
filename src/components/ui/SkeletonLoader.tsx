import { Skeleton, Box } from '@mui/material';

export const SkeletonLoader: React.FC = () => {
  return (
    <Box>
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      <Skeleton variant="rectangular" width="100%" height={60} />
      <Skeleton variant="rounded" width="100%" height={60} />
    </Box>
  );
};
