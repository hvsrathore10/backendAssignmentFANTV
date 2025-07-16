const Course = require('../models/course.model');
const User = require('../models/user.model');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, instructor, price, lessons, quizzes } = req.body;
    const course = new Course({ title, description, instructor, price, lessons, quizzes });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create course', error: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch course', error: error.message });
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