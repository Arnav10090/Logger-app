import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Typography } from '@mui/material';
const ChartCard = ({ 
  title, 
  icon: Icon, 
  children, 
  height = 400, 
  fullWidth = false,
  sx = {}
}) => (
  <Paper 
    elevation={2} 
    sx={{ 
      p: 3, 
      borderRadius: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gridColumn: fullWidth ? '1 / -1' : 'auto',
      minHeight: height,
      ...sx
    }}
  >
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 3,
      '& svg': {
        color: (theme) => theme.palette.primary.main,
        mr: 1.5
      }
    }}>
      {Icon && <Icon />}
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
    </Box>
    <Box sx={{ flex: 1, position: 'relative' }}>
      {children}
    </Box>
  </Paper>
);
ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  height: PropTypes.number,
  fullWidth: PropTypes.bool,
  sx: PropTypes.object
};
export default ChartCard;
