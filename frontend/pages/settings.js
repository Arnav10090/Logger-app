import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
  Box, Typography, Paper, Switch, Button, Avatar, Divider, IconButton, Card, CardContent, Stack, Autocomplete, TextField, Snackbar, Alert, Fab, Chip, Tooltip, Accordion, AccordionSummary, AccordionDetails, Fade
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SettingsIcon from '@mui/icons-material/Settings';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { red } from '@mui/material/colors';
import { useThemeContext } from '../components/ThemeContext';
import { useSnackbar } from '../components/SnackbarContext';
import { keyframes } from '@mui/system';
import { useTranslation } from 'react-i18next';
import i18n from '../utils/i18n';
const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
];
const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York (UTC-5)' },
  { value: 'Europe/London', label: 'London (UTC+0)' },
  { value: 'Asia/Kolkata', label: 'India (UTC+5:30)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
];
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(211,47,47,0.7); }
  70% { box-shadow: 0 0 0 10px rgba(211,47,47,0); }
  100% { box-shadow: 0 0 0 0 rgba(211,47,47,0); }
`;
function ProfileCard({ profilePic, setProfilePic, fileInputRef }) {
  const { t } = useTranslation();
  return (
    <Card elevation={0} sx={{
      p: 0,
      borderRadius: 5,
      overflow: 'visible',
      position: 'relative',
      background: 'rgba(30,30,30,0.45)',
      boxShadow: '0 8px 32px 0 rgba(31,38,135,0.25)',
      backdropFilter: 'blur(16px)',
      border: '1.5px solid rgba(255,255,255,0.12)',
      minWidth: 260,
      maxWidth: 340,
      mx: 'auto',
    }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: '24px !important' }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={profilePic}
            sx={{ width: 110, height: 110, bgcolor: red[500], fontWeight: 'bold', fontSize: 54, mx: 'auto', mb: 2, boxShadow: 3, border: '3px solid #fff', cursor: 'pointer' }}
            onClick={() => fileInputRef.current.click()}
          >
            {!profilePic && 'A'}
          </Avatar>
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              bgcolor: 'background.paper',
              color: 'primary.main',
              boxShadow: 2,
              border: '2px solid #fff',
              zIndex: 2,
              transform: 'translate(25%, 25%)',
            }}
            onClick={() => fileInputRef.current.click()}
            size="small"
          >
            <PhotoCamera />
          </IconButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setProfilePic(URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
          {profilePic && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt: 1 }}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ fontWeight: 500, textTransform: 'none', mb: 1, px: 4 }}
                onClick={() => setProfilePic(null)}
              >
                {t('Remove')}
              </Button>
            </Box>
          )}
          </Box>
          <Chip
            label={t('Pro')}
            icon={<StarIcon sx={{ color: '#fff' }} />}
            sx={{
              bgcolor: red[500],
              color: '#fff',
              fontWeight: 'bold',
              px: 1.5,
              py: 0.5,
              fontSize: 14,
              borderRadius: 2,
              animation: `${pulse} 1.5s infinite`,
              boxShadow: '0 0 8px 2px rgba(211,47,47,0.4)',
              mt: 1.5,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1, mt: 1, color: '#fff' }}>
            {t('Admin User')}
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.7)">
            {t('Admin') + '@' + t('loggerpro') + t('.com')}
          </Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.5)" sx={{ mt: 1 }}>
            {t('Last login')}: {t('Today')}, 10:12 {t('PM')}
          </Typography>
        </CardContent>
      </Card>
  );
}
const SETTINGS_CARD_SX = {
  width: { xs: '100%', sm: 420 },
  minWidth: { xs: '100%', sm: 420 },
  maxWidth: { xs: '100%', sm: 420 },
  height: 220,
  minHeight: 220,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: 4,
  p: 2,
  boxShadow: 3,
  background: (theme) => theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.7)' : '#fff',
};
const SETTINGS_CARD_CONTENT_SX = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: 4,
  background: (theme) => theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.7)' : '#fff',
  p: 2,
  boxShadow: 3,
};
function GeneralSettingsCard({ mode, toggleTheme, language, setLanguage, timezone, setTimezone, onlyLanguage = false, onlyTimezone = false, onlyDarkMode = false, sx, t = (key) => key }) {
  if (onlyDarkMode) {
    return (
      <Card elevation={3} sx={{ ...SETTINGS_CARD_SX, ...sx }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="subtitle1" fontWeight={600}>{t('Dark Mode')}</Typography>
            <Tooltip title={t('What is Dark Mode?')} arrow>
              <InfoOutlinedIcon color="action" fontSize="small" />
            </Tooltip>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">{t('Switch between light and dark themes')}</Typography>
            <Switch checked={mode === 'dark'} onChange={toggleTheme} color="error" />
          </Box>
        </CardContent>
      </Card>
    );
  }
  if (onlyLanguage) {
    return (
      <Card elevation={3} sx={{ ...SETTINGS_CARD_SX, ...sx }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="subtitle1" fontWeight={600}>{t('Language')}</Typography>
            <Tooltip title={t('Change your preferred language')} arrow>
              <InfoOutlinedIcon color="action" fontSize="small" />
            </Tooltip>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Autocomplete
            options={LANGUAGES}
            getOptionLabel={option => option?.label || ''}
            value={LANGUAGES.find(l => l?.value === language) || LANGUAGES[0] || null}
            onChange={(_, val) => val && setLanguage(val.value || 'en')}
            renderInput={params => (
              <TextField 
                {...params} 
                label={t('Language')} 
                size="small" 
                InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
                InputProps={{
                  ...params.InputProps,
                  style: { ...(params.InputProps?.style || {}) }
                }}
              />
            )}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            sx={{ minWidth: 180 }}
            loading={!language}
            loadingText={t('Loading...')}
          />
        </CardContent>
      </Card>
    );
  }
  if (onlyTimezone) {
    return (
      <Card elevation={3} sx={{ ...SETTINGS_CARD_SX, ...sx }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="subtitle1" fontWeight={600}>{t('Timezone')}</Typography>
            <Tooltip title={t('Set your preferred timezone for logs')} arrow>
              <InfoOutlinedIcon color="action" fontSize="small" />
            </Tooltip>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Autocomplete
            options={TIMEZONES}
            getOptionLabel={option => option?.label || ''}
            value={TIMEZONES.find(tz => tz?.value === timezone) || TIMEZONES[0] || null}
            onChange={(_, val) => val && setTimezone(val.value || 'UTC')}
            renderInput={params => (
              <TextField 
                {...params} 
                label={t('Timezone')} 
                size="small" 
                InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
                InputProps={{
                  ...params.InputProps,
                  style: { ...(params.InputProps?.style || {}) }
                }}
              />
            )}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            sx={{ minWidth: 220 }}
            loading={!timezone}
            loadingText={t('Loading...')}
          />
        </CardContent>
      </Card>
    );
  }
  return null;
}
function NotificationSettingsAccordion({ emailNotifications, setEmailNotifications, sx, t }) {
  const bellAnim = keyframes`
    0% { transform: rotate(0deg); }
    10% { transform: rotate(-15deg); }
    20% { transform: rotate(10deg); }
    30% { transform: rotate(-10deg); }
    40% { transform: rotate(6deg); }
    50% { transform: rotate(-4deg); }
    60% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
  `;
  return (
    <Accordion 
      defaultExpanded 
      sx={{ 
        mb: 0,
        '&.MuiAccordion-root': {
          ...SETTINGS_CARD_SX,
          ...sx,
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      }}
      TransitionProps={{
        addEndListener: (node, done) => {
          // Ensure the transition has a node before trying to access its style
          if (node) {
            node.addEventListener('transitionend', done, false);
          } else {
            done();
          }
        },
      }}
    >
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />}
        sx={{
          '&.MuiButtonBase-root': {
            minHeight: '64px',
          },
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title={t('Notification Settings')} arrow>
            <IconButton 
              sx={{ 
                color: 'error.main', 
                animation: `${bellAnim} 1.2s linear infinite`,
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.08)',
                },
              }}
              aria-label={t('Notification settings')}
            >
              <NotificationsActiveIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="subtitle1" fontWeight={600}>
            {t('Notifications')}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography fontWeight={500}>{t('Email notifications')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('You’ll receive alerts at admin@loggerpro.com')}
            </Typography>
          </Box>
          <Switch checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} color="error" />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
export default function Settings() {
  const { mode, toggleTheme } = useThemeContext();
  const { t } = useTranslation();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [profilePic, setProfilePic] = useState(null);
  const [showCheck, setShowCheck] = useState(false);
  const { showSnackbar } = useSnackbar();
  const fileInputRef = useRef();
  useEffect(() => {
    const savedLang = localStorage.getItem('settings_language');
    const savedTz = localStorage.getItem('settings_timezone');
    if (savedLang) setLanguage(savedLang);
    if (savedTz) setTimezone(savedTz);
  }, []);
  const handleLanguageChange = async (val) => {
    try {
      setLanguage(val);
      localStorage.setItem('settings_language', val);
      
      // Ensure i18n is initialized before changing language
      if (i18n && typeof i18n.changeLanguage === 'function') {
        await i18n.changeLanguage(val);
        showSnackbar(t('Language updated!'), 'success');
      } else {
        // If i18n isn't ready, use a timeout to try again
        const checkI18n = setInterval(() => {
          if (i18n && typeof i18n.changeLanguage === 'function') {
            clearInterval(checkI18n);
            i18n.changeLanguage(val);
            showSnackbar(t('Language updated!'), 'success');
          }
        }, 100);
        
        // Clear the interval after 5 seconds if i18n never initializes
        setTimeout(() => clearInterval(checkI18n), 5000);
      }
    } catch (error) {
      console.error('Error changing language:', error);
      showSnackbar(t('Failed to update language'), 'error');
    }
  };
  const handleTimezoneChange = (val) => {
    setTimezone(val);
    localStorage.setItem('settings_timezone', val);
    showSnackbar('Timezone updated!', 'success');
  };
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowCheck(true);
      showSnackbar('Settings saved successfully!', 'success');
      setTimeout(() => setShowCheck(false), 2000);
    }, 2000);
  };
  return (
    <DashboardLayout>
      <Box sx={{ 
        mb: 5, 
        mt: 8, 
        paddingLeft: '1px', 
        paddingTop: '15px',
        maxWidth: 'calc(100% - 50px)',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <SettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', letterSpacing: 1 }}>
              {t('Settings')}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {t('Personalize your Logger Pro experience').replace('Logger Pro', t('Logger Pro'))}
            </Typography>
          </Box>
        </Box>
      </Box>
      {}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 3, md: 5 } }}>
        <Box sx={{ maxWidth: 340, width: '100%' }}>
          <ProfileCard profilePic={profilePic} setProfilePic={setProfilePic} fileInputRef={fileInputRef} />
        </Box>
      </Box>
      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 900, mx: 'auto' }}>
        <Grid xs={12} sm={6}>
          <GeneralSettingsCard
            mode={mode}
            toggleTheme={toggleTheme}
            onlyDarkMode
            sx={SETTINGS_CARD_SX}
            t={t}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <NotificationSettingsAccordion
            emailNotifications={emailNotifications}
            setEmailNotifications={setEmailNotifications}
            sx={SETTINGS_CARD_SX}
            t={t}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <GeneralSettingsCard
            language={language}
            setLanguage={handleLanguageChange}
            onlyLanguage
            sx={SETTINGS_CARD_SX}
            t={t}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <GeneralSettingsCard
            timezone={timezone}
            setTimezone={handleTimezoneChange}
            onlyTimezone
            sx={SETTINGS_CARD_SX}
            t={t}
          />
        </Grid>
      </Grid>
      {}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 2 }}>
        <Fab
          variant="extended"
          color="error"
          onClick={handleSave}
          sx={{
            px: 5,
            py: 2,
            fontWeight: 'bold',
            fontSize: 18,
            borderRadius: 3,
            boxShadow: 6,
            background: 'linear-gradient(90deg, #d32f2f 60%, #ef5350 100%)',
            color: '#fff',
            transition: 'background 0.3s, box-shadow 0.3s',
            '&:hover': {
              background: 'linear-gradient(90deg, #ef5350 60%, #d32f2f 100%)',
              boxShadow: 10,
            },
          }}
          disabled={loading}
        >
          {showCheck ? <Fade in={showCheck}><CheckCircleIcon sx={{ fontSize: 28, mr: 1 }} /></Fade> : null}
          {t('Save Settings')}
        </Fab>
      </Box>
    </DashboardLayout>
  );
} 