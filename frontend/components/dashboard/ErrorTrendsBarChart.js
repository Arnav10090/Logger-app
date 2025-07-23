import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { CHART_THEME } from '../../utils/dashboardConstants';
const ErrorTrendsBarChart = ({ trendData = [], loading = false, sx = {} }) => {
  const chartData = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayMap = Object.fromEntries(
      days.map((_, index) => [index, 0])
    );
    trendData.forEach(day => {
      dayMap[day.dayOfWeek] = day.count;
    });
    return {
      labels: days,
      datasets: [
        {
          label: 'Errors',
          data: Object.values(dayMap),
          backgroundColor: CHART_THEME.colors.error,
          borderColor: CHART_THEME.colors.error,
          borderWidth: 1,
          borderRadius: 4,
          maxBarThickness: 40,
        },
      ],
    };
  }, [trendData]);
  const options = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Errors: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          precision: 0,
        },
      },
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
  if (!trendData || trendData.length === 0) {
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
        No trend data available
      </Box>
    );
  }
  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: 300, ...sx }}>
      <Bar data={chartData} options={options} />
    </Box>
  );
};
ErrorTrendsBarChart.propTypes = {
  trendData: PropTypes.arrayOf(
    PropTypes.shape({
      dayOfWeek: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
    })
  ),
  loading: PropTypes.bool,
  sx: PropTypes.object,
};
export default ErrorTrendsBarChart;
