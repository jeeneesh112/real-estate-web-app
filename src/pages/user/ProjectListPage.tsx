import { Container, Typography } from '@mui/material';
import { i18n } from '../../i18n';

export const ProjectListPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {i18n.t('user.projectListTitle')}
      </Typography>
      <Typography variant="body1">
        Project list content
      </Typography>
    </Container>
  );
};
