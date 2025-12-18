import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Visibility,
  Event,
  Home,
  PersonAdd,
  Timer,
  Apartment,
  MeetingRoom,
  Assessment,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  selectTotalProjectViews,
  selectTotalVirtualTours,
  selectTotalAppointments,
  selectRentVsBuyRatio,
  selectAverageTourDuration,
  selectTotalUniqueUsers,
  selectTop5ViewedProjects,
  selectMostViewedTower,
  selectFlatTypePreferences,
  selectLast5Appointments,
  selectLast5VirtualTours,
  selectConversionFunnel,
  selectUsersViewedButNoAppointment,
  selectUsersCompletedTourButNoBooking,
  selectProjectViewsChartData,
  selectFlatTypeInterestChartData,
  selectPropertyTypeInterestChartData,
  selectDailyActivityTrend,
  selectTourDurationHistogram,
} from '../../redux/slices/analyticsSlice';
import { i18n } from '../../i18n';
import { PageLayout } from '../../components/layout/PageLayout';

// Simple Bar Chart Component
const SimpleBarChart: React.FC<{ data: { labels: string[]; data: number[] }; color?: string }> = ({
  data,
  color = '#667eea',
}) => {
  const maxValue = Math.max(...data.data, 1);

  return (
    <Box sx={{ width: '100%' }}>
      {data.labels.map((label, index) => (
        <Box key={label} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="body2" fontWeight="600">
              {data.data[index]}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(data.data[index] / maxValue) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.08)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
                borderRadius: 4,
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

// Simple Pie Chart Component (using stacked bars as visual representation)
const SimplePieChart: React.FC<{ data: { labels: string[]; data: number[] }; colors?: string[] }> = ({
  data,
  colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
}) => {
  const total = data.data.reduce((sum, val) => sum + val, 0);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Visual Bar */}
      <Box sx={{ display: 'flex', height: 40, borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        {data.data.map((value, index) => {
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return percentage > 0 ? (
            <Box
              key={data.labels[index]}
              sx={{
                width: `${percentage}%`,
                backgroundColor: colors[index % colors.length],
                transition: 'all 0.3s ease',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            />
          ) : null;
        })}
      </Box>

      {/* Legend */}
      <Box>
        {data.labels.map((label, index) => {
          const value = data.data[index];
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: 1,
                  backgroundColor: colors[index % colors.length],
                  mr: 1.5,
                }}
              />
              <Typography variant="body2" sx={{ flex: 1 }}>
                {label}
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {value} ({percentage}%)
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// Simple Line Chart Component
const SimpleLineChart: React.FC<{ data: { labels: string[]; data: number[] }; color?: string }> = ({
  data,
  color = '#667eea',
}) => {
  const maxValue = Math.max(...data.data, 1);
  const points = data.data.map((value, index) => ({
    x: (index / (data.data.length - 1)) * 100,
    y: 100 - (value / maxValue) * 80,
  }));

  const pathD = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      const prevPoint = points[index - 1];
      const cpX1 = prevPoint.x + (point.x - prevPoint.x) / 3;
      const cpX2 = prevPoint.x + ((point.x - prevPoint.x) * 2) / 3;
      return `C ${cpX1} ${prevPoint.y}, ${cpX2} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(' ');

  return (
    <Box sx={{ width: '100%' }}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '200px' }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="rgba(0,0,0,0.05)"
            strokeWidth="0.5"
          />
        ))}

        {/* Area under curve */}
        <path
          d={`${pathD} L 100 100 L 0 100 Z`}
          fill={`url(#gradient-${color.replace('#', '')})`}
          opacity="0.2"
        />

        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" />

        {/* Points */}
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="3" fill={color}>
            <title>
              {data.labels[index]}: {data.data[index]}
            </title>
          </circle>
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Labels */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        {data.labels.map((label, index) => (
          <Typography key={label} variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            {label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

// KPI Card Component
const KPICard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: string;
}> = ({ title, value, icon, color, subtitle, trend }) => {
  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${color}40`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="700" sx={{ mb: 0.5, color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Chip
                label={trend}
                size="small"
                icon={<TrendingUp />}
                sx={{
                  mt: 1,
                  height: 24,
                  backgroundColor: `${color}20`,
                  color: color,
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
          <Avatar
            sx={{
              backgroundColor: color,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export const AnalyticsPage: React.FC = () => {
  const clientId = 101; // Mock client ID - in real app, get from auth state

  // Selectors
  const totalProjectViews = useSelector((state: RootState) => selectTotalProjectViews(state, clientId));
  const totalVirtualTours = useSelector((state: RootState) => selectTotalVirtualTours(state, clientId));
  const totalAppointments = useSelector((state: RootState) => selectTotalAppointments(state, clientId));
  const rentVsBuyRatio = useSelector((state: RootState) => selectRentVsBuyRatio(state, clientId));
  const avgTourDuration = useSelector((state: RootState) => selectAverageTourDuration(state, clientId));
  const totalUniqueUsers = useSelector((state: RootState) => selectTotalUniqueUsers(state, clientId));

  const top5Projects = useSelector((state: RootState) => selectTop5ViewedProjects(state, clientId));
  const mostViewedTower = useSelector((state: RootState) => selectMostViewedTower(state, clientId));
  const flatTypePreferences = useSelector((state: RootState) => selectFlatTypePreferences(state, clientId));

  const last5Appointments = useSelector((state: RootState) => selectLast5Appointments(state, clientId));
  const last5VirtualTours = useSelector((state: RootState) => selectLast5VirtualTours(state, clientId));

  const conversionFunnel = useSelector((state: RootState) => selectConversionFunnel(state, clientId));
  const usersViewedButNoAppointment = useSelector((state: RootState) =>
    selectUsersViewedButNoAppointment(state, clientId)
  );
  const usersCompletedTourButNoBooking = useSelector((state: RootState) =>
    selectUsersCompletedTourButNoBooking(state, clientId)
  );

  const projectViewsChartData = useSelector((state: RootState) =>
    selectProjectViewsChartData(state, clientId)
  );
  const flatTypeChartData = useSelector((state: RootState) =>
    selectFlatTypeInterestChartData(state, clientId)
  );
  const propertyTypeChartData = useSelector((state: RootState) =>
    selectPropertyTypeInterestChartData(state, clientId)
  );
  const dailyActivityTrend = useSelector((state: RootState) => selectDailyActivityTrend(state, clientId));
  const tourDurationHistogram = useSelector((state: RootState) =>
    selectTourDurationHistogram(state, clientId)
  );

  // Memoized calculations
  const conversionRate = useMemo(() => {
    if (conversionFunnel.projectViews === 0) return 0;
    return ((conversionFunnel.appointments / conversionFunnel.projectViews) * 100).toFixed(1);
  }, [conversionFunnel]);

  return (
    <PageLayout title={i18n.t('client.analyticsTitle')} subtitle="Comprehensive insights into user engagement and property performance">
      <Grid container spacing={3}>
        {/* ==================== KPI CARDS ==================== */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Project Views"
            value={totalProjectViews}
            icon={<Visibility />}
            color="#667eea"
            trend="+12.5%"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Virtual Tours"
            value={totalVirtualTours}
            icon={<Home />}
            color="#f093fb"
            subtitle={`${avgTourDuration} min avg`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Appointments"
            value={totalAppointments}
            icon={<Event />}
            color="#4facfe"
            trend="+8.3%"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Unique Visitors"
            value={totalUniqueUsers}
            icon={<PersonAdd />}
            color="#43e97b"
            subtitle="Last 30 days"
          />
        </Grid>

        {/* ==================== DAILY ACTIVITY TREND (LINE CHART) ==================== */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Assessment sx={{ mr: 1, color: '#667eea' }} />
                <Typography variant="h6" fontWeight="600">
                  Daily Activity Trend
                </Typography>
              </Box>
              <SimpleLineChart data={dailyActivityTrend} color="#667eea" />
            </CardContent>
          </Card>
        </Grid>

        {/* ==================== RENT VS BUY (PIE CHART) ==================== */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Home sx={{ mr: 1, color: '#f093fb' }} />
                <Typography variant="h6" fontWeight="600">
                  Property Interest
                </Typography>
              </Box>
              <SimplePieChart data={propertyTypeChartData} colors={['#f093fb', '#4facfe']} />
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <Box>
                  <Typography variant="h5" fontWeight="700" color="#f093fb">
                    {rentVsBuyRatio.rent}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rent Interest
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="700" color="#4facfe">
                    {rentVsBuyRatio.buy}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Buy Interest
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ==================== TOP PROJECTS (BAR CHART) ==================== */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Apartment sx={{ mr: 1, color: '#667eea' }} />
                <Typography variant="h6" fontWeight="600">
                  Most Viewed Projects
                </Typography>
              </Box>
              <SimpleBarChart data={projectViewsChartData} color="#667eea" />
            </CardContent>
          </Card>
        </Grid>

        {/* ==================== FLAT TYPE PREFERENCES (BAR CHART) ==================== */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <MeetingRoom sx={{ mr: 1, color: '#43e97b' }} />
                <Typography variant="h6" fontWeight="600">
                  Flat Type Preferences
                </Typography>
              </Box>
              <SimpleBarChart data={flatTypeChartData} color="#43e97b" />
            </CardContent>
          </Card>
        </Grid>

        {/* ==================== TOUR DURATION HISTOGRAM ==================== */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Timer sx={{ mr: 1, color: '#f093fb' }} />
                <Typography variant="h6" fontWeight="600">
                  Virtual Tour Duration
                </Typography>
              </Box>
              <SimpleBarChart data={tourDurationHistogram} color="#f093fb" />
            </CardContent>
          </Card>
        </Grid>

        {/* ==================== USER JOURNEY / CONVERSION FUNNEL ==================== */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ mr: 1, color: '#4facfe' }} />
                <Typography variant="h6" fontWeight="600">
                  User Journey Funnel
                </Typography>
              </Box>

              {/* Funnel Visual */}
              <Stack spacing={2}>
                {[
                  { label: 'Project Views', value: conversionFunnel.projectViews, color: '#667eea', width: 100 },
                  { label: 'Flat Views', value: conversionFunnel.flatViews, color: '#764ba2', width: 80 },
                  {
                    label: 'Virtual Tours',
                    value: conversionFunnel.virtualTours,
                    color: '#f093fb',
                    width: 60,
                  },
                  {
                    label: 'Appointments',
                    value: conversionFunnel.appointments,
                    color: '#4facfe',
                    width: 40,
                  },
                ].map((stage) => (
                  <Box key={stage.label}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{stage.label}</Typography>
                      <Typography variant="body2" fontWeight="600">
                        {stage.value} users
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: `${stage.width}%`,
                        height: 48,
                        background: `linear-gradient(90deg, ${stage.color} 0%, ${stage.color}80 100%)`,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: `0 4px 12px ${stage.color}40`,
                      }}
                    >
                      {stage.value > 0 &&
                        `${((stage.value / conversionFunnel.projectViews) * 100).toFixed(0)}%`}
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Conversion Stats */}
              <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <Box>
                  <Typography variant="h5" fontWeight="700" color="#667eea">
                    {conversionRate}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Conversion Rate
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="700" color="#f093fb">
                    {usersViewedButNoAppointment}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Drop-offs
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="700" color="#4facfe">
                    {usersCompletedTourButNoBooking}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tour No-books
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ==================== RECENT APPOINTMENTS TABLE ==================== */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Event sx={{ mr: 1, color: '#4facfe' }} />
                <Typography variant="h6" fontWeight="600">
                  Recent Appointments
                </Typography>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(102, 126, 234, 0.1)' }}>
                      <TableCell>
                        <strong>User</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Project</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Flat Type</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Appointment Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Notes</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {last5Appointments.map((appointment) => (
                      <TableRow key={appointment.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 1,
                                backgroundColor: '#667eea',
                                fontSize: '0.875rem',
                              }}
                            >
                              {appointment.userName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="600">
                                {appointment.userName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {appointment.userEmail}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{appointment.projectName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {appointment.towerName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={appointment.flatType} size="small" color="primary" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(appointment.appointmentDate!).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {appointment.notes}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ==================== RECENT VIRTUAL TOURS TABLE ==================== */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Home sx={{ mr: 1, color: '#f093fb' }} />
                <Typography variant="h6" fontWeight="600">
                  Recent Virtual Tours
                </Typography>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(240, 147, 251, 0.1)' }}>
                      <TableCell>
                        <strong>User</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Project</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Flat Type</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Duration</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Completed At</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {last5VirtualTours.map((tour) => {
                      const durationMinutes = Math.floor((tour.durationSeconds || 0) / 60);
                      const durationSeconds = (tour.durationSeconds || 0) % 60;
                      return (
                        <TableRow key={tour.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  mr: 1,
                                  backgroundColor: '#f093fb',
                                  fontSize: '0.875rem',
                                }}
                              >
                                {tour.userName.charAt(0)}
                              </Avatar>
                              <Typography variant="body2" fontWeight="600">
                                {tour.userName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              Project {tour.projectId} - Tower {tour.towerId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={tour.flatType} size="small" color="secondary" />
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={<Timer />}
                              label={`${durationMinutes}m ${durationSeconds}s`}
                              size="small"
                              sx={{ backgroundColor: '#f093fb20', color: '#f093fb', fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(tour.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
};
