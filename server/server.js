const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const Task = require('./models/task');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'https://todo-red-one.vercel.app/', // Replace with your Vercel URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary methods
}));

// Use the correct environment variable
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in the environment variables.');
  process.exit(1); // Exit the process if MONGO_URI is missing
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

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

app.get('/', (req,res)=>{
  res.send("Server is live")
})

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