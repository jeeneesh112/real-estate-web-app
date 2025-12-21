import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Stack,
  Paper,
  Button,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  Visibility,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { formatDate } from '../../utils/formatDate';
import {
  selectNewlyAddedProjects,
  selectLastAppointments,
  selectLastVirtualTours,
  selectNearbyProjects,
  selectUserLocation,
} from '../../redux/slices/userDashboardSlice';
import { RootState } from '../../redux/store';
import { i18n } from '../../i18n';

export const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const newlyAddedProjects = useSelector(selectNewlyAddedProjects);
  const lastAppointments = useSelector(selectLastAppointments);
  const lastVirtualTours = useSelector(selectLastVirtualTours);
  const nearbyProjects = useSelector(selectNearbyProjects);
  const userLocation = useSelector(selectUserLocation);

  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <PageLayout
      title={i18n.t('user.dashboardTitle') || 'Dashboard'}
      subtitle={`Welcome back, ${user?.name || 'User'}! Here's your property journey at a glance.`}
    >
      <Stack spacing={4}>
        {/* Key Stats */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}>
            Quick Stats
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
                        Total Appointments
                      </Typography>
                      <CalendarToday sx={{ color: '#fff', fontSize: 20 }} />
                    </Stack>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
                      {lastAppointments.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#fff', opacity: 0.85 }}>
                      Last 5 shown
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
                        Virtual Tours
                      </Typography>
                      <Visibility sx={{ color: '#fff', fontSize: 20 }} />
                    </Stack>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
                      {lastVirtualTours.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#fff', opacity: 0.85 }}>
                      Last 5 shown
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
                        Nearby Projects
                      </Typography>
                      <LocationOn sx={{ color: '#fff', fontSize: 20 }} />
                    </Stack>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
                      {nearbyProjects.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#fff', opacity: 0.85 }}>
                      Within 15 km
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
                        New Projects
                      </Typography>
                      <TrendingUp sx={{ color: '#fff', fontSize: 20 }} />
                    </Stack>
                    <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
                      {newlyAddedProjects.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#fff', opacity: 0.85 }}>
                      Recently added
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

      {/* Newly Added Projects */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}>
          Recently Added Projects
        </Typography>
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Grid container spacing={2} sx={{ p: 2 }}>
              {newlyAddedProjects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      borderRadius: 2,
                      border: '1px solid #e5e7eb',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                    onClick={() => navigate(`/user/projects/${project.id}`)}
                  >
                    {/* Cover Image */}
                    <Box
                      sx={{
                        width: '100%',
                        height: 200,
                        backgroundImage: project.cover_image ? `url('${project.cover_image}')` : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-start',
                        color: '#fff',
                        position: 'relative',
                        padding: 2,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          zIndex: 0,
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
                        <Typography variant="h6" sx={{ textAlign: 'left', fontWeight: 700, color: '#fff', mb: 0.5 }}>
                          {project.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={project.type}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: '#fff',
                          color: '#667eea',
                          fontWeight: 600,
                          zIndex: 2,
                        }}
                      />
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Stack spacing={1.5}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <LocationOn sx={{ color: '#6b7280', fontSize: 16 }} />
                          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                            {project.city}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.5 }}>
                          {project.description.substring(0, 75)}...
                        </Typography>
                        <Box
                          sx={{
                            pt: 1,
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="caption" color="textSecondary">
                            Added: {formatDate(project.created_at)}
                          </Typography>
                          <Button size="small" sx={{ color: '#667eea', fontWeight: 600 }}>
                            View →
                          </Button>
                        </Box>
                      </Stack>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

        {/* Last 5 Appointments & Virtual Tours - Side by Side */}
      <Grid container spacing={2}>
        {/* Last 5 Appointments */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                Recent Site Visits
              </Typography>
              <Button size="small" variant="text" onClick={() => navigate('/user/appointments')} sx={{ color: '#3b82f6' }}>
                View All →
              </Button>
            </Box>
            <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ p: 0 }}>
                <Stack spacing={0}>
                  {lastAppointments.map((appointment, index) => (
                    <Box
                      key={appointment.id}
                      sx={{
                        p: 2,
                        borderBottom: index < lastAppointments.length - 1 ? '1px solid #e5e7eb' : 'none',
                        '&:hover': {
                          backgroundColor: '#f9fafb',
                        },
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                        <Stack spacing={1} flex={1} onClick={() => navigate(`/user/projects/${appointment.project_id}`)}>
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <CalendarToday sx={{ color: '#f59e0b', fontSize: 20, mt: 0.5, flexShrink: 0 }} />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                Site Visit Scheduled
                              </Typography>
                              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                {appointment.project_name}
                              </Typography>
                              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                                <Typography variant="caption" color="textSecondary">
                                  {formatDate(appointment.visit_date)}
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                        </Stack>
                        <Chip
                          label={appointment.status}
                          size="small"
                          sx={{
                            backgroundColor: 
                              appointment.status === 'UPCOMING' ? '#fef3c7' :
                              appointment.status === 'COMPLETED' ? '#d1fae5' :
                              '#fee2e2',
                            color: 
                              appointment.status === 'UPCOMING' ? '#d97706' :
                              appointment.status === 'COMPLETED' ? '#047857' :
                              '#dc2626',
                            fontWeight: 700,
                            height: 24,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            flexShrink: 0,
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Last 5 Virtual Tours */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 2 }}>
              Virtual Tour History
            </Typography>
            <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent sx={{ p: 0 }}>
                <Stack spacing={0}>
                  {lastVirtualTours.map((tour, index) => {
                    const startTime = new Date(tour.start_time);
                    const endTime = new Date(tour.end_time);
                    const durationMinutes = Math.round(
                      (endTime.getTime() - startTime.getTime()) / 60000
                    );
                    return (
                      <Box
                        key={tour.id}
                        sx={{
                          p: 2,
                          borderBottom: index < lastVirtualTours.length - 1 ? '1px solid #e5e7eb' : 'none',
                          '&:hover': {
                            backgroundColor: '#f9fafb',
                          },
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                          <Stack spacing={1} flex={1} onClick={() => navigate(`/user/projects/${tour.project_id}`)}>
                            <Stack direction="row" spacing={1} alignItems="flex-start">
                              <Visibility sx={{ color: '#3b82f6', fontSize: 20, mt: 0.5, flexShrink: 0 }} />
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                  Virtual Tour Completed
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                  {tour.project_name}
                                </Typography>
                                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                                  <Typography variant="caption" color="textSecondary">
                                    {durationMinutes} min • {startTime.toLocaleDateString()}
                                  </Typography>
                                </Stack>
                              </Box>
                            </Stack>
                          </Stack>
                          <Chip
                            label={tour.status}
                            size="small"
                            sx={{
                              backgroundColor: 
                                tour.status === 'IN_PROGRESS' ? '#dbeafe' :
                                '#d1fae5',
                              color: 
                                tour.status === 'IN_PROGRESS' ? '#0284c7' :
                                '#047857',
                              fontWeight: 700,
                              height: 24,
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                              flexShrink: 0,
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
        {/* Nearby Projects */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}>
            Projects Near You
          </Typography>
          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 0 }}>
              <Grid container spacing={2} sx={{ p: 2 }}>
                {nearbyProjects.length > 0 ? (
                  nearbyProjects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                      <Paper
                        elevation={0}
                        sx={{
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          borderRadius: 2,
                          border: '1px solid #e5e7eb',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
                          },
                        }}
                        onClick={() => navigate(`/user/projects/${project.id}`)}
                      >
                        {/* Cover Image */}
                        <Box
                          sx={{
                            width: '100%',
                            height: 200,
                            backgroundImage: project.cover_image ? `url('${project.cover_image}')` : `linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-start',
                            color: '#fff',
                            position: 'relative',
                            padding: 2,
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0, 0, 0, 0.4)',
                              zIndex: 0,
                            },
                          }}
                        >
                          <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
                            <Typography variant="h6" sx={{ textAlign: 'left', fontWeight: 700, color: '#fff', mb: 0.5 }}>
                              {project.name}
                            </Typography>
                          </Box>
                          <Chip
                            label={project.type}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              backgroundColor: '#fff',
                              color: '#8b5cf6',
                              fontWeight: 600,
                              zIndex: 2,
                            }}
                          />
                        </Box>
                        <Box sx={{ p: 2 }}>
                          <Stack spacing={1.5}>
                            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="space-between">
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <LocationOn sx={{ color: '#6b7280', fontSize: 16 }} />
                                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                                  {project.city}
                                </Typography>
                              </Stack>
                              <Chip
                                label={`${project.distance_km} km`}
                                size="small"
                                variant="filled"
                                sx={{
                                  backgroundColor: '#f3f4f6',
                                  color: '#8b5cf6',
                                  fontWeight: 600,
                                }}
                              />
                            </Stack>
                            <Box
                              sx={{
                                pt: 1,
                                borderTop: '1px solid #e5e7eb',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography variant="caption" color="textSecondary">
                                {project.distance_km <= 5 ? '🔥 Very Close' : project.distance_km <= 10 ? '📍 Nearby' : '📍 Within Range'}
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<LocationOn sx={{ fontSize: 14 }} />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(
                                      `https://www.google.com/maps?q=${project.lat},${project.lng}`,
                                      '_blank'
                                    );
                                  }}
                                  sx={{
                                    color: '#8b5cf6',
                                    borderColor: '#8b5cf6',
                                    fontSize: '0.75rem',
                                    padding: '4px 8px',
                                    '&:hover': {
                                      backgroundColor: '#f3e8ff',
                                    },
                                  }}
                                >
                                  Map
                                </Button>
                                <Button
                                  size="small"
                                  sx={{ color: '#8b5cf6', fontWeight: 600, fontSize: '0.75rem' }}
                                  onClick={() => navigate(`/user/projects/${project.id}`)}
                                >
                                  Explore →
                                </Button>
                              </Stack>
                            </Box>
                          </Stack>
                        </Box>
                      </Paper>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <LocationOn sx={{ color: '#d1d5db', fontSize: 48 }} />
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        No projects nearby. Update your location to discover projects near you!
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Box>

      {/* User Location Info */}
      <Card elevation={1} sx={{ backgroundColor: '#f0f9ff', borderLeft: '4px solid #3b82f6', borderRadius: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                backgroundColor: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocationOn sx={{ color: '#3b82f6', fontSize: 24 }} />
            </Box>
            <Box flex={1}>
              <Typography variant="subtitle2" fontWeight="600" color="#1f2937">
                Your Current Location
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {userLocation.city} • Latitude: {userLocation.lat.toFixed(4)}, Longitude: {userLocation.lng.toFixed(4)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      </Stack>
    </PageLayout>
  );
};
