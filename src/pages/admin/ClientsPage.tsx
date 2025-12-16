import { Container, Typography } from '@mui/material';
import { i18n } from '../../i18n';

export const ClientsPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {i18n.t('admin.clientsTitle')}
      </Typography>
      <Typography variant="body1">
        Clients management content
      </Typography>
    </Container>
  );
};
