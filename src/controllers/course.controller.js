const Joi = require('joi');
const Course = require('../models/course.model');
const User = require('../models/user.model');

// Input validation for creating a course
const courseCreateSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  instructor: Joi.string().required(),
  price: Joi.number().min(0).required(),
  lessons: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      videoUrl: Joi.string().uri().required(),
      resources: Joi.array().items(Joi.string().uri())
    })
  ),
  quizzes: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      questions: Joi.array().items(
        Joi.object({
          text: Joi.string().required(),
          options: Joi.array().items(Joi.string()).min(2).required(),
          correct_answer: Joi.string().required()
        })
      ).min(1).required()
    })
  )
});

exports.getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Course.countDocuments();
    const courses = await Course.find()
      .skip(skip)
      .limit(limit)
      .select('title description instructor price');

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      courses
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const lessonPage = parseInt(req.query.lessonPage) || 1;
    const lessonLimit = parseInt(req.query.lessonLimit) || 10;
    const quizPage = parseInt(req.query.quizPage) || 1;
    const quizLimit = parseInt(req.query.quizLimit) || 10;

    const lessons = course.lessons.slice((lessonPage - 1) * lessonLimit, lessonPage * lessonLimit);
    const quizzes = course.quizzes.slice((quizPage - 1) * quizLimit, quizPage * quizLimit);

    res.json({
      _id: course._id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: course.price,
      lessons,
      quizzes,
      totalLessons: course.lessons.length,
      totalQuizzes: course.quizzes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch course', error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { error } = courseCreateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description, instructor, price, lessons = [], quizzes = [] } = req.body;

    const formattedLessons = lessons.map(lesson => ({
      title: lesson.title,
      videoUrl: lesson.videoUrl,
      resources: lesson.resources || []
    }));

    const formattedQuizzes = quizzes.map(quiz => ({
      title: quiz.title,
      questions: quiz.questions.map(q => ({
        text: q.text,
        options: q.options,
        correctIndex: q.options.indexOf(q.correct_answer)
      }))
    }));

    const course = new Course({
      title,
      description,
      instructor,
      price,
      lessons: formattedLessons,
      quizzes: formattedQuizzes
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create course', error: error.message });
  }
};

exports.enrollInCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    const user = await User.findById(userId);

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: 'Successfully enrolled in the course' });
  } catch (error) {
    res.status(500).json({ message: 'Enrollment failed', error: error.message });
  }
};
