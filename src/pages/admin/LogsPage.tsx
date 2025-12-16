import { Container, Typography } from '@mui/material';
import { i18n } from '../../i18n';

export const LogsPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {i18n.t('admin.logsTitle')}
      </Typography>
      <Typography variant="body1">
        System logs content
      </Typography>
    </Container>
  );
};
