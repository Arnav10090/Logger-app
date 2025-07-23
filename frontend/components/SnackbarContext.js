import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Snackbar, Alert, Fade } from '@mui/material';

/**
 * @typedef {Object} SnackbarContextType
 * @property {function(string, string=): void} showSnackbar - Function to show a snackbar
 */

const SnackbarContext = createContext(undefined);

/**
 * Hook to use the snackbar context
 * @returns {Object} The snackbar context
 * @throws {Error} If used outside of a SnackbarProvider
 */
export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

/**
 * Snackbar provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The snackbar provider
 */
export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const contextValue = useMemo(() => ({
    showSnackbar,
  }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Fade}
        sx={{
          '& .MuiPaper-root': {
            minWidth: '300px',
          },
        }}
      >
        <Alert 
          onClose={handleClose} 
          severity={snackbar.severity} 
          elevation={6} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}