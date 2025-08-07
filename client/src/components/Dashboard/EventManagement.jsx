/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import ClubTaskAssignment from './ClubTaskAssignment';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    type: 'society',
    clubId: '',
    registrationDeadline: '',
    fee: 0,
    poster: ''
  });
  const [editId, setEditId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/events'),
      api.get('/clubs')
    ])
      .then(([eventsRes, clubsRes]) => {
        setEvents(eventsRes.data);
        setClubs(clubsRes.data);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load events or clubs'); setLoading(false); });
  }, [refresh]);

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/events/${editId}`, form);
      } else {
        await api.post('/events', form);
      }
      setForm({ title: '', description: '', date: '', time: '', venue: '', type: 'society', clubId: '', registrationDeadline: '', fee: 0, poster: '' });
      setEditId(null);
      setRefresh(r => !r);
    } catch {
      setError('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = e => setForm({
    title: e.title,
    description: e.description,
    date: e.date?.slice(0,10) || '',
    time: e.time,
    venue: e.venue,
    type: e.type,
    clubId: e.clubId?._id || e.clubId || '',
    registrationDeadline: e.registrationDeadline?.slice(0,10) || '',
    fee: e.fee || 0,
    poster: e.poster || ''
  }) || setEditId(e._id);

  const handleDelete = async id => {
    setLoading(true);
    try {
      await api.delete(`/events/${id}`);
      setRefresh(r => !r);
    } catch {
      setError('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Event Management</h3>
      <form className="mb-4" onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleInput} placeholder="Title" className="border p-2 rounded w-full mb-2" required />
        <textarea name="description" value={form.description} onChange={handleInput} placeholder="Description" className="border p-2 rounded w-full mb-2" required />
        <input type="date" name="date" value={form.date} onChange={handleInput} className="border p-2 rounded w-full mb-2" required />
        <input name="time" value={form.time} onChange={handleInput} placeholder="Time" className="border p-2 rounded w-full mb-2" required />
        <input name="venue" value={form.venue} onChange={handleInput} placeholder="Venue" className="border p-2 rounded w-full mb-2" required />
        <select name="type" value={form.type} onChange={handleInput} className="border p-2 rounded w-full mb-2">
          <option value="society">Society Event</option>
          <option value="club">Club Event</option>
        </select>
        {form.type === 'club' && (
          <select name="clubId" value={form.clubId} onChange={handleInput} className="border p-2 rounded w-full mb-2" required>
            <option value="">Select Club</option>
            {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        )}
        <input type="date" name="registrationDeadline" value={form.registrationDeadline} onChange={handleInput} className="border p-2 rounded w-full mb-2" />
        <input type="number" name="fee" value={form.fee} onChange={handleInput} placeholder="Fee" className="border p-2 rounded w-full mb-2" />
        <input name="poster" value={form.poster} onChange={handleInput} placeholder="Poster URL (optional)" className="border p-2 rounded w-full mb-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mr-2">{editId ? 'Update' : 'Create'}</button>
        {editId && <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => { setEditId(null); setForm({ title: '', description: '', date: '', time: '', venue: '', type: 'society', clubId: '', registrationDeadline: '', fee: 0, poster: '' }); }}>Cancel</button>}
      </form>
      <table className="w-full border mb-4">
        <thead><tr className="bg-gray-100"><th>Type</th><th>Title</th><th>Date</th><th>Club</th><th>Actions</th></tr></thead>
        <tbody>
          {events.length === 0 && <tr><td colSpan={5}>No events</td></tr>}
          {events.map(e => (
            <tr key={e._id}>
              <td>{e.type}</td>
              <td>{e.title}</td>
              <td>{e.date ? e.date.slice(0,10) : '-'}</td>
              <td>{e.clubId ? (e.clubId.name || e.clubId) : '-'}</td>
              <td>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(e)}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(e._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Club Task Assignment Section */}
      <div className="mt-8">
        <h4 className="text-lg font-bold mb-2">Assign Task to Clubs</h4>
        <ClubTaskAssignment clubs={clubs} />
      </div>
    </div>
  );
};

export default EventManagement;
