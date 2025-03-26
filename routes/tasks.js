const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasks');

// GET all tasks
router.get('/', taskController.getAllTasks);

// GET tasks for a specific project
router.get('/project/:projectId', taskController.getTasksByProject);

// GET a single task
router.get('/:id', taskController.getTask);

// POST create a new task
router.post('/', taskController.createTask);

// PUT update a task
router.put('/:id', taskController.updateTask);

// DELETE a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;