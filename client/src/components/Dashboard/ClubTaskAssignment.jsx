/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ClubTaskAssignment = ({ clubs }) => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedClubs: [],
  });
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

  const handleEdit = t => setForm({
    title: t.title,
    description: t.description,
    dueDate: t.dueDate ? t.dueDate.slice(0,10) : '',
    assignedClubs: t.assignedClubs.map(c => c._id || c)
  }) || setEditId(t._id);

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
    <div>
      <form className="mb-4" onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleInput} placeholder="Task Title" className="border p-2 rounded w-full mb-2" required />
        <textarea name="description" value={form.description} onChange={handleInput} placeholder="Task Description" className="border p-2 rounded w-full mb-2" required />
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleInput} className="border p-2 rounded w-full mb-2" />
        <select name="assignedClubs" value={form.assignedClubs} onChange={handleClubs} className="border p-2 rounded w-full mb-2" multiple required>
          {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mr-2">{editId ? 'Update' : 'Assign Task'}</button>
        {editId && <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => { setEditId(null); setForm({ title: '', description: '', dueDate: '', assignedClubs: [] }); }}>Cancel</button>}
      </form>
      <table className="w-full border mb-4">
        <thead><tr className="bg-gray-100"><th>Title</th><th>Due</th><th>Clubs</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {tasks.length === 0 && <tr><td colSpan={5}>No tasks</td></tr>}
          {tasks.map(t => (
            <tr key={t._id}>
              <td>{t.title}</td>
              <td>{t.dueDate ? t.dueDate.slice(0,10) : '-'}</td>
              <td>{t.assignedClubs.map(c => c.name || c).join(', ')}</td>
              <td>{t.status}</td>
              <td>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(t)}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(t._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClubTaskAssignment;
