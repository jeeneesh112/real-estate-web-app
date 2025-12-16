import { Container, Typography } from '@mui/material';
import { i18n } from '../../i18n';

export const HomePage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {i18n.t('user.homeWelcome')}
      </Typography>
      <Typography variant="body1">
        User home page content
      </Typography>
    </Container>
  );
};
