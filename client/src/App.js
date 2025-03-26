import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  TextField, Button, List, Typography, Switch, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, CircularProgress, Paper, IconButton, AppBar, Toolbar
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from './theme';
import TaskItem from './components/TaskItem';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [openAuth, setOpenAuth] = useState(!token);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => { setTasks(res.data); setLoading(false); })
      .catch(() => { setSnackbar({ open: true, message: 'Failed to fetch tasks', severity: 'error' }); setLoading(false); });
  }, [token]);

  const addTask = useCallback(() => {
    if (title.trim()) {
      setLoading(true);
      axios.post('http://localhost:5000/api/tasks', { title }, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setTasks(prev => [...prev, res.data]);
          setTitle('');
          setSnackbar({ open: true, message: 'Task added!', severity: 'success' });
          setLoading(false);
        })
        .catch(() => { setSnackbar({ open: true, message: 'Failed to add task', severity: 'error' }); setLoading(false); });
    }
  }, [title, token]);

  const handleAuth = useCallback(() => {
    const url = isRegister ? '/api/auth/register' : '/api/auth/login';
    setLoading(true);
    axios.post(`http://localhost:5000${url}`, { username, password })
      .then(res => {
        if (!isRegister) {
          const newToken = res.data.token;
          console.log('Login Token:', newToken);
          setToken(newToken);
          localStorage.setItem('token', newToken);
          setOpenAuth(false);
          setSnackbar({ open: true, message: 'Logged in successfully!', severity: 'success' });
        } else {
          setIsRegister(false);
          setSnackbar({ open: true, message: 'Registered! Please log in.', severity: 'success' });
        }
        setUsername('');
        setPassword('');
        setLoading(false);
      })
      .catch(err => { setSnackbar({ open: true, message: err.response?.data?.error || 'Auth failed', severity: 'error' }); setLoading(false); });
  }, [isRegister, username, password]);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setTasks([]);
    setOpenAuth(true);
  };

  useEffect(() => { if (token) fetchTasks(); }, [token, fetchTasks]);
  useEffect(() => { localStorage.setItem('darkMode', darkMode); }, [darkMode]);

  const theme = getTheme(darkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static">
          <Toolbar>
            <Box display="flex" alignItems="center" gap={1}>
              <CheckCircleIcon
                sx={{
                  fontSize: 40,
                  color: 'white',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                }}
              />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
                To-Do List
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                sx={{ '& .MuiSwitch-switchBase': { color: 'white' } }}
              />
              {token && (
                <IconButton color="inherit" onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: '100%',
              maxWidth: 600,
              p: 3,
              bgcolor: 'background.paper',
            }}
          >
            {token ? (
              <>
                <Box display="flex" gap={2} mb={3}>
                  <TextField
                    label="Add a task"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    disabled={loading}
                  />
                  <Button variant="contained" color="primary" onClick={addTask} disabled={!title.trim() || loading}>
                    {loading ? <CircularProgress size={24} /> : 'Add'}
                  </Button>
                </Box>
                {loading ? (
                  <Box display="flex" justifyContent="center"><CircularProgress /></Box>
                ) : (
                  <List>
                    {tasks.map(task => (
                      <TaskItem
                        key={task._id}
                        task={task}
                        editingTask={editingTask}
                        editTitle={editTitle}
                        setEditTitle={setEditTitle}
                        setEditingTask={setEditingTask}
                        deleteTask={(id) => {
                          setLoading(true);
                          axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                          })
                            .then(() => {
                              setTasks(prev => prev.filter(t => t._id !== id));
                              setSnackbar({ open: true, message: 'Task deleted!', severity: 'success' });
                              setLoading(false);
                            })
                            .catch(() => {
                              setSnackbar({ open: true, message: 'Failed to delete task', severity: 'error' });
                              setLoading(false);
                            });
                        }}
                        toggleComplete={(id, completed) => {
                          setLoading(true);
                          axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed }, {
                            headers: { Authorization: `Bearer ${token}` }
                          })
                            .then(res => {
                              setTasks(prev => prev.map(t => (t._id === id ? res.data : t)));
                              setSnackbar({ open: true, message: 'Task updated!', severity: 'success' });
                              setLoading(false);
                            })
                            .catch(() => {
                              setSnackbar({ open: true, message: 'Failed to update task', severity: 'error' });
                              setLoading(false);
                            });
                        }}
                        saveEdit={(id) => {
                          setLoading(true);
                          axios.put(`http://localhost:5000/api/tasks/${id}/edit`, { title: editTitle }, {
                            headers: { Authorization: `Bearer ${token}` }
                          })
                            .then(res => {
                              setTasks(prev => prev.map(t => (t._id === id ? res.data : t)));
                              setEditingTask(null);
                              setSnackbar({ open: true, message: 'Task edited!', severity: 'success' });
                              setLoading(false);
                            })
                            .catch(() => {
                              setSnackbar({ open: true, message: 'Failed to edit task', severity: 'error' });
                              setLoading(false);
                            });
                        }}
                      />
                    ))}
                  </List>
                )}
              </>
            ) : (
              <Typography variant="body1" color="textSecondary" textAlign="center">
                Please log in to manage your tasks
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
      <Dialog open={openAuth} onClose={token ? () => setOpenAuth(false) : null}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            {isRegister ? <PersonAddIcon /> : <LoginIcon />}
            <Typography variant="h6">{isRegister ? 'Register' : 'Login'}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{ startAdornment: <AccountCircle sx={{ color: 'action.active', mr: 1 }} /> }}
            disabled={loading}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{ startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} /> }}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRegister(!isRegister)} disabled={loading}>
            {isRegister ? 'Switch to Login' : 'Switch to Register'}
          </Button>
          <Button onClick={handleAuth} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (isRegister ? 'Register' : 'Login')}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;