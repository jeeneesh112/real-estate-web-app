import { Container, Typography } from '@mui/material';
import { i18n } from '../../i18n';

export const BookingPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {i18n.t('user.bookingTitle')}
      </Typography>
      <Typography variant="body1">
        Booking form placeholder
      </Typography>
    </Container>
  );
};
