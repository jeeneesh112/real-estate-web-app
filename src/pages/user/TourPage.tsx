import { Box, Button, Container, Stack, Typography, CircularProgress, IconButton } from '@mui/material';
// import { i18n } from '../../i18n';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { selectPanoramaImagesByFlat } from '../../redux/slices/gallerySlice';
import { useNavigate, useParams } from 'react-router-dom';
import { PanoramaViewer } from '../../components/tour/PanoramaViewer';
import { TourIntro } from '../../components/tour/TourIntro';
import { endVirtualTour, startVirtualTour } from '../../redux/slices/virtualTourSlice';
import { setSidebarOpen } from '../../redux/slices/uiSlice';
import { getProjectById } from '../../redux/slices/projectSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

export const TourPage: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  const sidebarOpen = useSelector((s: RootState) => s.ui.sidebarOpen);
  const flatId = 1; // sample house flat id from mock data
  const [index, setIndex] = useState(0);
  const prevSidebarOpenRef = useRef<boolean | null>(null);

  const images = useSelector((state: RootState) => selectPanoramaImagesByFlat(state, flatId));
  const total = images.length;
  const image = useMemo(() => images[index], [images, index]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const project = useSelector((s: RootState) => (projectId ? getProjectById(s, projectId) : null));

  console.log('TourPage - projectId:', projectId, 'images:', images.length, 'user:', user);

  // Start/end tracking
  useEffect(() => {
    if (!user || !projectId) return;
    const sessionId = `vt-${Date.now()}`;
    const startedAtISO = new Date().toISOString();
    dispatch(startVirtualTour({ id: sessionId, user_id: user.id, project_id: projectId, startedAtISO }));

    return () => {
      dispatch(endVirtualTour({ id: sessionId, endedAtISO: new Date().toISOString() }));
    };
  }, [dispatch, projectId, user]);

  const handlePrev = () => setIndex((i) => (i - 1 + total) % total);
  const handleNext = () => setIndex((i) => (i + 1) % total);
  const handleHotspotClick = (targetIndex: number) => setIndex(targetIndex);

  const closeSidebarForFullscreen = () => {
    if (prevSidebarOpenRef.current === null) {
      prevSidebarOpenRef.current = sidebarOpen;
    }
    dispatch(setSidebarOpen(false));
  };

  const restoreSidebar = () => {
    if (prevSidebarOpenRef.current !== null) {
      dispatch(setSidebarOpen(prevSidebarOpenRef.current));
      prevSidebarOpenRef.current = null;
    } else {
      // If we didn't capture state, default to open after fullscreen exit
      dispatch(setSidebarOpen(true));
    }
  };

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!isFullscreen) {
      closeSidebarForFullscreen();
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      restoreSidebar();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const nowFull = !!document.fullscreenElement;
      setIsFullscreen(nowFull);
      if (nowFull) {
        closeSidebarForFullscreen();
      } else {
        restoreSidebar();
      }
    };
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        restoreSidebar();
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleEscKey);
      restoreSidebar();
    };
  }, [isFullscreen]);

  if (!image) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6">No panorama images found for this flat.</Typography>
      </Container>
    );
  }

  return (
    <Suspense
      fallback={
        <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      }
    >
      {/* @ts-ignore: MUI Box props trigger complex union on this tree */}
      <Box style={{ width: '100%', paddingTop: 16, paddingBottom: 16 }}>
        {showIntro && project && (
          <TourIntro
            projectName={project.name}
            projectDescription={project.description}
            onEnter={() => setShowIntro(false)}
          />
        )}
        <Container maxWidth="lg">
          {!isFullscreen && (
            <Box
              sx={{
                mb: 3,
                px: 2.5,
                py: 2.2,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                variant="text"
                color="primary"
                sx={{
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.8,
                  borderRadius: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    textDecoration: 'none',
                    transform: 'translateX(-2px)',
                  },
                }}
              >
                Back
              </Button>
              <Box sx={{ flex: 1, ml: 1 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    backgroundImage: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.3,
                  }}
                >
                  {`Welcome to ${project?.name ?? ''}'s Virtual Tour`}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mt: 0.5 }}>
                  Immersive 360° experience
                </Typography>
              </Box>
            </Box>
          )}
        </Container>

        <Box sx={{ position: 'relative' }}>
        {!showIntro && (
        <PanoramaViewer 
          imageUrl={image.url} 
          onHotspotClick={handleHotspotClick}
          currentIndex={index}
          totalScenes={total}
          images={images}
          isFullscreen={isFullscreen}
        />
        )}
        {/* Room label overlay */}
        {!isFullscreen && !showIntro && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              px: 3.5,
              py: 1.8,
              borderRadius: 2.5,
              pointerEvents: 'none',
              zIndex: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
              {image.roomType || `Scene ${index + 1}`}
            </Typography>
          </Box>
        )}
        {/* Fullscreen button */}
        {!isFullscreen && !showIntro && (
          <IconButton
            onClick={toggleFullscreen}
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              backgroundColor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              zIndex: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              '&:hover': { 
                backgroundColor: 'rgba(0,0,0,0.85)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <FullscreenIcon />
          </IconButton>
        )}
        {isFullscreen && !showIntro && (
          <IconButton
            onClick={toggleFullscreen}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 20,
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              zIndex: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              '&:hover': { 
                backgroundColor: 'rgba(0,0,0,0.85)',
                transform: 'translateY(-50%) scale(1.1)',
              },
            }}
            aria-label="Exit fullscreen"
          >
            <FullscreenExitIcon />
          </IconButton>
        )}
      </Box>

        {!isFullscreen && (
          <Container maxWidth="lg" sx={{ mt: 2 }}>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<NavigateBeforeIcon />} 
                onClick={handlePrev}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateX(-2px)',
                  },
                }}
              >
                Previous
              </Button>
              <Button 
                variant="contained" 
                endIcon={<NavigateNextIcon />} 
                onClick={handleNext}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateX(2px)',
                    boxShadow: '0 6px 24px rgba(25, 118, 210, 0.4)',
                  },
                }}
              >
                Next
              </Button>
            </Stack>
            {/* Thumbnails with captions */}
            <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 3.5, flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <Box
                  key={img.id}
                  onClick={() => setIndex(i)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    width: 92,
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 88,
                      height: 52,
                      backgroundImage: `url(${img.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 2,
                      border: i === index ? '3px solid #1976d2' : '1px solid #e5e7eb',
                      boxShadow: i === index ? '0 6px 20px rgba(25, 118, 210, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(25, 118, 210, 0.2)',
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.8,
                      maxWidth: 88,
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: i === index ? '#1976d2' : '#64748b',
                      fontWeight: i === index ? 700 : 500,
                      fontSize: '0.75rem',
                    }}
                  >
                    {img.roomType || `Scene ${i + 1}`}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Container>
        )}
      </Box>
    </Suspense>
  );
};
