import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { i18n } from '../../i18n';
import { MapView } from '../../components/map/MapView';

const projectImages: Record<string, string> = {
  'proj-001': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  'proj-002': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
  'proj-003': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
  'proj-004': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
  'proj-005': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
};

export const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  const [mapOpen, setMapOpen] = useState(false);
  const projects = useSelector((state: RootState) => state.project.projects);
  const towers = useSelector((state: RootState) => state.tower.towers);
  const flats = useSelector((state: RootState) => state.flat.flats);

  const getTowerCount = (projectId: string) => towers.filter((t) => t.project_id === projectId).length;

  const getFlatTypes = (projectId: string) => {
    const towerIds = towers.filter((t) => t.project_id === projectId).map((t) => t.id);
    const types = new Set(
      flats
        .filter((f) => towerIds.includes(f.tower_id))
        .map((f) => f.flat_type)
    );
    return Array.from(types);
  };

  const typeLabel: Record<string, string> = {
    BUY: 'For Sale',
    RENT: 'For Rent',
    BOTH: 'Buy & Rent',
  };

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1.5} sx={{ mb: 2.5 }}>
        <Typography variant="h5" fontWeight={700}>
          {i18n.t('user.projectListTitle') || 'Projects'}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label="Curated for you" color="primary" variant="outlined" size="small" />
          <Chip label={`${projects.length} projects`} size="small" variant="outlined" />
          <Dialog open={mapOpen} onClose={() => setMapOpen(false)} fullWidth maxWidth="lg">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
              <Stack>
                <Typography variant="h6" fontWeight={700}>Map view</Typography>
                <Typography variant="body2" color="text.secondary">See all projects on the map</Typography>
              </Stack>
              <IconButton onClick={() => setMapOpen(false)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <Divider sx={{ mx: 2 }} />
            <DialogContent sx={{ pt: 3 }}>
              <MapView projects={projects} />
            </DialogContent>
          </Dialog>
          <Chip
            icon={<MapOutlinedIcon />}
            label="Map view"
            color="secondary"
            onClick={() => setMapOpen(true)}
            sx={{ cursor: 'pointer', fontWeight: 700 }}
            variant="filled"
          />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {projects.map((project) => {
          const towerCount = getTowerCount(project.id);
          const flatTypes = getFlatTypes(project.id);
          const image = projectImages[project.id] || projectImages['proj-001'];

          return (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid #e6ebf2',
                  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
                  overflow: 'hidden',
                  transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 36px rgba(15, 23, 42, 0.12)',
                    borderColor: '#c7d2fe',
                  },
                  cursor: 'pointer',
                }}
              >
                <CardActionArea
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  onClick={() => navigate(`/user/projects/${project.id}`)}
                >
                  <Box
                    sx={{
                      height: 180,
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.35)), url(${image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <CardContent sx={{ p: 2.5, flex: 1, width: '100%' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="h6" fontWeight={700} noWrap>
                        {project.name}
                      </Typography>
                      <Chip
                        label={typeLabel[project.type]}
                        size="small"
                        sx={{
                          backgroundColor: project.type === 'BUY' ? '#e3f2fd' : project.type === 'RENT' ? '#e8f5e9' : '#fff8e1',
                          color: project.type === 'BUY' ? '#1565c0' : project.type === 'RENT' ? '#2e7d32' : '#f9a825',
                          fontWeight: 700,
                        }}
                      />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                      <LocationOnOutlinedIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {project.city}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Chip label={`${towerCount} tower${towerCount !== 1 ? 's' : ''}`} size="small" variant="outlined" />
                      <Chip label={`${flatTypes.length} unit type${flatTypes.length !== 1 ? 's' : ''}`} size="small" variant="outlined" />
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                      {flatTypes.slice(0, 4).map((ft) => (
                        <Chip key={ft} label={ft} size="small" sx={{ fontWeight: 600 }} />
                      ))}
                      {flatTypes.length > 4 && (
                        <Chip label={`+${flatTypes.length - 4} more`} size="small" variant="outlined" />
                      )}
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
