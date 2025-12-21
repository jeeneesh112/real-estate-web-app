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
  TextField,
  InputAdornment,
  Button,
  Popover,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'BUY' | 'RENT' | 'BOTH'>('ALL');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [cityAnchorEl, setCityAnchorEl] = useState<HTMLButtonElement | null>(null);
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

  // Get unique cities for filter
  const uniqueCities = Array.from(new Set(projects.map((p) => p.city))).sort();

  // Apply filters
  const filteredProjects = projects.filter((project) => {
    // Type filter
    if (selectedType !== 'ALL' && project.type !== selectedType) return false;
    // Location filter
    if (selectedCities.length > 0 && !selectedCities.includes(project.city)) return false;
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        project.name.toLowerCase().includes(query) ||
        project.city.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleCityToggle = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const cityPopoverOpen = Boolean(cityAnchorEl);

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1.5} sx={{ mb: 2.5 }}>
        <Typography variant="h5" fontWeight={700}>
          {i18n.t('user.projectListTitle') || 'Available Projects'} ({filteredProjects.length})
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label="Curated for you" color="primary" variant="outlined" size="small" />
          <Chip label={`${filteredProjects.length} projects`} size="small" variant="outlined" />
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

      {/* Filter Bar */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 3,
          pb: 2,
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        {/* Search Field */}
        <TextField
          placeholder="Search projects..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery('')}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Type Filter */}
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="body2" fontWeight={600} sx={{ minWidth: 'fit-content' }}>
            Type:
          </Typography>
          {(['ALL', 'BUY', 'RENT', 'BOTH'] as const).map((type) => (
            <Chip
              key={type}
              label={type === 'ALL' ? 'All Types' : typeLabel[type]}
              onClick={() => setSelectedType(type)}
              variant={selectedType === type ? 'filled' : 'outlined'}
              color={selectedType === type ? 'primary' : 'default'}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          ))}
        </Stack>

        {/* Location Filter */}
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="body2" fontWeight={600} sx={{ minWidth: 'fit-content' }}>
            Location:
          </Typography>
          <Button
            size="small"
            variant={selectedCities.length > 0 ? 'contained' : 'outlined'}
            color="primary"
            endIcon={<ExpandMoreIcon />}
            onClick={(e) => setCityAnchorEl(e.currentTarget)}
            sx={{ fontWeight: 600, textTransform: 'none' }}
          >
            {selectedCities.length > 0 ? `${selectedCities.length} selected` : 'All Cities'}
          </Button>
          <Popover
            open={cityPopoverOpen}
            anchorEl={cityAnchorEl}
            onClose={() => setCityAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <Box sx={{ p: 2, minWidth: 200 }}>
              <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
                Select Cities
              </Typography>
              <Stack spacing={0.5}>
                {uniqueCities.map((city) => (
                  <FormControlLabel
                    key={city}
                    control={
                      <Checkbox
                        checked={selectedCities.includes(city)}
                        onChange={() => handleCityToggle(city)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">{city}</Typography>
                    }
                  />
                ))}
              </Stack>
              <Button
                size="small"
                fullWidth
                onClick={() => setSelectedCities([])}
                sx={{ mt: 1.5, fontWeight: 600 }}
              >
                Clear Selection
              </Button>
            </Box>
          </Popover>
        </Stack>

        {/* Clear All Button */}
        {(searchQuery || selectedType !== 'ALL' || selectedCities.length > 0) && (
          <Button
            size="small"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('ALL');
              setSelectedCities([]);
            }}
            sx={{ fontWeight: 700 }}
          >
            Clear All
          </Button>
        )}
      </Stack>

      <Grid container spacing={3}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => {
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
          })
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                textAlign: 'center',
              }}
            >
              {/* Empty State Icon */}
              <Box
                sx={{
                  fontSize: 80,
                  mb: 2,
                  opacity: 0.5,
                }}
              >
                🏗️
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                No Projects Found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                {searchQuery
                  ? 'No projects match your search. Try adjusting your search terms.'
                  : selectedCities.length > 0 || selectedType !== 'ALL'
                  ? 'No projects match your selected filters. Try adjusting your criteria.'
                  : 'No projects available at the moment.'}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('ALL');
                    setSelectedCities([]);
                  }}
                  sx={{ fontWeight: 700 }}
                >
                  Clear All Filters
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/user/home')}
                  sx={{ fontWeight: 700 }}
                >
                  Back to Home
                </Button>
              </Stack>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
