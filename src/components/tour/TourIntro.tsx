import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

interface TourIntroProps {
  projectName: string;
  projectDescription: string;
  onEnter: () => void;
  onSkip?: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translate3d(0, 20px, 0) }
  to { opacity: 1; transform: translate3d(0, 0, 0) }
`;

export const TourIntro: React.FC<TourIntroProps> = ({ projectName, projectDescription, onEnter, onSkip }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        background:
          'radial-gradient(1200px 600px at 50% 0%, rgba(25,118,210,0.35) 0%, rgba(17,24,39,0.95) 40%, rgba(3,7,18,1) 100%)',
        animation: `${fadeIn} 400ms ease-out`,
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 800, px: 3 }}>
        <Typography
          variant="overline"
          sx={{
            letterSpacing: 3,
            opacity: 0.85,
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: `${fadeInUp} 500ms ease-out`,
          }}
        >
          Welcome to the Virtual Tour
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            mt: 2,
            mb: 2,
            backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: `${fadeInUp} 700ms ease-out`,
            lineHeight: 1.2,
          }}
        >
          {projectName}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mt: 3,
            opacity: 0.9,
            lineHeight: 1.8,
            fontSize: '1.1rem',
            animation: `${fadeInUp} 900ms ease-out`,
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          {projectDescription}
        </Typography>

        <Box sx={{ mt: 5, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={onEnter} 
            sx={{ 
              px: 5, 
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              boxShadow: '0 8px 24px rgba(25, 118, 210, 0.35)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(25, 118, 210, 0.45)',
              },
            }}
          >
            Start Tour
          </Button>
          {onSkip && (
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large"
              onClick={onSkip} 
              sx={{ 
                px: 4,
                py: 1.5,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                fontSize: '1rem',
                border: '2px solid rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.5)',
                },
              }}
            >
              Skip
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
