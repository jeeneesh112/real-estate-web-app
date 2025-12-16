import { Card, CardContent, Typography } from '@mui/material';

export const FlatCard: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Flat Card</Typography>
        <Typography variant="body2">Placeholder</Typography>
      </CardContent>
    </Card>
  );
};
