import { createTheme } from '@mui/material/styles';

const lightTheme = {
  palette: {
    mode: 'light',
    primary: { main: '#0288d1' }, // Vibrant sky blue for a fresh look
    secondary: { main: '#ff5722' }, // Bold orange for contrast
    background: { default: '#e1f5fe', paper: '#ffffff' }, // Light blue background, crisp white card
    text: { primary: '#01579b', secondary: '#0288d1' }, // Deep blue text for readability
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0288d1', // Matches primary color
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Subtle shadow
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 8,
          backgroundColor: '#f5faff', // Slightly tinted background for tasks
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 14px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          borderRadius: 12,
        },
      },
    },
  },
};

const darkTheme = {
  palette: {
    mode: 'dark',
    primary: { main: '#4fc3f7' }, // Bright cyan for a cool dark mode
    secondary: { main: '#ff8a65' }, // Soft coral for contrast
    background: { default: '#0d1b2a', paper: '#1e2a38' }, // Deep navy background, dark card
    text: { primary: '#e0f7fa', secondary: '#4fc3f7' }, // Light cyan text
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#4fc3f7',
          boxShadow: '0 4px 12px rgba(255,255,255,0.1)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 8,
          backgroundColor: '#263544', // Darker task background
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 14px rgba(255,255,255,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 12px 40px rgba(255,255,255,0.08)',
          borderRadius: 12,
        },
      },
    },
  },
};

export const getTheme = (mode) => createTheme(mode === 'dark' ? darkTheme : lightTheme);