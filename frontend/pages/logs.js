import React, { useState, useCallback, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Box, Typography, IconButton, Collapse, Paper, useTheme } from '@mui/material';
import LogFilters from '../components/LogFilters';
import LogsTable from '../components/LogsTable';
import { useQuery } from '@tanstack/react-query';
import { buildQuery } from '../utils/query';
import { PAGE_SIZE } from '../constants';
import api from '../utils/axios';
import ErrorAlert from '../components/ErrorAlert';
import ListAltIcon from '@mui/icons-material/ListAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTranslation } from 'react-i18next';
export default function Logs() {
  const theme = useTheme();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(true);
  
  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };
  
  const handleFilterChange = useCallback((e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  }, []);
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['logs', filters, page],
    queryFn: async () => {
      try {
        const queryFilters = { ...filters };
        if (queryFilters.from && queryFilters.fromTime) {
          queryFilters.from = `${queryFilters.from}T${queryFilters.fromTime}`;
        }
        if (queryFilters.to && queryFilters.toTime) {
          queryFilters.to = `${queryFilters.to}T${queryFilters.toTime}`;
        }
        const query = buildQuery(queryFilters, page, PAGE_SIZE);
        const res = await api.get(`/logs?${query}`);
        return {
          data: Array.isArray(res?.data?.data) ? res.data.data : [],
          totalPages: res?.data?.totalPages || 1,
          totalItems: res?.data?.totalItems || 0
        };
      } catch (err) {
        console.error('Error fetching logs:', err);
        throw new Error(t('Failed to load logs. Please try again later.'));
      }
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 1
  });
  
  // Memoize the table data to prevent unnecessary re-renders
  const tableData = useMemo(() => ({
    logs: Array.isArray(data?.data) ? data.data : [],
    totalPages: data?.totalPages || 1,
    totalItems: data?.totalItems || 0,
    loading: isLoading,
    error: isError ? (error?.message || t('Failed to load logs.')) : null
  }), [data, isLoading, isError, error, t]);
  
  return (
    <DashboardLayout>
      <Box 
        component="main"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          flexGrow: 1,
          p: { xs: 2, md: '16px 16px 16px 0' },
          width: { xs: '100%', md: `calc(100% - 20px)` },
          ml: { md: '20px' },
          maxWidth: 'none',
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3, 
            gap: 2, 
            width: '100%',
            backgroundColor: theme.palette.background.paper,
            p: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[1]
          }}
        >
          <ListAltIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {t('View Your Logs')}
          </Typography>
        </Box>

        <Paper 
          elevation={0}
          sx={{ 
            mb: 3, 
            borderRadius: 2, 
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box 
            onClick={toggleFilters}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              backgroundColor: theme.palette.action.hover,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.action.selected
              }
            }}
          >
            <FilterListIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 'medium' }}>
              {t('Filters')}
            </Typography>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                toggleFilters();
              }}
            >
              {filtersOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Box>
          <Collapse in={filtersOpen}>
            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <LogFilters filters={filters} onChange={handleFilterChange} t={t} />
            </Box>
          </Collapse>
        </Paper>
        
        {/* Error Alert */}
        {isError && (
          <Box sx={{ mb: 3 }}>
            <ErrorAlert 
              message={error?.message || t('Failed to load logs. Please try again.')} 
              onRetry={() => window.location.reload()}
            />
          </Box>
        )}
        
        {/* Logs Table */}
        <Paper 
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <LogsTable
            logs={tableData.logs}
            page={page}
            totalPages={tableData.totalPages}
            onPageChange={setPage}
            loading={tableData.loading}
            t={t}
          />
        </Paper>
      </Box>
    </DashboardLayout>
  );
} 