import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

const ClubEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', venue: '', registrationDeadline: '', fee: 0 });
  const [editId, setEditId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const clubId = user?.clubsJoined[0];

  useEffect(() => {
    if (!clubId) return;
    setLoading(true);
    api.get(`/events?clubId=${clubId}`)
      .then(res => { setEvents(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load events'); setLoading(false); });
  }, [clubId, refresh]);

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/events/${editId}`, { ...form, type: 'club', clubId });
      } else {
        await api.post('/events', { ...form, type: 'club', clubId });
      }
      setForm({ title: '', description: '', date: '', time: '', venue: '', registrationDeadline: '', fee: 0 });
      setEditId(null);
      setRefresh(r => !r);
    } catch {
      setError('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = e => {
    setForm({
      title: e.title,
      description: e.description,
      date: e.date?.slice(0, 10) || '',
      time: e.time,
      venue: e.venue,
      registrationDeadline: e.registrationDeadline?.slice(0, 10) || '',
      fee: e.fee || 0
    });
    setEditId(e._id);
  };

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

  if (loading) {
    return (
      <div className="flex justify-center py-6 text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h4 className="font-semibold text-lg mb-4 text-gray-800">
        Club Events
      </h4>

      <form className="mb-6" onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleInput}
          placeholder="Title"
          className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleInput}
          placeholder="Description"
          className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          rows={4}
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleInput}
          className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          name="time"
          value={form.time}
          onChange={handleInput}
          placeholder="Time"
          className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          name="venue"
          value={form.venue}
          onChange={handleInput}
          placeholder="Venue"
          className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="date"
          name="registrationDeadline"
          value={form.registrationDeadline}
          onChange={handleInput}
          className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="number"
          name="fee"
          value={form.fee}
          onChange={handleInput}
          placeholder="Fee"
          className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          min={0}
        />
        <div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg mr-3 transition"
          >
            {editId ? 'Update' : 'Create'}
          </button>
          {editId && (
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg transition"
              onClick={() => {
                setEditId(null);
                setForm({ title: '', description: '', date: '', time: '', venue: '', registrationDeadline: '', fee: 0 });
                setError('');
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Venue</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                  No events
                </td>
              </tr>
            ) : (
              events.map(e => (
                <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">{e.title}</td>
                  <td className="py-3 px-4">{e.date ? e.date.slice(0, 10) : '-'}</td>
                  <td className="py-3 px-4">{e.time}</td>
                  <td className="py-3 px-4">{e.venue}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg transition"
                      onClick={() => handleEdit(e)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition"
                      onClick={() => handleDelete(e._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClubEvents;
