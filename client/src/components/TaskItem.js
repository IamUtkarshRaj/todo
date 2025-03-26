import React from 'react';
import { ListItem, Checkbox, IconButton, Typography, TextField, Button, Collapse } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/system';

const AnimatedListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  marginBottom: '10px',
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    transform: 'scale(1.02)',
    transition: 'transform 0.2s ease-in-out',
  },
}));

function TaskItem({ task, editingTask, editTitle, setEditTitle, setEditingTask, deleteTask, toggleComplete, saveEdit }) {
  return (
    <Collapse in timeout={500}>
      <AnimatedListItem>
        <Checkbox
          checked={task.completed}
          onChange={() => toggleComplete(task._id, task.completed)}
          color="primary"
        />
        {editingTask === task._id ? (
          <TextField
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && saveEdit(task._id)}
            fullWidth
            size="small"
          />
        ) : (
          <Typography
            sx={{
              flexGrow: 1,
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'text.disabled' : 'text.primary',
            }}
          >
            {task.title}
          </Typography>
        )}
        {editingTask === task._id ? (
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => saveEdit(task._id)}
            sx={{ mr: 1 }}
          >
            Save
          </Button>
        ) : (
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => { setEditingTask(task._id); setEditTitle(task.title); }}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        )}
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => deleteTask(task._id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </AnimatedListItem>
    </Collapse>
  );
}

export default TaskItem;