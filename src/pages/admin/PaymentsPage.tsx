import { Container, Typography } from '@mui/material';
import { i18n } from '../../i18n';

export const PaymentsPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {i18n.t('admin.paymentsTitle')}
      </Typography>
      <Typography variant="body1">
        Payments management content
      </Typography>
    </Container>
  );
};
