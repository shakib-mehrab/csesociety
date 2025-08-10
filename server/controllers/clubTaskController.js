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


// Get all tasks (super_admin: all, club_admin: only assigned to their club)
const getAllTasks = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role === 'coordinator' && req.user.club) {
    filter = { assignedClubs: req.user.club };
  }
  const tasks = await ClubTask.find(filter)
    .populate('assignedClubs', 'name')
    .populate('createdBy', 'name email');
  res.json(tasks);
});
// Mark a task as completed by club admin
const markTaskCompleted = asyncHandler(async (req, res) => {
  const task = await ClubTask.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  console.log(req.user.clubsJoined[0]); 
  
  // Only allow if the user's club is assigned
  if (req.user.role !== 'coordinator' || !task.assignedClubs.some(clubId => clubId.equals(req.user.club))) {
    res.status(403);
    throw new Error('Not authorized to complete this task');
  }
  task.status = 'completed';
  await task.save();

  // Notify super admin (simple: log, or extend to notification system)
  // You can replace this with a real notification system
  console.log(`Task '${task.title}' marked as completed by club ${req.user.club}`);

  res.json({ message: 'Task marked as completed' });
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
  await ClubTask.deleteOne({ _id: task._id });
  res.json({ message: 'Task removed' });
});


// Get tasks by club ID
const getTaskByClubID = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  if (!clubId) {
    res.status(400);
    throw new Error('Club ID is required');
  }
  const tasks = await ClubTask.find({ assignedClubs: clubId })
    .populate('assignedClubs', 'name')
    .populate('createdBy', 'name email');
  res.json(tasks);
});

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  markTaskCompleted,
  getTaskByClubID,
};
