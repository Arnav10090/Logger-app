// Date range constants
export const WEEK_RANGE_START = new Date(2025, 0, 13);
export const WEEK_RANGE_END = new Date(2025, 5, 18);  
export const CHART_THEME = {
  colors: {
    error: '#f44336',    
    warning: '#ff9800',  
    info: '#2196f3',     
    success: '#4caf50',  
    other: '#9c27b0',    
    background: 'rgba(0, 0, 0, 0.02)'
  },
  spacing: 3,
  borderRadius: 3
};
export const gradientAnimation = `
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
export const DEFAULT_CHART_OPTIONS = {
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
    },
    title: { 
      display: true, 
      font: { 
        size: 16, 
        weight: '600',
        family: '"Roboto", "Helvetica", "Arial", sans-serif'
      },
      padding: { bottom: 15 }
    }
  }
};
