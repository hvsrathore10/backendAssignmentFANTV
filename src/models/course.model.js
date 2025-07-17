const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: String,
  price: Number,
  lessons: [{
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: String,
    videoUrl: String,
    resources: [String]
  }],
  quizzes: [{
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: String,
    questions: [{
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      text: String,
      options: [String],
      correctIndex: Number
    }]
  }]
});

module.exports = mongoose.model('Course', courseSchema);