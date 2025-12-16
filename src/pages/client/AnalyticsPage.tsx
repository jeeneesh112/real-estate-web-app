import { Container, Typography } from '@mui/material';
import { i18n } from '../../i18n';

export const AnalyticsPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {i18n.t('client.analyticsTitle')}
      </Typography>
      <Typography variant="body1">
        Analytics charts placeholder
      </Typography>
    </Container>
  );
};
