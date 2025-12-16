import { Container, Typography } from '@mui/material';
import { i18n } from '../../i18n';

export const TourPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {i18n.t('user.tourTitle')}
      </Typography>
      <Typography variant="body1">
        Virtual tour placeholder
      </Typography>
    </Container>
  );
};
