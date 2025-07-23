import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { CHART_THEME } from '../../utils/dashboardConstants';
const ErrorTrendsLineChart = ({ weeklyTrends = [], loading = false, sx = {} }) => {
  const chartData = React.useMemo(() => {
    const sortedTrends = [...weeklyTrends].sort((a, b) => 
      new Date(a.weekStart) - new Date(b.weekStart)
    );
    return {
      labels: sortedTrends.map(item => {
        const date = new Date(item.weekStart);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Weekly Errors',
          data: sortedTrends.map(item => item.count),
          borderColor: CHART_THEME.colors.error,
          backgroundColor: `${CHART_THEME.colors.error}20`,
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: CHART_THEME.colors.error,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: CHART_THEME.colors.error,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }, [weeklyTrends]);
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
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
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
    elements: {
      line: {
        fill: true,
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
  if (!weeklyTrends || weeklyTrends.length === 0) {
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
      <Line data={chartData} options={options} />
    </Box>
  );
};
ErrorTrendsLineChart.propTypes = {
  weeklyTrends: PropTypes.arrayOf(
    PropTypes.shape({
      weekStart: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ),
  loading: PropTypes.bool,
  sx: PropTypes.object,
};
export default ErrorTrendsLineChart;
