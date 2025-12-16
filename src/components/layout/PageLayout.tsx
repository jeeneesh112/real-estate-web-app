import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Stack,
} from '@mui/material';

/**
 * PageLayout component props
 */
export interface PageLayoutProps {
  /** Page title (from i18n) */
  title: string;
  /** Page subtitle/description (from i18n) - optional */
  subtitle?: string;
  /** Right-aligned action buttons/elements - optional */
  actions?: React.ReactNode;
  /** Page content (DataTable, cards, charts, forms, etc.) */
  children: React.ReactNode;
}

/**
 * Production-ready PageLayout component
 * Provides consistent layout, spacing, and design across all pages
 * Used on User, Client, and Admin pages
 *
 * @example
 * ```tsx
 * <PageLayout
 *   title={i18n.t('client.projectsTitle')}
 *   subtitle={i18n.t('client.projectsDescription')}
 *   actions={<Button>Add Project</Button>}
 * >
 *   <DataTable {...tableProps} />
 * </PageLayout>
 * ```
 */
export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ title, subtitle, actions, children }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: '#fff',
            border: '1px solid #f0f0f0',
            mx: { xs: 1, sm: 2, md: 3 },
            my: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2.5, sm: 3, md: 3.5 },
              backgroundColor: '#fafafa',
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
            >
              {/* Title & Subtitle */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: subtitle ? 0.5 : 0,
                    wordBreak: 'break-word',
                  }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.5,
                    }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>

              {/* Actions Area */}
              {actions && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                    alignItems: 'center',
                  }}
                >
                  {actions}
                </Box>
              )}
            </Stack>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 0, borderColor: '#e8e8e8' }} />

          {/* Content Section */}
          <Box
            sx={{
              px: { xs: 1, sm: 2, md: 3 },
              py: { xs: 2, sm: 2.5, md: 3 },
            }}
          >
            {children}
          </Box>
        </Paper>
      </Box>
    );
  }
);

PageLayout.displayName = 'PageLayout';
