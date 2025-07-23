import React, { useMemo } from 'react';
import {
  Box, Paper, Grid, TextField, Button, ButtonGroup, Stack, Chip, Autocomplete, InputAdornment, IconButton, Fade
} from '@mui/material';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enGBLocale from 'date-fns/locale/en-GB';
import esLocale from 'date-fns/locale/es';
import frLocale from 'date-fns/locale/fr';
import deLocale from 'date-fns/locale/de';
import zhLocale from 'date-fns/locale/zh-CN';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { LOG_LEVELS } from '../constants';
import { useTranslation } from 'react-i18next';
import { format as formatDateFns, parse as parseDateFns } from 'date-fns';

const levelColors = {
  info: 'primary',
  error: 'error',
  warn: 'warning',
  debug: 'info',
};

const localeMap = {
  en: enGBLocale,
  es: esLocale,
  fr: frLocale,
  de: deLocale,
  zh: zhLocale,
};

function FilterSummaryChip({ filters, t }) {
  const count = useMemo(() => Object.values(filters).filter(Boolean).length, [filters]);
  if (count === 0) return null;
  return (
    <Chip
      label={t('{{count}} filters applied', { count })}
      color="primary"
      size="small"
      sx={{ ml: 2, fontWeight: 500 }}
    />
  );
}

export default function LogFilters({ filters, onChange, t }) {
  const { i18n } = useTranslation();
  const currentLocale = localeMap[i18n.language] || enGBLocale;
  const levelOptions = LOG_LEVELS.map(option => ({
    value: option.value,
    label: t(option.label || option.value),
    color: levelColors[option.value] || 'default',
  }));
  const selectedLevel = levelOptions.find(opt => opt.value === filters.Level) || null;
  return (
    <Fade in={true} timeout={500}>
      <div>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            boxShadow: 3,
            mb: 3,
            transition: 'box-shadow 0.3s, border-color 0.3s',
            '&:hover': { boxShadow: 8, borderColor: 'primary.main' },
            border: '1.5px solid',
            borderColor: 'transparent',
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <FilterAltIcon color="error" sx={{ mr: 1 }} />
            <Box flexGrow={1}>
              <span style={{ fontWeight: 700, fontSize: 20, color: '#d32f2f', letterSpacing: 1 }}>{t('Filters')}</span>
              <FilterSummaryChip filters={filters} t={t} />
            </Box>
            <ButtonGroup variant="outlined" sx={{ ml: 2 }}>
              <Button
                onClick={() => {
                  [
                    'AppName', 'UserId', 'LogId', 'Level', 'from', 'fromTime', 'to', 'toTime',
                  ].forEach(name => onChange({ target: { name, value: '' } }));
                }}
                color="error"
                startIcon={<DeleteIcon />}
                sx={{ fontWeight: 500, borderRadius: 2, px: 2 }}
              >
                {t('Clear All')}
              </Button>
              {}
            </ButtonGroup>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={currentLocale}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label={t('App Name')}
                  name="AppName"
                  value={filters.AppName || ''}
                  onChange={onChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <TextField
                  label={t('User ID')}
                  name="UserId"
                  value={filters.UserId || ''}
                  onChange={onChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="number"
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <TextField
                  label={t('Log ID')}
                  name="LogId"
                  value={filters.LogId || ''}
                  onChange={onChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                  options={levelOptions}
                  value={selectedLevel}
                  onChange={(_, val) => onChange({ target: { name: 'Level', value: val ? val.value : '' } })}
                  getOptionLabel={option => option.label}
                  isOptionEqualToValue={(opt, val) => opt.value === val.value}
                  renderInput={params => (
                    <TextField {...params} label={t('Level')} size="small" variant="outlined" fullWidth sx={{ minWidth: 120 }} />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.value} style={{ minWidth: 90 }}>
                      <Chip label={option.label} color={option.color} size="small" sx={{ mr: 1, whiteSpace: 'nowrap', overflow: 'visible', textOverflow: 'unset', fontWeight: 500 }} />
                    </li>
                  )}
                  clearOnEscape
                  fullWidth
                  sx={{ minWidth: 120 }}
                  ListboxProps={{ sx: { minWidth: 120 } }}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 1 }}>
                  <DatePicker
                    label={t('From')}
                    value={filters.from ? parseDateFns(filters.from, 'dd-MM-yyyy', new Date()) : null}
                    onChange={date => onChange({ target: { name: 'from', value: date ? formatDateFns(date, 'dd-MM-yyyy') : '' } })}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        placeholder: t('dd-MM-yyyy'),
                        InputProps: {
                          endAdornment: (
                            filters.from ? (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => onChange({ target: { name: 'from', value: '' } })}
                                  edge="end"
                                  size="small"
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ) : null
                          ),
                        },
                      },
                    }}
                    format={t('dd-MM-yyyy')}
                    sx={{ minWidth: 160 }}
                  />
                  <TimePicker
                    label={t('From Time')}
                    value={filters.fromTime ? filters.fromTime : null}
                    onChange={val => onChange({ target: { name: 'fromTime', value: val ? val : '' } })}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        placeholder: t('--:--'),
                      },
                    }}
                    sx={{ minWidth: 120 }}
                  />
                  <DatePicker
                    label={t('To')}
                    value={filters.to ? parseDateFns(filters.to, 'dd-MM-yyyy', new Date()) : null}
                    onChange={date => onChange({ target: { name: 'to', value: date ? formatDateFns(date, 'dd-MM-yyyy') : '' } })}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        placeholder: t('dd-MM-yyyy'),
                        InputProps: {
                          endAdornment: (
                            filters.to ? (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => onChange({ target: { name: 'to', value: '' } })}
                                  edge="end"
                                  size="small"
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ) : null
                          ),
                        },
                      },
                    }}
                    format={t('dd-MM-yyyy')}
                    sx={{ minWidth: 160 }}
                  />
                  <TimePicker
                    label={t('To Time')}
                    value={filters.toTime ? filters.toTime : null}
                    onChange={val => onChange({ target: { name: 'toTime', value: val ? val : '' } })}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        placeholder: t('--:--'),
                      },
                    }}
                    sx={{ minWidth: 120 }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </LocalizationProvider>
          {}
        </Paper>
      </div>
    </Fade>
  );
}