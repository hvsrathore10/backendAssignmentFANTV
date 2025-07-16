const express = require('express');
const app = express();

const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const lessonRoutes = require('./routes/lesson.routes');
const quizRoutes = require('./routes/quiz.routes');
const progressRoutes = require('./routes/progress.routes');

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);

app.get('/', (req, res) => {
  res.send('LMS Backend API is running');
});
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;