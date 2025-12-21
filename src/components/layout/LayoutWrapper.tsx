import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { toggleSidebar } from '../../redux/slices/uiSlice';
import { SIDEBAR_WIDTH } from './Sidebar';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const LayoutWrapper: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleSidebarClose = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar onMenuClick={handleSidebarToggle} />

      {/* Main Layout: Sidebar + Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar - Persistent with animation */}
        <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            width: '100%',
            overflow: 'auto',
            transition: 'margin-left 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Toolbar for spacing under navbar */}
          <Toolbar />

          {/* Page Content */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 1, sm: 1.5, md: 2 },
              overflow: 'auto',
            }}
          >
            <Outlet />
          </Box>

          {/* Footer */}
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};
