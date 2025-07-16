const Course = require('../models/course.model');
const User = require('../models/user.model');

exports.addLessonToCourse = async (req, res) => {
  try {
    const { title, video_url, resource_links } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.lessons.push({ title, videoUrl: video_url, resources: resource_links });
    await course.save();

    res.status(201).json({ message: 'Lesson added successfully', lessons: course.lessons });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add lesson', error: error.message });
  }
};

exports.markLessonComplete = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const courses = await Course.find({ 'lessons._id': lessonId });
    if (!courses.length) return res.status(404).json({ message: 'Lesson not found in any course' });

    const course = courses[0];
    const isEnrolled = user.enrolledCourses.includes(course._id.toString());
    if (!isEnrolled) return res.status(403).json({ message: 'You are not enrolled in this course' });

    let progress = user.progress.find(p => p.courseId.toString() === course._id.toString());
    if (!progress) {
      progress = { courseId: course._id, completedLessons: [], quizScores: [] };
    }

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    user.progress = user.progress.filter(p => p.courseId.toString() !== course._id.toString());
    user.progress.push(progress);
    await user.save();

    res.json({ message: 'Lesson marked as completed' });
  } catch (error) {
    res.status(500).json({ message: 'Error completing lesson', error: error.message });
  }
};
