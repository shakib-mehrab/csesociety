const asyncHandler = require('express-async-handler');
const ClubTask = require('../models/ClubTask');
const Club = require('../models/Club');

// Create a new task and assign to clubs
const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, assignedClubs } = req.body;
  const task = new ClubTask({
    title,
    description,
    dueDate,
    assignedClubs,
    createdBy: req.user._id,
  });
  const created = await task.save();
  res.status(201).json(created);
});

// Get all tasks
const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await ClubTask.find({})
    .populate('assignedClubs', 'name')
    .populate('createdBy', 'name email');
  res.json(tasks);
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, assignedClubs, status } = req.body;
  const task = await ClubTask.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  task.title = title || task.title;
  task.description = description || task.description;
  task.dueDate = dueDate || task.dueDate;
  task.assignedClubs = assignedClubs || task.assignedClubs;
  task.status = status || task.status;
  const updated = await task.save();
  res.json(updated);
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
  const task = await ClubTask.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  await task.remove();
  res.json({ message: 'Task removed' });
});

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};
