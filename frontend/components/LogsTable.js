import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Pagination,
  useTheme,
  Box
} from '@mui/material';
import { formatDate } from '../utils/format';
import JSONPretty from 'react-json-pretty';
export default function LogsTable({ logs = [], page = 1, totalPages = 1, onPageChange, loading = false, t = (str) => str }) {
  const theme = useTheme();
  return (
    <Paper sx={{ 
      width: '100%',
      minHeight: '100%',
      borderRadius: 0, 
      boxShadow: 'none',
      backgroundColor: theme.palette.background.paper,
      '& .MuiTableCell-root': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '12px 16px',
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
      '& .MuiTableContainer-root': {
        width: '100%',
        display: 'table',
        tableLayout: 'auto',
      },
      '& .MuiTable-root': {
        width: '100%',
        tableLayout: 'auto',
      },
      '& .MuiTableHead-root': {
        backgroundColor: theme.palette.background.default,
      }
    }}>
      <Box sx={{ 
        py: 2, 
        display: 'flex', 
        justifyContent: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default
      }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => onPageChange?.(value) || null}
          color="primary"
          shape="rounded"
        />
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ color: 'error.main', fontWeight: 'bold' }}>{t('App Name')}</TableCell>
              <TableCell align="center" sx={{ color: 'error.main', fontWeight: 'bold' }}>{t('Log ID')}</TableCell>
              <TableCell align="center" sx={{ color: 'error.main', fontWeight: 'bold' }}>{t('User ID')}</TableCell>
              <TableCell align="center" sx={{ color: 'error.main', fontWeight: 'bold' }}>{t('Level')}</TableCell>
              <TableCell align="center" sx={{ color: 'error.main', fontWeight: 'bold' }}>{t('TimeStamp')}</TableCell>
              <TableCell align="center" sx={{ color: 'error.main', fontWeight: 'bold' }}>{t('Details')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('No logs found.')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log._id || log.LogId}>
                  <TableCell align="center" sx={{ color: 'text.primary' }}>
                    {log.AppName ? t(log.AppName) : '-'}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'text.primary' }}>
                    {log.LogId || '-'}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'text.primary' }}>
                    {log.UserId || '-'}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'text.primary' }}>
                    {log.Log?.Level ? t(log.Log.Level) : '-'}
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'text.primary' }}>
                    {log.Log?.TimeStamp ? formatDate(log.Log.TimeStamp) : '-'}
                  </TableCell>
                  <TableCell style={{ padding: '8px', textAlign: 'center', width: '30%' }}>
                    <div style={{
                      minHeight: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '12px',
                      boxSizing: 'border-box'
                    }}>
                    {log.Log?.Details && typeof log.Log.Details === 'object' ? (
                      <div style={{ 
                        width: '100%',
                        minHeight: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        overflowX: 'auto',
                        alignItems: 'center'
                      }}>
                        <div style={{ 
                          textAlign: 'left',
                          fontFamily: 'monospace',
                          whiteSpace: 'pre',
                          color: theme.palette.mode === 'dark' ? 'white' : '#d32f2f',
                          fontSize: '14px',
                          lineHeight: '1.4',
                          padding: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '4px',
                          width: '100%',
                          minHeight: '100%',
                          boxSizing: 'border-box'
                        }}>
                          <div style={{ width: '100%' }}>
                            {log.Log?.Details ? (
                              <JSONPretty 
                                data={log.Log.Details} 
                                style={{ 
                                  margin: 0,
                                  padding: 0,
                                  background: 'none',
                                  width: '100%',
                                  overflow: 'auto'
                                }}
                                mainStyle={`padding: 0; color: ${theme.palette.mode === 'dark' ? 'white' : '#d32f2f'}; white-space: pre; background: none; width: 100%;`}
                                keyStyle={`color: ${theme.palette.mode === 'dark' ? 'white' : '#d32f2f'}`}
                                valueStyle={`color: ${theme.palette.mode === 'dark' ? 'white' : '#d32f2f'}`}
                                stringStyle={`color: ${theme.palette.mode === 'dark' ? 'white' : '#d32f2f'}`}
                                booleanStyle={`color: ${theme.palette.mode === 'dark' ? 'white' : '#d32f2f'}`}
                                errorStyle={`color: ${theme.palette.mode === 'dark' ? 'white' : '#d32f2f'}`}
                              />
                            ) : (
                              <span style={{ color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>No details available</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        width: '100%',
                        minHeight: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '12px',
                        boxSizing: 'border-box'
                      }}>
                        <div style={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          width: '100%',
                          minHeight: '100%',
                          textAlign: 'left',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '4px',
                          padding: '12px',
                          width: '100%',
                          minHeight: '100%',
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {log.Log?.Details ? t(String(log.Log.Details)) : '-'}
                        </div>
                      </div>
                    )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ 
        py: 2, 
        display: 'flex', 
        justifyContent: 'center',
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default
      }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => onPageChange?.(value) || null}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Paper>
  );
} 