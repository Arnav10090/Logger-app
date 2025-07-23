import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { red } from '@mui/material/colors';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from 'next/router';
import { useSnackbar } from './SnackbarContext';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';

const SIDEBAR_WIDTH = 290;

const Sidebar = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showSnackbar } = useSnackbar();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { t } = useTranslation();
  
  const navLinks = [
    { label: t('Dashboard'), icon: <DashboardIcon />, path: '/dashboard' },
    { label: t('Logs'), icon: <ListAltIcon />, path: '/logs' },
    { label: t('Settings'), icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleLogout = () => {
    setLogoutLoading(true);
    
    // Show loading for 2 seconds before performing logout
    setTimeout(() => {
      try {
        localStorage.removeItem('isLoggedIn');
        showSnackbar(t('Logged out successfully!'), 'success');
        router.replace('/login');
      } catch (error) {
        console.error('Error during logout:', error);
        showSnackbar(t('Error during logout'), 'error');
      } finally {
        setLogoutLoading(false);
      }
    }, 2000);
  };

  return (
    <Box
      component="nav"
      sx={{
        width: { xs: '100%', md: SIDEBAR_WIDTH },
        position: isMobile ? 'relative' : 'fixed',
        top: 0,
        left: 0,
        height: isMobile ? 'auto' : '100vh',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(180deg, #121212 0%, #1e1e1e 100%)' 
          : 'linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%)',
        p: 0,
        display: 'flex',
        flexDirection: 'column',
        color: theme.palette.text.primary,
        zIndex: theme.zIndex.drawer,
        boxShadow: theme.shadows[4],
        boxShadow: 3,
      }}
    >
      {}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 3, pb: 2 }}>
        <Avatar sx={{ bgcolor: red[500], width: 48, height: 48, fontWeight: 'bold', fontSize: 28, mr: 2 }}>
          L
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: red[500], letterSpacing: 1 }}>
          {t('Logger Pro')}
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.12)', mb: 2 }} />
      {}
      <List sx={{ flexGrow: 1 }}>
        {navLinks.map((link) => (
          <ListItem
            component="div"
            key={link.label}
            selected={router.pathname === link.path}
            onClick={() => router.push(link.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              cursor: 'pointer',
              '&.Mui-selected': { 
                bgcolor: 'rgba(211,47,47,0.15)',
                '&:hover': { bgcolor: 'rgba(211,47,47,0.2)' }
              },
              '&:hover': { bgcolor: 'rgba(211,47,47,0.08)' },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.primary }}>{link.icon}</ListItemIcon>
            <ListItemText primary={<Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{link.label}</Typography>} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.12)', mt: 2, mb: 1 }} />
      {}
      <Box
        sx={{
          p: 3,
          pt: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box 
          display="flex" 
          alignItems="center"
          onClick={() => router.push('/settings')}
          sx={{ 
            cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(211,47,47,0.08)' },
            p: 1,
            borderRadius: 1,
            flexGrow: 1
          }}
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: red[500], fontWeight: 'bold', fontSize: 16, mr: 1 }}>A</Avatar>
          <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>{t('Admin')}</Typography>
        </Box>
        <Box sx={{ ml: 1 }}>
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleLogout}
            loading={logoutLoading}
            size="small"
            sx={{ minWidth: 120, textTransform: 'none', whiteSpace: 'nowrap' }}
          >
            {t('Logout')}
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};
const DashboardLayout = ({ children }) => (
  <Box sx={{ display: 'flex' }}>
    <Sidebar />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 0,
        marginLeft: { md: `${SIDEBAR_WIDTH}px` },
        minHeight: '100vh',
        width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        maxWidth: 'none',
        overflowX: 'hidden',
      }}
    >
      {children}
    </Box>
  </Box>
);
export default DashboardLayout;