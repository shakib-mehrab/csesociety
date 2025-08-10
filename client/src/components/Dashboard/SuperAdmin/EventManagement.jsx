/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../../services/api';
import ClubTaskAssignment from './ClubTaskAssignment';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: null,
    time: '',
    venue: '',
    type: 'society',
    clubId: '',
    registrationDeadline: null,
    fee: '',
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
  const handleDateChange = (date) => setForm(f => ({ ...f, date }));
  const handleRegDeadlineChange = (date) => setForm(f => ({ ...f, registrationDeadline: date }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        date: form.date ? form.date.toISOString().slice(0, 10) : '',
        registrationDeadline: form.registrationDeadline ? form.registrationDeadline.toISOString().slice(0, 10) : '',
      };
      if (editId) {
        await api.put(`/events/${editId}`, payload);
      } else {
        await api.post('/events', payload);
      }
      setForm({ title: '', description: '', date: null, time: '', venue: '', type: 'society', clubId: '', registrationDeadline: null, fee: '', poster: '' });
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
    date: e.date ? new Date(e.date) : null,
    time: e.time,
    venue: e.venue,
    type: e.type,
    clubId: e.clubId?._id || e.clubId || '',
    registrationDeadline: e.registrationDeadline ? new Date(e.registrationDeadline) : null,
    fee: e.fee === 0 ? '' : e.fee || '',
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
      <h3 className="text-2xl font-bold mb-6" style={{ color: '#00183a' }}>
        Event Management
      </h3>
      {error && (
        <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#fde2e2', color: '#9b1c1c' }}>
          {error}
        </div>
      )}

      {/* Container for form + event list side by side */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Event Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white shadow-md rounded-xl p-6 max-h-[700px] overflow-auto"
        >
          <h4 className="text-xl font-semibold mb-4" style={{ color: '#034986' }}>
            {editId ? 'Edit Event' : 'Create Event'}
          </h4>

          <input
            name="title"
            value={form.title}
            onChange={handleInput}
            placeholder="Title"
            className="border p-2 rounded w-full mb-3 focus:outline-none"
            style={{ borderColor: '#409fc8', boxShadow: '0 0 0 2px #409fc8' }}
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleInput}
            placeholder="Description"
            className="border p-2 rounded w-full mb-3 resize-y focus:outline-none"
            style={{ borderColor: '#409fc8', boxShadow: '0 0 0 2px #409fc8' }}
            required
          />
          <div className="grid grid-cols-2 gap-4 mb-3">
            <DatePicker
              selected={form.date}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Event Date"
              className="border p-2 rounded w-full focus:outline-none"
              style={{ borderColor: '#409fc8', boxShadow: '0 0 0 2px #409fc8' }}
              required
            />
            <input
              name="time"
              value={form.time}
              onChange={handleInput}
              placeholder="Time"
              className="border p-2 rounded focus:outline-none"
              style={{ borderColor: '#409fc8', boxShadow: '0 0 0 2px #409fc8' }}
              required
            />
          </div>
          <input
            name="venue"
            value={form.venue}
            onChange={handleInput}
            placeholder="Venue"
            className="border p-2 rounded w-full mb-3 focus:outline-none"
            style={{ borderColor: '#409fc8', boxShadow: '0 0 0 2px #409fc8' }}
            required
          />
          <select
            name="type"
            value={form.type}
            onChange={handleInput}
            className="border p-2 rounded w-full mb-3 focus:outline-none"
            style={{ borderColor: '#409fc8', boxShadow: '0 0 0 2px #409fc8' }}
          >
            <option value="society">Society Event</option>
            <option value="club">Club Event</option>
          </select>
          {form.type === 'club' && (
            <select
              name="clubId"
              value={form.clubId}
              onChange={handleInput}
              className="border p-2 rounded w-full mb-3 focus:outline-none"
              style={{ borderColor: '#409fc8', boxShadow: '0 0 0 2px #409fc8' }}
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
            <DatePicker
              selected={form.registrationDeadline}
              onChange={handleRegDeadlineChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Registration Deadline"
              className="border p-2 rounded w-full focus:outline-none"
              style={{ borderColor: '#409fc8', boxShadow: '0 0 0 2px #409fc8' }}
            />
            <input
              type="number"
              name="fee"
              value={form.fee}
              onChange={handleInput}
              placeholder="Event Fee"
              className="border p-2 rounded focus:outline-none"
              style={{ borderColor: '#409fc8', boxShadow: '0 0 0 2px #409fc8' }}
              min={0}
            />
          </div>
          <input
            name="poster"
            value={form.poster}
            onChange={handleInput}
            placeholder="Poster URL (optional)"
            className="border p-2 rounded w-full mb-3 focus:outline-none"
            style={{ borderColor: '#409fc8', boxShadow: '0 0 0 2px #409fc8' }}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded transition disabled:opacity-50"
              style={{ backgroundColor: '#034986', color: 'white' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#002a54')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#034986')}
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
                className="px-5 py-2 rounded transition"
                style={{ backgroundColor: '#409fc8', color: 'white' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#002a54')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#409fc8')}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Event List */}
        <div className="flex-1 bg-white shadow-md rounded-xl p-6 max-h-[700px] overflow-auto">
          <h4 className="text-xl font-semibold mb-4" style={{ color: '#034986' }}>
            Existing Events
          </h4>
          <table className="w-full table-auto border-collapse border text-left" style={{ borderColor: '#409fc8' }}>
            <thead>
              <tr style={{ backgroundColor: '#409fc8', color: 'white' }}>
                <th className="border px-3 py-2 capitalize" style={{ borderColor: '#034986' }}>Type</th>
                <th className="border px-3 py-2" style={{ borderColor: '#034986' }}>Title</th>
                <th className="border px-3 py-2" style={{ borderColor: '#034986' }}>Date</th>
                <th className="border px-3 py-2" style={{ borderColor: '#034986' }}>Club</th>
                <th className="border px-3 py-2" style={{ borderColor: '#034986' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center" style={{ color: '#002a54' }}>
                    No events found
                  </td>
                </tr>
              )}
              {events.map((e, i) => (
                <tr
                  key={e._id}
                  className="hover:bg-[#c3defd]"
                  style={{ backgroundColor: i % 2 === 0 ? 'white' : '#e5f1fb' }}
                >
                  <td className="border px-3 py-2 capitalize" style={{ borderColor: '#034986', color: '#00183a' }}>{e.type}</td>
                  <td className="border px-3 py-2" style={{ borderColor: '#034986', color: '#00183a' }}>{e.title}</td>
                  <td className="border px-3 py-2" style={{ borderColor: '#034986', color: '#002a54' }}>
                    {e.date ? e.date.slice(0, 10) : '-'}
                  </td>
                  <td className="border px-3 py-2" style={{ borderColor: '#034986', color: '#002a54' }}>
                    {e.clubId ? (e.clubId.name || e.clubId) : '-'}
                  </td>
                  <td className="border px-3 py-2" style={{ borderColor: '#034986' }}>
                    <button
                      className="px-3 py-1 rounded mr-2 transition"
                      style={{ backgroundColor: '#03305f', color: 'white' }}
                      onMouseOver={e => (e.currentTarget.style.backgroundColor = '#03305f')}
                      onMouseOut={e => (e.currentTarget.style.backgroundColor = '#03305f')}
                      onClick={() => handleEdit(e)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 rounded transition"
                      style={{ backgroundColor: '#94589d', color: 'white' }}
                      onMouseOver={e => (e.currentTarget.style.backgroundColor = '#b91c1c')}
                      onMouseOut={e => (e.currentTarget.style.backgroundColor = '#94589d')}
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
        <h4 className="text-lg font-bold mb-4" style={{ color: '#00183a' }}>
          Assign Task to Clubs
        </h4>
        <ClubTaskAssignment clubs={clubs} />
      </div>
    </div>
  );
};

export default EventManagement;
