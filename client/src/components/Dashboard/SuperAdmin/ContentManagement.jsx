import React, { useState } from 'react';

const dummyNotices = [
  { id: 1, title: 'Exam Schedule Released', date: '2025-08-01' },
  { id: 2, title: 'Campus Maintenance Notice', date: '2025-08-05' },
];

const dummyScholarships = [
  { id: 1, name: 'Merit Scholarship', amount: '50,000 BDT', deadline: '2025-09-15' },
  { id: 2, name: 'Need-Based Scholarship', amount: '30,000 BDT', deadline: '2025-10-01' },
];

const dummyTasks = [
  { id: 1, task: 'Review student submissions', assignedTo: 'Admin' },
  { id: 2, task: 'Update website content', assignedTo: 'Content Team' },
];

const ContentManagement = () => {
  const [notices, setNotices] = useState(dummyNotices);
  const [scholarships, setScholarships] = useState(dummyScholarships);
  const [tasks, setTasks] = useState(dummyTasks);

  // Dummy handlers for add/delete operations
  const addNotice = () => {
    const newNotice = {
      id: notices.length + 1,
      title: `New Notice #${notices.length + 1}`,
      date: new Date().toISOString().split('T')[0],
    };
    setNotices([newNotice, ...notices]);
  };

  const deleteNotice = (id) => {
    setNotices(notices.filter(n => n.id !== id));
  };

  const addScholarship = () => {
    const newScholarship = {
      id: scholarships.length + 1,
      name: `New Scholarship #${scholarships.length + 1}`,
      amount: '20,000 BDT',
      deadline: new Date().toISOString().split('T')[0],
    };
    setScholarships([newScholarship, ...scholarships]);
  };

  const deleteScholarship = (id) => {
    setScholarships(scholarships.filter(s => s.id !== id));
  };

  const addTask = () => {
    const newTask = {
      id: tasks.length + 1,
      task: `New Task #${tasks.length + 1}`,
      assignedTo: 'Team Lead',
    };
    setTasks([newTask, ...tasks]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h3 className="text-3xl font-extrabold text-indigo-700 mb-8">📝 Content Management</h3>

      {/* Notices Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold text-gray-800">Notices</h4>
          <button
            onClick={addNotice}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            + Add Notice
          </button>
        </div>
        {notices.length === 0 ? (
          <p className="text-gray-500">No notices available.</p>
        ) : (
          <ul className="divide-y divide-gray-200 border rounded-md overflow-hidden">
            {notices.map(({ id, title, date }) => (
              <li key={id} className="flex justify-between items-center px-6 py-3 hover:bg-indigo-50 transition">
                <div>
                  <p className="font-medium text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500">Date: {date}</p>
                </div>
                <button
                  onClick={() => deleteNotice(id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                  aria-label={`Delete notice ${title}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Scholarships Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold text-gray-800">Scholarships</h4>
          <button
            onClick={addScholarship}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            + Add Scholarship
          </button>
        </div>
        {scholarships.length === 0 ? (
          <p className="text-gray-500">No scholarships available.</p>
        ) : (
          <ul className="divide-y divide-gray-200 border rounded-md overflow-hidden">
            {scholarships.map(({ id, name, amount, deadline }) => (
              <li key={id} className="flex justify-between items-center px-6 py-3 hover:bg-green-50 transition">
                <div>
                  <p className="font-medium text-gray-900">{name}</p>
                  <p className="text-sm text-gray-500">Amount: {amount} | Deadline: {deadline}</p>
                </div>
                <button
                  onClick={() => deleteScholarship(id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                  aria-label={`Delete scholarship ${name}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Tasks Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold text-gray-800">Tasks</h4>
          <button
            onClick={addTask}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
          >
            + Add Task
          </button>
        </div>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks assigned.</p>
        ) : (
          <ul className="divide-y divide-gray-200 border rounded-md overflow-hidden">
            {tasks.map(({ id, task, assignedTo }) => (
              <li key={id} className="flex justify-between items-center px-6 py-3 hover:bg-yellow-50 transition">
                <div>
                  <p className="font-medium text-gray-900">{task}</p>
                  <p className="text-sm text-gray-500">Assigned To: {assignedTo}</p>
                </div>
                <button
                  onClick={() => deleteTask(id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                  aria-label={`Delete task ${task}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ContentManagement;
