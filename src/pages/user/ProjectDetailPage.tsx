import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import BuildingIcon from '@mui/icons-material/Domain';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import { MapView } from '../../components/map/MapView';
import PdfViewer from '../../components/ui/PdfViewer';
import { useState, useEffect } from 'react';

const projectImages: Record<string, string[]> = {
  'proj-001': [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
  ],
  'proj-002': [
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  ],
  'proj-003': [
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
  ],
  'proj-004': [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  ],
  'proj-005': [
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
  ],
};

const towerImages: Record<string, string> = {
  'tower-001': 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
  'tower-002': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  'tower-003': 'https://images.unsplash.com/photo-1512917774080-9991f1c52f8d?auto=format&fit=crop&w=800&q=80',
  'tower-004': 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?auto=format&fit=crop&w=800&q=80',
  'tower-005': 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80',
  'tower-006': 'https://images.unsplash.com/photo-1535085783837-87b450f6f79e?auto=format&fit=crop&w=800&q=80',
  'tower-007': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  'tower-008': 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
  'tower-009': 'https://images.unsplash.com/photo-1508873699372-f4e06359718b?auto=format&fit=crop&w=800&q=80',
};

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTower, setSelectedTower] = useState<string | null>(null);
  const [towerModalOpen, setTowerModalOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const brochureUrl = 'https://www.fujitsu.com/id/imagesgig5/fujitsuuvance_series4.pdf';

  const handleViewLocation = () => {
    if (!project?.lat || !project?.lng) return;
    const query = `${project.lat},${project.lng}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const project = useSelector((state: RootState) =>
    state.project.projects.find((p) => p.id === id)
  );
  const towers = useSelector((state: RootState) =>
    state.tower.towers.filter((t) => t.project_id === id)
  );
  const flats = useSelector((state: RootState) => state.flat.flats);

  const images = projectImages[id || ''] || projectImages['proj-001'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!project) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">Project not found</Typography>
      </Container>
    );
  }

  const typeLabel: Record<string, string> = {
    BUY: 'For Sale',
    RENT: 'For Rent',
    BOTH: 'Buy & Rent',
  };

  const getFlatStatus = (flatId: string) => {
    const flat = flats.find((f) => f.id === flatId);
    return flat?.status || 'available';
  };

  const getTowerFlats = (towerId: string) => {
    return flats.filter((f) => f.tower_id === towerId).sort((a, b) => a.floor - b.floor);
  };

  const getFlatsByFloor = (towerId: string) => {
    const towerFlats = getTowerFlats(towerId);
    const groupedByFloor = new Map<number, typeof towerFlats>();
    
    towerFlats.forEach((flat) => {
      const floor = flat.floor || 1;
      if (!groupedByFloor.has(floor)) {
        groupedByFloor.set(floor, []);
      }
      groupedByFloor.get(floor)!.push(flat);
    });
    
    return Array.from(groupedByFloor.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([floor, flats]) => ({ floor, flats }));
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 6 }}>
      {/* Image Slider with Overlay */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 320, md: 480 },
            overflow: 'hidden',
            bgcolor: '#e0e0e0',
            borderRadius: 3,
            border: '2px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
          }}
        >
          {/* Back Button on Image */}
          <Button
            startIcon={<KeyboardBackspaceIcon />}
            onClick={() => navigate('/user/projects')}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 4,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              color: '#1565c0',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              px: 2,
              py: 1,
              backdropFilter: 'blur(8px)',
              '&:hover': {
                bgcolor: '#fff',
                boxShadow: '0 4px 12px rgba(21, 101, 192, 0.15)',
              },
            }}
          >
            Back to Projects
          </Button>

          {/* Image Slides */}
          {images.map((img, idx) => (
            <Box
              key={idx}
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: idx === currentImageIdx ? 1 : 0,
                transition: 'opacity 800ms ease-in-out',
              }}
            />
          ))}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45))',
          }}
        />

        {/* Overlay Content */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: { xs: '24px', md: '40px' },
            zIndex: 2,
            color: '#fff',
          }}
        >
          <Stack spacing={1.5}>
            <Typography variant="h3" fontWeight={800} sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              {project.name}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOnOutlinedIcon sx={{ fontSize: 24 }} />
              <Typography variant="h6" fontWeight={600} sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                {project.city}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Slide Indicators with Counter */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            alignItems: 'center',
          }}
        >
          {images.map((_, idx) => (
            <Box
              key={idx}
              onClick={() => setCurrentImageIdx(idx)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: idx === currentImageIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            />
          ))}
        </Stack>

        {/* Image Counter */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 3,
            bgcolor: 'rgba(0,0,0,0.5)',
            color: '#fff',
            px: 2,
            py: 1,
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          {currentImageIdx + 1} / {images.length}
        </Box>
        </Box>
      </Container>

      {/* Project Info Section */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>

              {/* Project Description */}
              <Stack spacing={1.5}>
                <Typography variant="h6" fontWeight={700}>
                  About This Project
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {project.description}
                </Typography>
              </Stack>

              {/* Amenities */}
              <Stack spacing={1.5}>
                <Typography variant="h6" fontWeight={700}>
                  Key Features
                </Typography>
                <Grid container spacing={1.5}>
                  {[
                    { icon: '🏊', text: 'Swimming Pool' },
                    { icon: '💪', text: 'Gym & Fitness' },
                    { icon: '🎮', text: 'Recreation Area' },
                    { icon: '🚗', text: '24/7 Security' },
                    { icon: '📶', text: 'High-Speed Internet' },
                    { icon: '🌿', text: 'Landscaped Garden' },
                  ].map((amenity, idx) => (
                    <Grid item xs={6} sm={4} key={idx}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h5">{amenity.icon}</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {amenity.text}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Stack>
          </Grid>

          {/* CTA Sidebar */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e6ebf2',
                boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
                position: { md: 'sticky' },
                top: { md: 20 },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Stack spacing={1}>
                    <Typography variant="h6" fontWeight={700}>
                      Interested?
                    </Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ fontWeight: 700, py: 1.5 }}
                    onClick={() => navigate(`/user/projects/${id}/virtual-tour`)}
                  >
                    Take Virtual Tour
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    sx={{ fontWeight: 700, py: 1.5 }}
                    onClick={() => navigate('/user/appointments')}
                  >
                    Book Visit Appointment
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    sx={{ fontWeight: 700, py: 1.5 }}
                    onClick={() => setPdfOpen(true)}
                  >
                    View Brochure
                  </Button>
                  <Divider sx={{ my: 1 }} />
                  <Stack spacing={1}>
                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                      Quick Info
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <Typography variant="body2" fontWeight={600} sx={{ minWidth: 80 }}>
                          Location:
                        </Typography>
                        <Button
                          variant="text"
                          size="small"
                          sx={{ fontWeight: 700, px: 0.5, minWidth: 'unset' }}
                          onClick={handleViewLocation}
                        >
                          View Location
                        </Button>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <Typography variant="body2" fontWeight={600} sx={{ minWidth: 80 }}>
                          Type:
                        </Typography>
                        <Chip label={typeLabel[project.type]} size="small" />
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
                  {/* PDF Viewer */}
                  <PdfViewer
                    open={pdfOpen}
                    onClose={() => setPdfOpen(false)}
                    url={brochureUrl}
                    title="Project Brochure"
                  />
        </Grid>
      </Container>

      {/* Tabs for Towers and Map */}
      <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(_, val) => setTabValue(val)}
            sx={{
              '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: '1rem' },
            }}
          >
            <Tab label={`Towers (${towers.length})`} />
            <Tab label="Location Map" />
          </Tabs>
        </Box>

        {/* Towers Tab */}
        {tabValue === 0 && (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {towers.map((tower) => {
              const towerFlats = getTowerFlats(tower.id);
              const towerImage = towerImages[tower.id] || towerImages['tower-001'];
              return (
                <Grid item xs={12} sm={6} md={4} key={tower.id}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                      border: '1px solid #e6ebf2',
                      boxShadow: '0 8px 16px rgba(15,23,42,0.08)',
                      transition: 'all 250ms ease',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: '0 12px 24px rgba(15,23,42,0.12)',
                        transform: 'translateY(-2px)',
                        borderColor: '#c7d2fe',
                      },
                    }}
                    onClick={() => {
                      setSelectedTower(tower.id);
                      setTowerModalOpen(true);
                    }}
                  >
                    {/* Tower Image */}
                    <Box
                      sx={{
                        width: '100%',
                        height: 200,
                        backgroundImage: `url(${towerImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.3))',
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 1.5 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <BuildingIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                            <Typography variant="h6" fontWeight={700}>
                              {tower.name}
                            </Typography>
                          </Stack>
                          <ChevronRightIcon sx={{ color: 'primary.main' }} />
                        </Stack>

                        <Divider sx={{ my: 1 }} />

                        <Grid container spacing={1.5}>
                          <Grid item xs={6}>
                            <Stack spacing={0.5}>
                              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                Floors
                              </Typography>
                              <Typography variant="h6" fontWeight={700}>
                                {tower.floors}
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={6}>
                            <Stack spacing={0.5}>
                              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                Units/Floor
                              </Typography>
                              <Typography variant="h6" fontWeight={700}>
                                {tower.units_per_floor}
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>

                        <Button
                          variant="outlined"
                          endIcon={<ChevronRightIcon />}
                          fullWidth
                          sx={{ fontWeight: 700, mt: 1 }}
                        >
                          View Flats
                        </Button>

                        <Stack spacing={1}>
                          <Typography variant="body2" fontWeight={600} color="text.secondary">
                            Unit Types:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                            {Array.from(new Set(towerFlats.map((f) => f.flat_type))).map((type) => (
                              <Chip key={type} label={type} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                            ))}
                          </Stack>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Location Map Tab */}
        {tabValue === 1 && (
          <Box sx={{ mb: 6 }}>
            <MapView projects={[project]} />
          </Box>
        )}
      </Container>

      {/* Tower Flats Modal - Vertical Timeline */}
      <Dialog
        open={towerModalOpen}
        onClose={() => setTowerModalOpen(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: '#f8fafc',
          },
        }}
      >
        {selectedTower && towers.find((t) => t.id === selectedTower) && (() => {
          const selectedTowerObj = towers.find((t) => t.id === selectedTower)!;
          const floorsData = getFlatsByFloor(selectedTower);
          const totalFlats = getTowerFlats(selectedTower).length;

          return (
            <>
              {/* Modal Header - Tower Name & Stats */}
              <Box sx={{ p: 3, background: 'linear-gradient(135deg, #6b7280 0%, #374151 100%)', color: '#fff' }}>
                <Stack spacing={2}>
                  <Typography variant="h5" fontWeight={800}>
                    {selectedTowerObj.name}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={600} sx={{ opacity: 0.9 }}>
                          Floors
                        </Typography>
                        <Typography variant="h6" fontWeight={800}>
                          {selectedTowerObj.floors}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={600} sx={{ opacity: 0.9 }}>
                          Total Units
                        </Typography>
                        <Typography variant="h6" fontWeight={800}>
                          {totalFlats}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={600} sx={{ opacity: 0.9 }}>
                          Unit Type
                        </Typography>
                        <Typography variant="h6" fontWeight={800}>
                          {new Set(getTowerFlats(selectedTower).map((f) => f.flat_type)).size === 1
                            ? getTowerFlats(selectedTower)[0]?.flat_type || '-'
                            : 'Mixed'}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Box>

              <DialogContent sx={{ pt: 3 }}>
                {/* Unit Status Summary */}
                {(() => {
                  const towerFlats = getTowerFlats(selectedTower);
                  const bookedCount = towerFlats.filter((f) => f.status === 'sold').length;
                  const rentalCount = towerFlats.filter((f) => f.status === 'rental').length;
                  const availableCount = towerFlats.filter((f) => f.status === 'available').length;

                  return (
                    <Box sx={{ mb: 2.5, p: 2, background: '#f0f4f8', borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Stack spacing={0.75} alignItems="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <CheckCircleIcon sx={{ fontSize: 20, color: '#ef5350' }} />
                              <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.75rem' }}>
                                Booked
                              </Typography>
                            </Box>
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#ef5350' }}>
                              {bookedCount}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack spacing={0.75} alignItems="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <HomeIcon sx={{ fontSize: 20, color: '#6496c8' }} />
                              <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.75rem' }}>
                                Rental
                              </Typography>
                            </Box>
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#6496c8' }}>
                              {rentalCount}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          <Stack spacing={0.75} alignItems="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <HistoryIcon sx={{ fontSize: 20, color: '#4caf50' }} />
                              <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.75rem' }}>
                                Available
                              </Typography>
                            </Box>
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#4caf50' }}>
                              {availableCount}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })()}

                {/* Legend */}
                <Box sx={{ mb: 3, p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                    Status Legend:
                  </Typography>
                  <Stack direction="row" spacing={3} flexWrap="wrap">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 24, height: 24, borderRadius: '4px', background: 'linear-gradient(135deg, #ff6b6b 0%, #e53935 100%)' }} />
                      <Typography variant="body2" fontWeight={600}>
                        Sold
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 24, height: 24, borderRadius: '4px', background: 'linear-gradient(135deg, #84b6f4 0%, #6496c8 100%)' }} />
                      <Typography variant="body2" fontWeight={600}>
                        Rental
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 24, height: 24, borderRadius: '4px', background: 'linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)' }} />
                      <Typography variant="body2" fontWeight={600}>
                        Available
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                {/* Vertical Timeline with Floors */}
                <Box sx={{ position: 'relative', pl: 4 }}>
                  {/* Vertical Line */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 8,
                      top: 0,
                      bottom: 0,
                      width: '2px',
                      background: 'linear-gradient(180deg, #1565c0 0%, #90caf9 100%)',
                    }}
                  />

                  <Stack spacing={4}>
                    {floorsData.map(({ floor, flats }) => (
                      <Box key={floor} sx={{ position: 'relative' }}>

                        {/* Floor Card */}
                        <Card
                          sx={{
                            borderRadius: 2,
                            background: '#fff',
                            border: '1px solid #e0e0e0',
                            p: 1,
                          }}
                        >
                          {/* Floor Header */}
                          <Typography variant="caption" fontWeight={800} color="#1565c0" sx={{ mb: 0.75, display: 'block', fontSize: '0.7rem' }}>
                            Floor {floor}
                          </Typography>

                          {/* Flats Grid - 3 per row */}
                          <Grid container spacing={0.75}>
                            {flats.map((flat) => {
                              const status = getFlatStatus(flat.id);
                              const isBooked = status === 'sold';
                              const isRental = status === 'rental';

                              return (
                                <Grid item xs={2} key={flat.id}>
                                  <Box
                                    sx={{
                                      height: '72px',
                                      borderRadius: '12px',
                                      border: isBooked ? '2px solid #ef5350' : isRental ? '1px solid rgba(100, 150, 200, 0.6)' : 'none',
                                      background: isBooked
                                        ? 'linear-gradient(135deg, #ff6b6b 0%, #e53935 100%)'
                                        : isRental
                                          ? 'linear-gradient(135deg, #84b6f4 0%, #6496c8 100%)'
                                          : 'linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      p: 0.5,
                                      cursor: 'pointer',
                                      transition: 'all 150ms ease',
                                      '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                      },
                                    }}
                                  >
                                    <Stack spacing={0.2} alignItems="center" justifyContent="center">
                                      {isBooked && <CheckCircleIcon sx={{ fontSize: '1.2rem', color: '#fff' }} />}
                                      {isRental && <HomeIcon sx={{ fontSize: '1.2rem', color: '#fff' }} />}
                                      {!isBooked && !isRental && <HistoryIcon sx={{ fontSize: '1.2rem', color: '#fff' }} />}
                                      <Typography 
                                        variant="caption" 
                                        fontWeight={700} 
                                        sx={{ 
                                          fontSize: '0.6rem',
                                          color: '#fff'
                                        }}
                                      >
                                        {flat.flat_type}
                                      </Typography>
                                      <Typography 
                                        variant="caption" 
                                        fontWeight={600} 
                                        sx={{ 
                                          fontSize: '0.55rem',
                                          color: '#fff',
                                          opacity: 0.9
                                        }}
                                      >
                                        #{flat.id.split('-')[1]}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </Card>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </DialogContent>
            </>
          );
        })()}
      </Dialog>
    </Box>
  );
};
