const Joi = require('joi');
const Course = require('../models/course.model');
const User = require('../models/user.model');

const quizSchema = Joi.object({
  title: Joi.string().required(),
  questions: Joi.array().items(
    Joi.object({
      text: Joi.string().required(),
      options: Joi.array().items(Joi.string()).min(2).required(),
      correct_answer: Joi.string().required()
    })
  ).min(1).required()
});

// Add quiz to course (admin only)
exports.addQuizToCourse = async (req, res) => {
  try {
    const { error } = quizSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, questions } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const formattedQuestions = questions.map(q => ({
      text: q.text,
      options: q.options,
      correctIndex: q.options.indexOf(q.correct_answer)
    }));

    course.quizzes.push({ title, questions: formattedQuestions });
    await course.save();

    res.status(201).json({ message: 'Quiz added successfully', quizzes: course.quizzes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add quiz', error: error.message });
  }
};

// Attempt quiz
exports.attemptQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const quizId = req.params.quizId;
    const { answers } = req.body; // [{ question_id, selected_option }]

    const course = await Course.findOne({ 'quizzes._id': quizId });
    if (!course) return res.status(404).json({ message: 'Quiz not found' });

    const quiz = course.quizzes.id(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found in course' });

    const user = await User.findById(userId);
    const isEnrolled = user.enrolledCourses.includes(course._id.toString());
    if (!isEnrolled) return res.status(403).json({ message: 'You are not enrolled in this course' });

    let score = 0;
    quiz.questions.forEach((question, index) => {
      const answer = answers.find(a => a.question_id === question._id.toString());
      if (answer && answer.selected_option === question.options[question.correctIndex]) {
        score++;
      }
    });

    let progress = user.progress.find(p => p.courseId.toString() === course._id.toString());
    if (!progress) {
      progress = { courseId: course._id, completedLessons: [], quizScores: [] };
    }

    progress.quizScores.push({ quizId, score });
    user.progress = user.progress.filter(p => p.courseId.toString() !== course._id.toString());
    user.progress.push(progress);

    await user.save();
    res.json({ message: 'Quiz submitted', score });
  } catch (error) {
    res.status(500).json({ message: 'Quiz attempt failed', error: error.message });
  }
};

// View quiz scores for logged-in user
exports.getQuizScores = async (req, res) => {
  try {
    const userId = req.user.id;
    const quizId = req.params.quizId;

    const user = await User.findById(userId);
    let scores = [];

    user.progress.forEach(p => {
      const filteredScores = p.quizScores.filter(q => q.quizId === quizId);
      if (filteredScores.length) scores = scores.concat(filteredScores);
    });

    res.json({ quizId, attempts: scores });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch scores', error: error.message });
  }
};