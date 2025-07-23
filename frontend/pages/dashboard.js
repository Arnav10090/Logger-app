import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Box, Typography, Paper, Grid, keyframes } from '@mui/material';
import { StatCard, ChartCard } from '../components/dashboard';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import StorageIcon from '@mui/icons-material/Storage';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { red, blue, green, orange, purple, grey } from '@mui/material/colors';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { useTranslation } from 'react-i18next';
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement,
  PointElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend
);
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const chartTheme = {
  colors: {
    error: red[500],
    warning: orange[500],
    info: blue[500],
    success: green[500],
    other: purple[500],
    background: 'rgba(0, 0, 0, 0.02)'
  },
  spacing: 3,
  borderRadius: 3
};
const chartOptions = (title, isBarChart = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'top',
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 8,
      },
      display: !isBarChart
    },
    title: { 
      display: true, 
      text: title,
      font: { 
        size: 16, 
        weight: '600',
        family: '"Roboto", "Helvetica", "Arial", sans-serif'
      },
      padding: { bottom: 15 }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { weight: '500' },
      padding: 12,
      cornerRadius: 4,
      displayColors: true,
      mode: 'nearest',
      intersect: false,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          if (context.parsed !== null) {
            label += new Intl.NumberFormat('en-US').format(context.parsed);
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        font: {
          size: 16
        },
        ...(isBarChart && {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          padding: 10
        })
      },
      ...(isBarChart && {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.02)',
          drawBorder: false
        }
      })
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.04)',
        drawBorder: false
      },
      ticks: {
        font: {
          size: 16
        },
        callback: function(value) {
          return new Intl.NumberFormat('en-US').format(value);
        }
      }
    }
  },
  elements: {
    bar: {
      borderRadius: 4,
      borderSkipped: 'bottom',
    },
    line: {
      tension: 0.3,
      borderWidth: 2,
      fill: false
    },
    point: {
      radius: 4,
      hoverRadius: 6,
      borderWidth: 2,
      hoverBorderWidth: 2
    }
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  layout: {
    padding: {
      top: 10,
      right: 0,
      bottom: 10,
      left: 10
    }
  }
});
import { useState, useMemo } from 'react';
export default function Dashboard() {
  const { t } = useTranslation();
  const weekRangeStart = new Date(2025, 0, 13);
  let weekRangeEnd = new Date(2025, 5, 18);  
  weekRangeStart.setHours(0,0,0,0);
  weekRangeEnd.setHours(0,0,0,0);
  let lastSunday = new Date(weekRangeEnd);
  lastSunday.setDate(weekRangeEnd.getDate() - weekRangeEnd.getDay());
  weekRangeEnd = new Date(lastSunday);
  weekRangeEnd.setDate(lastSunday.getDate() + 6);
  const allSundays = useMemo(() => {
    let sundays = [];
    let d = new Date(weekRangeStart);
    if (d.getDay() !== 0) {
      d.setDate(d.getDate() + (7 - d.getDay()));
    }
    while (d <= weekRangeEnd) {
      sundays.push(new Date(d));
      d = new Date(d);
      d.setDate(d.getDate() + 7);
    }
    return sundays;
  }, []);
  const [selectedWeek, setSelectedWeek] = useState(allSundays.length - 1);
  const weekMarks = useMemo(() =>
    allSundays.map((d, i) => ({
      value: i,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })),
    [allSundays]
  );
  const getWeekOffset = (sundayDate) => {
    const now = new Date();
    now.setHours(0,0,0,0);
    const thisSunday = new Date(now);
    thisSunday.setDate(now.getDate() - now.getDay());
    const diffMs = sundayDate - thisSunday;
    return Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
  };
  const { data: stats, isLoading } = useQuery({
    queryKey: ['logStats', selectedWeek],
    queryFn: async () => {
      const weekOffset = getWeekOffset(allSundays[selectedWeek]);
      const res = await api.get(`/logs/stats?week=${weekOffset}`);
      return res.data;
    },
    enabled: allSundays.length > 0
  });
  const pieChartData = {
    labels: stats?.logsByLevel?.map(l => t(l._id)) || [],
    datasets: [{
      data: stats?.logsByLevel?.map(l => l.count) || [],
      backgroundColor: [
        chartTheme.colors.error,
        chartTheme.colors.warning,
        chartTheme.colors.info,
        chartTheme.colors.success,
        chartTheme.colors.other
      ],
      borderWidth: 0,
      hoverOffset: 10
    }]
  };
  const logsByApp = stats?.logsByApp || [];
  console.log('Logs by app:', JSON.stringify(logsByApp, null, 2));
  const allAppNames = [
    'InventorySystem',
    'UserPortal',
    'AuthService',
    'PaymentGateway',
    'AnalyticsEngine'
  ];
  const appDisplayNames = {
    'InventorySystem': 'Inventory System',
    'UserPortal': 'User Portal',
    'AuthService': 'Auth Service',
    'PaymentGateway': 'Payment Gateway',
    'AnalyticsEngine': 'Analytics Engine'
  };
  const appCounts = {};
  logsByApp.forEach(item => {
    appCounts[item._id] = item.count;
  });
  const appNames = allAppNames.map(app => appDisplayNames[app] || app);
  const logCounts = allAppNames.map(app => appCounts[app] || 0);
  console.log('All app names:', appNames);
  console.log('Log counts:', logCounts);
  console.log('App Names:', appNames);
  console.log('Log Counts:', logCounts);
  console.log('App Counts:', appCounts);
  const barChartData = {
    labels: appNames,
    datasets: [{
      label: t('Number of Logs'),
      data: logCounts,
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)', 
        'rgba(255, 99, 132, 0.7)', 
        'rgba(75, 192, 192, 0.7)', 
        'rgba(255, 159, 64, 0.7)', 
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 205, 86, 0.7)', 
        'rgba(201, 203, 207, 0.7)' 
      ],
      borderColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(255, 159, 64)',
        'rgb(153, 102, 255)',
        'rgb(255, 205, 86)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1,
      barPercentage: 1.0,
      categoryPercentage: 0.8,
    }]
  };
  const formatErrorTrendData = (dailyTrends = []) => {
    if (!dailyTrends || dailyTrends.length === 0) return [];
    return [...dailyTrends].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  };
  const errorTrendData = formatErrorTrendData(stats?.dailyTrends);
  const hasErrorData = errorTrendData.length > 0;
  const getWeekRange = (weekOffset = 0) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentSunday = new Date(today);
    currentSunday.setDate(today.getDate() - today.getDay());
    const startDate = new Date(currentSunday);
    startDate.setDate(currentSunday.getDate() + (weekOffset * 7));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    const formatDate = (date) => date.toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };
  const currentWeekRange = getWeekRange(selectedWeek);
  const gradientBackground = {
    id: 'gradientBackground',
    beforeDraw(chart) {
      if (!chart.chartArea) return;
      const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;
      ctx.save();
      const gradient = ctx.createLinearGradient(0, top, 0, bottom);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
      ctx.fillStyle = gradient;
      ctx.fillRect(left, top, width, height);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      const yAxis = chart.scales.y;
      const yInterval = (yAxis.max - yAxis.min) / yAxis.ticks.length;
      for (let i = 0; i <= yAxis.ticks.length; i++) {
        const y = yAxis.getPixelForValue(yAxis.min + (i * yInterval));
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
      }
      ctx.restore();
    }
  };
  const appErrorData = (stats?.logsByApp || []).filter(app => app._id && app.count > 0);
  const lineChartData = {
    labels: appErrorData.map(d => d._id),
    datasets: [{
      label: 'Error Logs by Application',
      data: appErrorData.map(d => d.count),
      borderColor: '#e74c3c',
      backgroundColor: (context) => {
        if (!context.chart.chartArea) return;
        const { ctx, chartArea: { top, bottom } } = context.chart;
        const gradient = ctx.createLinearGradient(0, top, 0, bottom);
        gradient.addColorStop(0, 'rgba(231, 76, 60, 0.3)');
        gradient.addColorStop(1, 'rgba(231, 76, 60, 0.05)');
        return gradient;
      },
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#e74c3c',
      pointRadius: 5,
      pointHoverRadius: 8,
      pointBorderWidth: 2,
      pointHoverBorderWidth: 3,
      borderWidth: 2,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffsetX: 0,
      shadowOffsetY: 2,
      shadowBlur: 4
    }]
  };
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 16 },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => ` ${context.parsed.y} error logs`,
          title: (context) => {
            const dayData = errorTrendData[context[0].dataIndex];
            return [
              dayData.dayName,
              `Most recent: ${new Date(dayData.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}`
            ];
          }
        }
      },
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 12,
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: 'Error Logs by Day of Week',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          bottom: 20
        }
      }
    },
    scales: {
      x: {
        grid: { 
          display: false, 
          drawBorder: false 
        },
        ticks: {
          maxRotation: 0,
          padding: 10,
          font: {
            weight: '600',
            size: 20
          }
        },
        title: {
          display: true,
          text: 'Day of Week',
          font: {
            weight: 'bold',
            size: 18
          }
        }
      },
      y: {
        grid: { 
          display: true, 
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        beginAtZero: true,
        ticks: {
          precision: 0,
          padding: 10,
          font: {
            weight: '600',
            size: 20
          },
          callback: (value) => value === 0 ? '0' : value.toLocaleString()
        },
        title: {
          display: true,
          text: 'Number of Error Logs',
          font: {
            weight: 'bold',
            size: 18
          }
        }
      }
    },
    elements: {
      line: { 
        tension: 0.4 
      }
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    }
  };
  lineChartOptions.plugins.gradientBackground = gradientBackground;
  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        {}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            color: 'text.primary',
            mb: 1
          }}>
            {t('Dashboard')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('Monitor and analyze your application logs in real-time')}
          </Typography>
        </Box>
        {}
        <Grid container spacing={2} sx={{ width: '100%', margin: 0 }}>
          {}
          <Grid item xs={12} md={3} sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            width: '34%',
            minWidth: '300px',
            marginRight: 2
          }}>
            <Grid container spacing={2} sx={{ 
              flex: 1, 
              width: '100%',
              margin: 0,
              '& > .MuiGrid-item': {
                paddingLeft: '12px',
                paddingTop: '8px',
                '&:nth-child(odd)': {
                  paddingRight: '6px',
                  paddingLeft: 0
                },
                '&:nth-child(even)': {
                  paddingLeft: '6px',
                  paddingRight: 0
                },
                '&:nth-child(n+3)': {
                  paddingTop: '16px'
                }
              }
            }}>
              <Grid item xs={6} sx={{ 
                display: 'flex',
                width: 'calc(49% - 6px)',
                margin: 0
              }}>
                <StatCard 
                  title={t('Total Logs')} 
                  value={new Intl.NumberFormat().format(stats?.totalLogs || 0)} 
                  icon={StorageIcon} 
                  loading={isLoading} 
                  color={blue[600]}
                />
              </Grid>
              <Grid item xs={6} sx={{ 
                display: 'flex',
                width: 'calc(49% - 6px)',
                margin: 0
              }}>
                <StatCard 
                  title={t('Errors Today')} 
                  value={new Intl.NumberFormat().format(stats?.errorsToday || 0)} 
                  icon={ErrorOutlineIcon} 
                  loading={isLoading}
                  color={red[600]}
                />
              </Grid>
              <Grid item xs={6} sx={{ 
                display: 'flex',
                width: 'calc(49% - 6px)',
                margin: 0
              }}>
                <StatCard 
                  title={t('Avg Response')} 
                  value={`${stats?.avgResponseTime?.toFixed(2) || 0}ms`} 
                  icon={SpeedIcon} 
                  loading={isLoading}
                  color={green[600]}
                />
              </Grid>
              <Grid item xs={6} sx={{ 
                display: 'flex',
                width: 'calc(49% - 6px)',
                margin: 0
              }}>
                <StatCard 
                  title={t('Active Users')} 
                  value={new Intl.NumberFormat().format(stats?.usersOnline || 0)} 
                  icon={PeopleIcon} 
                  loading={isLoading}
                  color={purple[600]}
                />
              </Grid>
            </Grid>
          </Grid>
          {}
          <Grid item xs={12} md={8} sx={{ 
            flex: 1, 
            minWidth: 0,
            maxWidth: 'calc(65% - 24px)'
          }}>
            <Grid container spacing={2}>
              {}
              <Grid item xs={12}>
                <ChartCard title={t('Log Distribution')} icon={PieChartIcon}>
                  <Box sx={{ height: 300, maxHeight: '100%', boxShadow: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', p: 1 }}>
                    <Pie 
                      data={pieChartData} 
                      options={{
                        ...chartOptions(t('Log Distribution'), false, 12, { 
                          legendFont: 11, 
                          legendPosition: 'bottom', 
                          padding: 8 
                        }),
                        maintainAspectRatio: false,
                        responsive: true
                      }}
                    />
                  </Box>
                </ChartCard>
              </Grid>
              {}
              <Grid item xs={12}>
                <ChartCard title={t('Logs by Application')} icon={BarChartIcon}>
                  <Box sx={{ height: 300, maxHeight: '100%', boxShadow: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)', p: 1 }}>
                    <Bar 
                      data={barChartData} 
                      options={{
                        ...chartOptions(t('Logs by Application'), true, 12, { 
                          padding: 8, 
                          maxBarThickness: 24 
                        }),
                        indexAxis: 'x',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: (context) => `${context.parsed.y} logs`
                            }
                          }
                        },
                        scales: {
                          x: {
                            title: {
                              display: true,
                              text: 'Application Name',
                              font: { weight: 'bold' }
                            }
                          },
                          y: {
                            beginAtZero: true,
                            min: 0,
                            grid: { color: 'rgba(0, 0, 0, 0.04)' },
                            title: {
                              display: true,
                              text: 'Number of Logs',
                              font: { weight: 'bold' }
                            }
                          }
                        },
                        elements: {
                          bar: {
                            borderRadius: 4,
                            borderSkipped: false,
                          }
                        }
                      }}
                    />
                  </Box>
                </ChartCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <ChartCard
            title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ShowChartIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="div">
                  {t('Error Trends (This Week)')}
                </Typography>
              </Box>
            }
            fullWidth
          >
            <Box sx={{ height: 400, width: '100%', position: 'relative' }}>
              <Line 
                data={{
                  labels: logsByApp?.map(app => app._id) || [],
                  datasets: [{
                    label: 'Error Logs',
                    data: logsByApp?.map(app => app.count) || [],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#e74c3c',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#e74c3c',
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        usePointStyle: true,
                        padding: 20
                      }
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                      callbacks: {
                        label: (context) => `${context.parsed.y} errors`
                      }
                    }
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Application',
                        font: { weight: 'bold' }
                      },
                      grid: { display: false },
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      }
                    },
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Number of Errors',
                        font: { weight: 'bold' }
                      },
                      grid: { color: 'rgba(0, 0, 0, 0.05)' },
                      ticks: { precision: 0 }
                    }
                  },
                  elements: {
                    line: { borderWidth: 2, tension: 0.3 },
                    point: {
                      radius: 4,
                      hoverRadius: 6,
                      borderWidth: 2
                    }
                  }
                }}
              />
            </Box>
          </ChartCard>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}