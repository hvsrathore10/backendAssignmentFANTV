const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: String,
  price: Number,
  lessons: [{ title: String, videoUrl: String, resources: [String] }],
  quizzes: [{
    questions: [{
      text: String,
      options: [String],
      correctIndex: Number
    }]
  }]
});

module.exports = mongoose.model('Course', courseSchema);