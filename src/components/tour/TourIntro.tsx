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
            letterSpacing: 2,
            opacity: 0.9,
            animation: `${fadeInUp} 500ms ease-out`,
          }}
        >
          Welcome to the Virtual Tour
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mt: 1,
            animation: `${fadeInUp} 700ms ease-out`,
          }}
        >
          {projectName}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mt: 2,
            opacity: 0.95,
            lineHeight: 1.7,
            animation: `${fadeInUp} 900ms ease-out`,
          }}
        >
          {projectDescription}
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" color="primary" size="large" onClick={onEnter} sx={{ px: 4, py: 1 }}>
            Start Tour
          </Button>
          {onSkip && (
            <Button variant="text" color="inherit" onClick={onSkip} sx={{ px: 2 }}>
              Skip
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
