import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
} from '@mui/material';
import {
  Home,
  Dashboard,
  Business,
  Apartment,
  PhotoLibrary,
  Analytics,
  Payment,
  People,
  AttachMoney,
  Article,
  ViewInAr,
  EventNote,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { i18n } from '../../i18n';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_CLOSED_WIDTH = 0;

interface MenuItem {
  key: string;
  label: string;
  icon: JSX.Element;
  path: string;
  roles: Array<'USER' | 'CLIENT' | 'ADMIN'>;
}

const menuItems: MenuItem[] = [
  // User menu items
  { key: 'user-home', label: 'navigation.home', icon: <Home />, path: '/user/home', roles: ['USER'] },
  { key: 'user-projects', label: 'navigation.projects', icon: <Business />, path: '/user/projects', roles: ['USER'] },
  { key: 'user-tour', label: 'navigation.tour', icon: <ViewInAr />, path: '/user/tour', roles: ['USER'] },
  { key: 'user-booking', label: 'navigation.booking', icon: <EventNote />, path: '/user/booking', roles: ['USER'] },
  
  // Client menu items
  { key: 'client-dashboard', label: 'navigation.dashboard', icon: <Dashboard />, path: '/client/dashboard', roles: ['CLIENT'] },
  { key: 'client-projects', label: 'navigation.projects', icon: <Business />, path: '/client/projects', roles: ['CLIENT'] },
  { key: 'client-towers', label: 'navigation.towers', icon: <Apartment />, path: '/client/towers', roles: ['CLIENT'] },
  { key: 'client-flats', label: 'navigation.flats', icon: <Home />, path: '/client/flats', roles: ['CLIENT'] },
  { key: 'client-gallery', label: 'navigation.gallery', icon: <PhotoLibrary />, path: '/client/gallery', roles: ['CLIENT'] },
  { key: 'client-analytics', label: 'navigation.analytics', icon: <Analytics />, path: '/client/analytics', roles: ['CLIENT'] },
  { key: 'client-billing', label: 'navigation.billing', icon: <Payment />, path: '/client/billing', roles: ['CLIENT'] },
  
  // Admin menu items
  { key: 'admin-dashboard', label: 'navigation.dashboard', icon: <Dashboard />, path: '/admin/dashboard', roles: ['ADMIN'] },
  { key: 'admin-clients', label: 'navigation.clients', icon: <People />, path: '/admin/clients', roles: ['ADMIN'] },
  { key: 'admin-payments', label: 'navigation.payments', icon: <AttachMoney />, path: '/admin/payments', roles: ['ADMIN'] },
  { key: 'admin-logs', label: 'navigation.logs', icon: <Article />, path: '/admin/logs', roles: ['ADMIN'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const filteredMenuItems = menuItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      onClose={onClose}
      sx={{
        width: open ? SIDEBAR_WIDTH : SIDEBAR_CLOSED_WIDTH,
        flexShrink: 0,
        transition: 'width 0.3s ease-in-out',
        '& .MuiDrawer-paper': {
          width: open ? SIDEBAR_WIDTH : SIDEBAR_CLOSED_WIDTH,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
          backgroundColor: '#fafafa',
          borderRight: '1px solid #e8e8e8',
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List sx={{ px: 0 }}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minHeight: 48,
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.lighter',
                  borderRight: '3px solid',
                  borderRightColor: 'primary.main',
                },
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={i18n.t(item.label)}
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '0.875rem',
                    whiteSpace: 'nowrap',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
