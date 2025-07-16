const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  progress: [{
    courseId: mongoose.Schema.Types.ObjectId,
    completedLessons: [String],
    quizScores: [{ quizId: String, score: Number }]
  }]
});

module.exports = mongoose.model('User', userSchema);