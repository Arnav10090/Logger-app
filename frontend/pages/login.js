import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Box, TextField, Typography, Paper, Avatar, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from '../components/SnackbarContext';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useThemeContext } from '../components/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { mode, toggleTheme } = useThemeContext();
  const onSubmit = ({ username, password }) => {
    setLoading(true);
    setLoginError('');
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        showSnackbar('Login successful!', 'success');
        router.push('/dashboard');
      } else {
        setLoginError('Invalid username or password');
      }
      setLoading(false);
    }, 2000);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, fontWeight: 'bold', fontSize: 48, mb: 2 }}>
        L
      </Avatar>
      <Typography variant="h3" sx={{ fontWeight: 'bold', letterSpacing: 2, mb: 1, color: 'text.primary' }}>
        Logger Pro
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Your all-in-one logging solution.
      </Typography>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Log In
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            {...register('username', { required: 'Username is required' })}
            error={!!errors.username}
            helperText={errors.username?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password', { required: 'Password is required' })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          {loginError && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{loginError}</Typography>}
          <Typography color="error" variant="body2" align="center" sx={{ mt: 2, mb: 1 }}>
            Login Credentials: admin / admin
          </Typography>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="error"
            loading={loading}
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 'bold',
              boxShadow: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                boxShadow: 6,
                transform: 'scale(1.02)',
              },
            }}
          >
            Log In
          </LoadingButton>
        </Box>
      </Paper>
    </Box>
  );
} 