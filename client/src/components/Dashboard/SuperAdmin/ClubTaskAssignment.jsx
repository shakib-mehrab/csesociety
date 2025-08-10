/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCalendarAlt } from 'react-icons/fa';
import api from '../../../services/api';

const ClubTaskAssignment = ({ clubs }) => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: null,
    assignedClubs: [],
  });
  const handleDateChange = date => setForm(f => ({ ...f, dueDate: date }));
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/club-tasks')
      .then(res => { setTasks(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load tasks'); setLoading(false); });
  }, [refresh]);

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleClubs = e => {
    const options = Array.from(e.target.selectedOptions, o => o.value);
    setForm({ ...form, assignedClubs: options });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/club-tasks/${editId}`, form);
      } else {
        await api.post('/club-tasks', form);
      }
      setForm({ title: '', description: '', dueDate: '', assignedClubs: [] });
      setEditId(null);
      setRefresh(r => !r);
    } catch {
      setError('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = t => {
    setForm({
      title: t.title,
      description: t.description,
      dueDate: t.dueDate ? new Date(t.dueDate) : null,
      assignedClubs: t.assignedClubs.map(c => c._id || c)
    });
    setEditId(t._id);
  };

  const handleDelete = async id => {
    setLoading(true);
    try {
      await api.delete(`/club-tasks/${id}`);
      setRefresh(r => !r);
    } catch {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Form Card --- */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {editId ? 'Edit Task' : 'Assign New Task'}
        </h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="title"
            value={form.title}
            onChange={handleInput}
            placeholder="Task Title"
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-2 w-full text-sm"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleInput}
            placeholder="Task Description"
            rows={3}
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-2 w-full text-sm"
            required
          />

          {/* Due Date Box */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <div className="relative">
              <DatePicker
                selected={form.dueDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select Due Date"
                className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-2 w-full pr-10 text-sm"
                calendarClassName="rounded-lg border border-gray-200 shadow-lg" // keeps calendar styled
              />
              <FaRegCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Club Selection Box */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Club</label>
            <select
              name="assignedClubs"
              value={form.assignedClubs}
              onChange={handleClubs}
              className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-2 w-full text-sm"
              multiple
              required
            >
              {clubs.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple clubs</p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg text-sm"
            >
              {editId ? 'Update Task' : 'Assign Task'}
            </button>
            {editId && (
              <button
                type="button"
                className="bg-gray-400 hover:bg-gray-500 transition text-white px-4 py-2 rounded-lg text-sm"
                onClick={() => {
                  setEditId(null);
                  setForm({ title: '', description: '', dueDate: '', assignedClubs: [] });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- Tasks Table --- */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Assigned Tasks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-left">
                <th className="p-3 border-b">Title</th>
                <th className="p-3 border-b">Due Date</th>
                <th className="p-3 border-b">Clubs</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No tasks assigned yet.
                  </td>
                </tr>
              )}
              {tasks.map((t, idx) => (
                <tr
                  key={t._id}
                  className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="p-3 border-b">{t.title}</td>
                  <td className="p-3 border-b">{t.dueDate ? t.dueDate.slice(0, 10) : '-'}</td>
                  <td className="p-3 border-b">{t.assignedClubs.map(c => c.name || c).join(', ')}</td>
                  <td className="p-3 border-b">{t.status}</td>
                  <td className="p-3 border-b flex gap-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleEdit(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleDelete(t._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClubTaskAssignment;
