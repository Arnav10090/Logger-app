import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a CustomThemeProvider');
  }
  return context;
}

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('themeMode');
      if (savedMode && ['light', 'dark'].includes(savedMode)) {
        setMode(savedMode);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('themeMode', newMode);
      } catch (error) {
        console.error('Error saving theme to localStorage:', error);
      }
      return newMode;
    });
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#d32f2f' : '#ef5350',
          },
          secondary: {
            main: mode === 'light' ? '#b71c1c' : '#e57373',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: 'background-color 0.3s ease',
              },
            },
          },
        },
      }),
    [mode]
  );

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
    }),
    [mode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};