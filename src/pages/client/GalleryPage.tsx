import { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Collections,
  Image as ImageIcon,
  ViewCarousel,
  CheckCircle,
  Visibility,
  Edit,
  Delete,
  Close,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { PageLayout } from '../../components/layout/PageLayout';
import { Stats, type StatItem } from '../../components/ui/Stats';
import {
  selectAllImages,
  selectImagesByType,
  ImageType,
  type Image,
} from '../../redux/slices/gallerySlice';
import { i18n } from '../../i18n';

export const GalleryPage: React.FC = () => {
  const allImages = useSelector(selectAllImages);
  const projects = useSelector((state: RootState) => state.project.projects);
  const towers = useSelector((state: RootState) => state.tower.towers);
  const flats = useSelector((state: RootState) => state.flat.flats);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get images by type
  const projectGalleryImages = useSelector((state: RootState) =>
    selectImagesByType(state, ImageType.PROJECT_GALLERY)
  );
  const projectCoverImages = useSelector((state: RootState) =>
    selectImagesByType(state, ImageType.PROJECT_COVER)
  );
  const towerImages = useSelector((state: RootState) =>
    selectImagesByType(state, ImageType.TOWER_IMAGE)
  );
  const flatGalleryImages = useSelector((state: RootState) =>
    selectImagesByType(state, ImageType.FLAT_GALLERY)
  );
  const panoramaImages = useSelector((state: RootState) =>
    selectImagesByType(state, ImageType.PANORAMA_IMAGE)
  );

  // Calculate statistics
  const stats: StatItem[] = useMemo(
    () => [
      {
        label: 'Total Images',
        value: allImages.length,
        icon: <Collections fontSize="large" />,
        color: 'primary',
      },
      {
        label: 'Project Gallery',
        value: projectGalleryImages.length + projectCoverImages.length,
        icon: <ImageIcon fontSize="large" />,
        color: 'info',
      },
      {
        label: 'Flat Gallery',
        value: flatGalleryImages.length,
        icon: <ViewCarousel fontSize="large" />,
        color: 'warning',
      },
      {
        label: 'Panoramas',
        value: panoramaImages.length,
        icon: <ViewCarousel fontSize="large" />,
        color: 'success',
      },
    ],
    [allImages, projectGalleryImages, projectCoverImages, flatGalleryImages, panoramaImages]
  );

  // Tab change handler
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Get current tab images
  const getCurrentTabImages = (): Image[] => {
    switch (selectedTab) {
      case 0: // All
        return allImages;
      case 1: // Project Gallery
        return [...projectGalleryImages, ...projectCoverImages];
      case 2: // Towers
        return towerImages;
      case 3: // Flats
        return flatGalleryImages;
      case 4: // Panoramas
        return panoramaImages;
      default:
        return allImages;
    }
  };

  const currentImages = getCurrentTabImages();

  // Image click handler
  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    setDialogOpen(true);
  };

  // Dialog close handler
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedImage(null);
  };

  // Helper functions to get names
  const getProjectName = (projectId?: number): string => {
    if (!projectId) return '';
    const project = projects.find((p) => p.id === `proj-00${projectId}`);
    return project ? project.name : '';
  };

  const getTowerName = (towerId?: number): string => {
    if (!towerId) return '';
    const tower = towers.find((t) => t.id === `tower-00${towerId}`);
    return tower ? tower.name : '';
  };

  const getFlatId = (flatId?: number): string => {
    if (!flatId) return '';
    const flat = flats.find((f) => f.id === `flat-00${flatId}`);
    return flat ? flat.id : '';
  };

  // Build location string for image
  const getImageLocation = (image: Image): string => {
    const parts: string[] = [];
    
    if (image.projectId) {
      const projectName = getProjectName(image.projectId);
      if (projectName) parts.push(projectName);
    }
    
    if (image.towerId) {
      const towerName = getTowerName(image.towerId);
      if (towerName) parts.push(towerName);
    }
    
    if (image.flatId) {
      const flatId = getFlatId(image.flatId);
      if (flatId) parts.push(`Flat ${flatId}`);
    }
    
    return parts.join(' → ');
  };

  // Get image type label
  const getImageTypeLabel = (type: ImageType): string => {
    switch (type) {
      case ImageType.CLIENT_LOGO:
        return 'Client Logo';
      case ImageType.PROJECT_GALLERY:
        return 'Project Gallery';
      case ImageType.PROJECT_COVER:
        return 'Project Cover';
      case ImageType.TOWER_IMAGE:
        return 'Tower Image';
      case ImageType.FLAT_GALLERY:
        return 'Flat Gallery';
      case ImageType.PANORAMA_IMAGE:
        return 'Panorama';
      default:
        return 'Unknown';
    }
  };

  // Get image type color
  const getImageTypeColor = (type: ImageType): 'primary' | 'info' | 'success' | 'warning' | 'error' | 'secondary' => {
    switch (type) {
      case ImageType.PROJECT_GALLERY:
      case ImageType.PROJECT_COVER:
        return 'primary';
      case ImageType.TOWER_IMAGE:
        return 'info';
      case ImageType.FLAT_GALLERY:
        return 'warning';
      case ImageType.PANORAMA_IMAGE:
        return 'success';
      case ImageType.CLIENT_LOGO:
        return 'secondary';
      default:
        return 'primary';
    }
  };

  // Action buttons
  const actions = (
    <Stack direction="row" spacing={1}>
      <Button variant="contained" color="primary">
        + Upload Images
      </Button>
    </Stack>
  );

  return (
    <PageLayout
      title={i18n.t('client.galleryTitle')}
      subtitle="Manage all images across projects, towers, flats, and panoramas. Click any image to view details."
      actions={actions}
    >
      {/* Statistics Section */}
      <Stats stats={stats} />

      {/* Tabs for filtering */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label={`All (${allImages.length})`} />
          <Tab label={`Projects (${projectGalleryImages.length + projectCoverImages.length})`} />
          <Tab label={`Towers (${towerImages.length})`} />
          <Tab label={`Flats (${flatGalleryImages.length})`} />
          <Tab label={`Panoramas (${panoramaImages.length})`} />
        </Tabs>
      </Box>

      {/* Image Grid */}
      <Grid container spacing={2}>
        {currentImages.length === 0 && (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                color: 'text.secondary',
              }}
            >
              <Collections sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6">No images found</Typography>
              <Typography variant="body2">Upload images to get started</Typography>
            </Box>
          </Grid>
        )}

        {currentImages.map((image) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => handleImageClick(image)}
            >
              <CardMedia
                component="img"
                height="200"
                image={image.url}
                alt={image.fileName}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent 
                sx={{ 
                  flexGrow: 1, 
                  pb: 1,
                  pt: 2,
                  px: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 160,
                }}
              >
                {/* File Name */}
                <Typography
                  variant="body2"
                  fontWeight={500}
                  noWrap
                  title={image.fileName}
                  sx={{ 
                    mb: 1,
                    height: 20,
                  }}
                >
                  {image.fileName}
                </Typography>
                
                {/* Location breadcrumb - Always reserve space */}
                <Box sx={{ minHeight: 40, mb: 1.5 }}>
                  {getImageLocation(image) && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.5,
                      }}
                      title={getImageLocation(image)}
                    >
                      📍 {getImageLocation(image)}
                    </Typography>
                  )}
                </Box>
                
                {/* Chips - Always at bottom */}
                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                  <Chip
                    label={getImageTypeLabel(image.imageType)}
                    size="small"
                    color={getImageTypeColor(image.imageType)}
                    variant="outlined"
                    sx={{ height: 24, m: 0 }}
                  />
                  {image.roomType && (
                    <Chip 
                      label={image.roomType} 
                      size="small" 
                      variant="outlined"
                      sx={{ height: 24, m: 0 }}
                    />
                  )}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" color="primary" onClick={(e) => { e.stopPropagation(); }}>
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="info" onClick={(e) => { e.stopPropagation(); }}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
                {image.isActive && (
                  <CheckCircle fontSize="small" color="success" />
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Image Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        {selectedImage && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{selectedImage.fileName}</Typography>
                <IconButton onClick={handleDialogClose}>
                  <Close />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.fileName}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 8,
                  }}
                />
              </Box>
              <Stack spacing={2}>
                {/* Location Information */}
                {getImageLocation(selectedImage) && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      📍 {getImageLocation(selectedImage)}
                    </Typography>
                  </Box>
                )}
                
                {/* Project Name */}
                {selectedImage.projectId && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Project
                    </Typography>
                    <Typography variant="body1">
                      {getProjectName(selectedImage.projectId)}
                    </Typography>
                  </Box>
                )}
                
                {/* Tower Name */}
                {selectedImage.towerId && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tower
                    </Typography>
                    <Typography variant="body1">
                      {getTowerName(selectedImage.towerId)}
                    </Typography>
                  </Box>
                )}
                
                {/* Flat ID */}
                {selectedImage.flatId && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Flat
                    </Typography>
                    <Typography variant="body1">
                      {getFlatId(selectedImage.flatId)}
                    </Typography>
                  </Box>
                )}
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  <Chip
                    label={getImageTypeLabel(selectedImage.imageType)}
                    size="small"
                    color={getImageTypeColor(selectedImage.imageType)}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
                {selectedImage.roomType && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Room Type
                    </Typography>
                    <Typography variant="body1">{selectedImage.roomType}</Typography>
                  </Box>
                )}
                {selectedImage.sequenceOrder && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Sequence Order
                    </Typography>
                    <Typography variant="body1">{selectedImage.sequenceOrder}</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedImage.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={selectedImage.isActive ? 'success' : 'error'}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Created By
                  </Typography>
                  <Typography variant="body1">
                    {selectedImage.createdBy.name} ({selectedImage.createdBy.role})
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedImage.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Close</Button>
              <Button variant="contained" color="info">
                Edit
              </Button>
              <Button variant="contained" color="error">
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </PageLayout>
  );
};
