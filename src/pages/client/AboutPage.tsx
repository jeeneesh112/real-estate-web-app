import {
  Grid,
  Typography,
  Box,
  Divider,
  Avatar,
  Button,
  Stack,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Business,
  Email,
  LocationOn,
  Person,
  CalendarToday,
  Edit,
  Verified,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { PageLayout } from '../../components/layout/PageLayout';
import { i18n } from '../../i18n';
import { formatDate } from '../../utils/formatDate';

export const AboutPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const clientProfile = useSelector((state: RootState) => state.clientProfile.profile);
  const isClient = user?.role === 'CLIENT';

  const actions = (
    <Stack direction="row" spacing={1}>
      <Button variant="contained" color="primary" startIcon={<Edit />}>
        Edit Profile
      </Button>
    </Stack>
  );

  return (
    <PageLayout
      title={i18n.t('client.aboutTitle') || 'About'}
      subtitle={isClient ? 'Your company information' : 'Your profile information'}
      actions={actions}
    >
      <Grid container spacing={3}>
        {/* Profile Header Card - Premium Design */}
        <Grid item xs={12}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    border: '3px solid white',
                    fontSize: '2.5rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {isClient ? <Business /> : <Person />}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {isClient ? clientProfile?.company_name : user?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1.5, opacity: 0.9 }}>
                    {user?.email}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      icon={<Person />}
                      label={user?.role}
                      variant="outlined"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiChip-icon': { color: 'white' },
                      }}
                    />
                    <Chip
                      icon={<Verified />}
                      label={user?.status}
                      variant="outlined"
                      sx={{
                        color: 'white',
                        borderColor: user?.status === 'ACTIVE' ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)',
                        backgroundColor: user?.status === 'ACTIVE' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                        '& .MuiChip-icon': { color: 'white' },
                      }}
                    />
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* User Information Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
              },
              borderTop: '4px solid #667eea',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontWeight: 700,
                  mb: 2,
                  color: 'primary.main',
                }}
              >
                <Person sx={{ fontSize: 24 }} />
                User Information
              </Typography>
              <Divider sx={{ my: 2, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} />
              <Stack spacing={2.5}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.7rem',
                      letterSpacing: '0.5px',
                    }}
                  >
                    User ID
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {user?.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.7rem',
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Email fontSize="small" /> Email Address
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500, wordBreak: 'break-all' }}>
                    {user?.email}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Client Profile Information - Only for CLIENT users */}
        {isClient && clientProfile && (
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                },
                borderTop: '4px solid #10b981',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontWeight: 700,
                    mb: 2,
                    color: 'success.main',
                  }}
                >
                  <Business sx={{ fontSize: 24 }} />
                  Company Information
                </Typography>
                <Divider sx={{ my: 2, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} />
                <Stack spacing={2.5}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Company Name
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600, fontSize: '1.1rem' }}>
                      {clientProfile.company_name}
                    </Typography>
                  </Box>
                  {clientProfile.address && (
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          fontSize: '0.7rem',
                          letterSpacing: '0.5px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <LocationOn fontSize="small" /> Office Address
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                        {clientProfile.address}
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Subscription ID
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                      SUB-{clientProfile.subscription_id}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Timestamps Timeline */}
        <Grid item xs={12}>
          <Card
            sx={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
              },
              borderTop: '4px solid #0ea5e9',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontWeight: 700,
                  mb: 2,
                  color: 'info.main',
                }}
              >
                <CalendarToday sx={{ fontSize: 24 }} />
                Activity Timeline
              </Typography>
              <Divider sx={{ my: 2, backgroundColor: 'rgba(0, 0, 0, 0.08)' }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={isClient && clientProfile ? 3 : 4}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: '#f5f7fa',
                      borderRadius: 1.5,
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#eef2f7',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Created
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.8, fontWeight: 600 }}>
                      {formatDate(user?.created_at || '')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={isClient && clientProfile ? 3 : 4}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: '#f5f7fa',
                      borderRadius: 1.5,
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#eef2f7',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Last Updated
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.8, fontWeight: 600 }}>
                      {formatDate(user?.modified_at || '')}
                    </Typography>
                  </Box>
                </Grid>
                {isClient && clientProfile && (
                  <>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: '#f5f7fa',
                          borderRadius: 1.5,
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: '#eef2f7',
                            borderColor: 'success.main',
                          },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '0.7rem',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Profile Created
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.8, fontWeight: 600 }}>
                          {formatDate(clientProfile.created_at)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: '#f5f7fa',
                          borderRadius: 1.5,
                          border: '1px solid rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: '#eef2f7',
                            borderColor: 'success.main',
                          },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '0.7rem',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Profile Updated
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.8, fontWeight: 600 }}>
                          {formatDate(clientProfile.modified_at)}
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
};
