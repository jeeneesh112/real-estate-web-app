import { Container, Typography } from '@mui/material';
import { i18n } from '../../i18n';

export const BillingPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {i18n.t('client.billingTitle')}
      </Typography>
      <Typography variant="body1">
        Billing and invoices content
      </Typography>
    </Container>
  );
};
