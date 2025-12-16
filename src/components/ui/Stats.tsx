import React from 'react';
import { Box, Paper, Typography, Stack } from '@mui/material';

/**
 * Single stat item configuration
 */
export interface StatItem {
  /** Label for the stat (from i18n) */
  label: string;
  /** Value to display */
  value: string | number;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Optional color theme */
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';
}

/**
 * Stats component props
 */
export interface StatsProps {
  /** Array of stat items to display */
  stats: StatItem[];
  /** Layout direction */
  direction?: 'row' | 'column';
  /** Spacing between stat cards */
  spacing?: number;
}

/**
 * Production-ready Stats component
 * Displays statistics in a clean, modern card layout
 * Reusable across all pages (User, Client, Admin)
 *
 * @example
 * ```tsx
 * <Stats
 *   stats={[
 *     { label: 'Total Projects', value: 5 },
 *     { label: 'Active', value: 3, color: 'success' }
 *   ]}
 * />
 * ```
 */
export const Stats: React.FC<StatsProps> = ({
  stats,
  direction = 'row',
  spacing = 3,
}) => {
  const getColorStyle = (color?: StatItem['color']) => {
    switch (color) {
      case 'primary':
        return {
          background: 'linear-gradient(to left, #1976d2, #42a5f5)',
        };
      case 'success':
        return {
          background: 'linear-gradient(to left, #2e7d32, #66bb6a)',
        };
      case 'warning':
        return {
          background: 'linear-gradient(to left, #ed6c02, #ffa726)',
        };
      case 'error':
        return {
          background: 'linear-gradient(to left, #d32f2f, #ef5350)',
        };
      case 'info':
        return {
          background: 'linear-gradient(to left, #0288d1, #29b6f6)',
        };
      default:
        return {
          background: 'linear-gradient(to left, #757575, #9e9e9e)',
        };
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: direction }}
        spacing={spacing}
        sx={{
          flexWrap: 'wrap',
        }}
      >
        {stats.map((stat, index) => {
          const colorStyle = getColorStyle(stat.color);
          
          return (
            <Paper
              key={index}
              elevation={0}
              sx={{
                flex: 1,
                minWidth: { xs: '100%', sm: 150 },
                px: 3,
                py: 2.5,
                borderRadius: 2,
                background: colorStyle.background,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    mb: 0.5,
                    fontSize: '0.875rem',
                    color: '#fff',
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};

Stats.displayName = 'Stats';

export type { StatItem, StatsProps };
