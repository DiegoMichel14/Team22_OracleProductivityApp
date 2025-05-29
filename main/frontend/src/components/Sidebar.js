import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

/**
 * Sidebar navigation component implementing the design from Figma
 */
const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Tasks', icon: <AssignmentIcon />, path: '/developer' },
    { text: 'Team', icon: <PeopleIcon />, path: '/manager' },
    { text: 'Reports', icon: <BarChartIcon />, path: '/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const isActive = (path) => {
    return location.pathname === path || 
      (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/login');
  };

  return (
    <Box
      sx={{
        width: open ? 240 : 70,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        height: '100%',
        backgroundColor: '#3c3c3c',
        color: 'white',
        overflow: 'hidden',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ 
        py: 2, 
        px: 2, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: open ? 'flex-start' : 'center' 
      }}>
        {/* Oracle logo or app logo here */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            display: open ? 'block' : 'none'
          }}
        >
          ORACLE
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
      
      {/* Main navigation */}
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              py: 1.5,
              px: 2,
              backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.05)',
              },
              borderLeft: isActive(item.path) ? '4px solid #E11D48' : '4px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            <ListItemIcon sx={{ 
              color: isActive(item.path) ? '#E11D48' : 'rgba(255,255,255,0.7)',
              minWidth: open ? 36 : 'auto',
              mr: open ? 2 : 'auto',
              justifyContent: 'center',
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                opacity: open ? 1 : 0,
                color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.7)',
              }} 
            />
          </ListItem>
        ))}
      </List>
      
      {/* Logout section */}
      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <ListItem 
          button 
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)',
            },
          }}
        >
          <ListItemIcon sx={{ 
            color: 'rgba(255,255,255,0.7)',
            minWidth: open ? 36 : 'auto',
            mr: open ? 2 : 'auto',
            justifyContent: 'center',
          }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            sx={{ 
              opacity: open ? 1 : 0,
              color: 'rgba(255,255,255,0.7)',
            }} 
          />
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar;
