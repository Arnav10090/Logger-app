import React from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
const StatCard = ({ title, value, icon: Icon, loading, color = '#f44336' }) => (
  <Paper
    elevation={4}
    sx={{
      p: 1,
      width: '90%',
      height: '70%',
      minHeight: 80,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: 3,
      background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
      borderLeft: `4px solid ${color}`,
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: (theme) => theme.shadows[10],
      },
      boxSizing: 'border-box',
    }}
  >
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      gap: 1
    }}>
      {loading ? (
        <CircularProgress size={24} sx={{ color, margin: 'auto' }} />
      ) : (
        <>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography noWrap variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 'medium', lineHeight: 1 }}>
              {title}
            </Typography>
            <Typography noWrap variant="h4" sx={{ color, fontWeight: 600, mt: 0.5, lineHeight: 1.2 }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ 
            color,
            fontSize: 20,
            opacity: 0.8,
            p: 0.5,
            flexShrink: 0,
            borderRadius: '50%',
            bgcolor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& > svg': {
              fontSize: 'inherit',
              display: 'block'
            }
          }}>
            <Icon sx={{ fontSize: 'inherit' }} />
          </Box>
        </>
      )}
    </Box>
  </Paper>
);
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  loading: PropTypes.bool,
  color: PropTypes.string
};
export default StatCard;
