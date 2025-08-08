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
      setError('');
    } catch {
      setError('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = e => setForm({
    title: e.title,
    description: e.description,
    date: e.date?.slice(0, 10) || '',
    time: e.time,
    venue: e.venue,
    type: e.type,
    clubId: e.clubId?._id || e.clubId || '',
    registrationDeadline: e.registrationDeadline?.slice(0, 10) || '',
    fee: e.fee || 0,
    poster: e.poster || ''
  }) || setEditId(e._id);

  const handleDelete = async id => {
    setLoading(true);
    try {
      await api.delete(`/events/${id}`);
      setRefresh(r => !r);
      setError('');
    } catch {
      setError('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-indigo-700">Event Management</h3>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Container for form + event list side by side */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Event Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white shadow-md rounded-xl p-6 max-h-[700px] overflow-auto"
        >
          <h4 className="text-xl font-semibold mb-4 text-indigo-600">{editId ? 'Edit Event' : 'Create Event'}</h4>

          <input
            name="title"
            value={form.title}
            onChange={handleInput}
            placeholder="Title"
            className="border border-gray-300 p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleInput}
            placeholder="Description"
            className="border border-gray-300 p-2 rounded w-full mb-3 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <div className="grid grid-cols-2 gap-4 mb-3">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleInput}
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              name="time"
              value={form.time}
              onChange={handleInput}
              placeholder="Time"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <input
            name="venue"
            value={form.venue}
            onChange={handleInput}
            placeholder="Venue"
            className="border border-gray-300 p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <select
            name="type"
            value={form.type}
            onChange={handleInput}
            className="border border-gray-300 p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="society">Society Event</option>
            <option value="club">Club Event</option>
          </select>
          {form.type === 'club' && (
            <select
              name="clubId"
              value={form.clubId}
              onChange={handleInput}
              className="border border-gray-300 p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            >
              <option value="">Select Club</option>
              {clubs.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <input
              type="date"
              name="registrationDeadline"
              value={form.registrationDeadline}
              onChange={handleInput}
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="number"
              name="fee"
              value={form.fee}
              onChange={handleInput}
              placeholder="Fee"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              min={0}
            />
          </div>
          <input
            name="poster"
            value={form.poster}
            onChange={handleInput}
            placeholder="Poster URL (optional)"
            className="border border-gray-300 p-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {editId ? 'Update Event' : 'Create Event'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({
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
                  setError('');
                }}
                className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Event List */}
        <div className="flex-1 bg-white shadow-md rounded-xl p-6 max-h-[700px] overflow-auto">
          <h4 className="text-xl font-semibold mb-4 text-indigo-600">Existing Events</h4>
          <table className="w-full table-auto border-collapse border border-gray-300 text-left">
            <thead>
              <tr className="bg-indigo-100">
                <th className="border border-gray-300 px-3 py-2">Type</th>
                <th className="border border-gray-300 px-3 py-2">Title</th>
                <th className="border border-gray-300 px-3 py-2">Date</th>
                <th className="border border-gray-300 px-3 py-2">Club</th>
                <th className="border border-gray-300 px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No events found
                  </td>
                </tr>
              )}
              {events.map(e => (
                <tr key={e._id} className="hover:bg-indigo-50">
                  <td className="border border-gray-300 px-3 py-2 capitalize">{e.type}</td>
                  <td className="border border-gray-300 px-3 py-2">{e.title}</td>
                  <td className="border border-gray-300 px-3 py-2">{e.date ? e.date.slice(0, 10) : '-'}</td>
                  <td className="border border-gray-300 px-3 py-2">{e.clubId ? (e.clubId.name || e.clubId) : '-'}</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition"
                      onClick={() => handleEdit(e)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      onClick={() => handleDelete(e._id)}
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

      {/* Club Task Assignment Section */}
      <div className="mt-10 bg-white shadow-md rounded-xl p-6">
        <h4 className="text-lg font-bold mb-4 text-indigo-700">Assign Task to Clubs</h4>
        <ClubTaskAssignment clubs={clubs} />
      </div>
    </div>
  );
};

export default EventManagement;
