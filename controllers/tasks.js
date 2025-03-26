const Task = require('../models/Task');
const Project = require('../models/Project');

// Get all tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ dueDate: 1 });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

// Get tasks by project
exports.getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .sort({ priority: -1, dueDate: 1 });
    
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ 
        error: 'No tasks found for this project' 
      });
    }
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

// Get single task
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name status');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

// Create task
exports.createTask = async (req, res, next) => {
  try {
    // Verify project exists
    const project = await Project.findById(req.body.project);
    if (!project) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: errors });
    }
    next(err);
  }
};

// Update task
exports.updateTask = async (req, res, next) => {
  try {
    if (req.body.project) {
      const project = await Project.findById(req.body.project);
      if (!project) {
        return res.status(400).json({ error: 'Invalid project ID' });
      }
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: errors });
    }
    next(err);
  }
};

// Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};