const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const Task = require('./models/task');
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(cors());

console.log(process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(()=>{
    console.log("Connected to MongoDB");
  })
  .catch(()=>{
    console.log("Couldn't connect to MongoDB");
  })

const JWT_SECRET = 'your-secret-key'; // Change this in production!

// Middleware to verify token
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Auth routes
app.use('/api/auth', authRoutes);

// Task routes (protected)
app.get('/api/tasks', authMiddleware, async (req, res) => {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
});

app.post('/api/tasks', authMiddleware, async (req, res) => {
    const newTask = new Task({ title: req.body.title, userId: req.userId });
    const savedTask = await newTask.save();
    res.json(savedTask);
});

app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Task deleted' });
});

app.put('/api/tasks/:id', authMiddleware, async (req, res) => {
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { completed: req.body.completed },
        { new: true }
    );
    res.json(task);
});

app.put('/api/tasks/:id/edit', authMiddleware, async (req, res) => {
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { title: req.body.title },
        { new: true }
    );
    res.json(task);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));