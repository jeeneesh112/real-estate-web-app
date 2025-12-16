import { Container, Typography } from '@mui/material';
import { i18n } from '../../i18n';

export const ProjectDetailPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {i18n.t('user.projectDetailTitle')}
      </Typography>
      <Typography variant="body1">
        Project detail content
      </Typography>
    </Container>
  );
};
