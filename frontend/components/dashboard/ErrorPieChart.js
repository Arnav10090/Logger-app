import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { CHART_THEME } from '../../utils/dashboardConstants';
const ErrorPieChart = ({ errorDistribution = [], loading = false, sx = {} }) => {
  const chartData = React.useMemo(() => ({
    labels: errorDistribution.map(item => item.severity),
    datasets: [
      {
        data: errorDistribution.map(item => item.count),
        backgroundColor: [
          CHART_THEME.colors.error,
          CHART_THEME.colors.warning,
          CHART_THEME.colors.info,
          CHART_THEME.colors.success,
          CHART_THEME.colors.other,
        ],
        borderWidth: 0,
        hoverOffset: 15,
        borderRadius: 4,
      },
    ],
  }), [errorDistribution]);
  const options = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '65%',
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  }), []);
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          minHeight: 300,
          ...sx 
        }}
      >
        <Box className="spinner" />
      </Box>
    );
  }
  if (!errorDistribution || errorDistribution.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          minHeight: 300,
          color: 'text.secondary',
          ...sx 
        }}
      >
        No data available
      </Box>
    );
  }
  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: 300, ...sx }}>
      <Pie data={chartData} options={options} />
    </Box>
  );
};
ErrorPieChart.propTypes = {
  errorDistribution: PropTypes.arrayOf(
    PropTypes.shape({
      severity: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ),
  loading: PropTypes.bool,
  sx: PropTypes.object,
};
export default ErrorPieChart;
