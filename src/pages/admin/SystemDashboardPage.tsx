import { Container, Typography } from '@mui/material';
import { i18n } from '../../i18n';

export const SystemDashboardPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {i18n.t('admin.systemDashboardTitle')}
      </Typography>
      <Typography variant="body1">
        System dashboard content
      </Typography>
    </Container>
  );
};
