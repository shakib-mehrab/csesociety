
import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Clock, MapPin, FileText, Pencil, DollarSign, Info } from 'lucide-react';

const ClubEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', date: null, time: '', venue: '', registrationDeadline: null, fee: 0 });
  const [editId, setEditId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const clubId = user?.clubsJoined[0];
  const [clubName, setClubName] = useState('');

  useEffect(() => {
    // Fetch club name for the current clubId
    if (!clubId) return;
    api.get(`/clubs/${clubId}`)
      .then(res => setClubName(res.data?.name || ''))
      .catch(() => setClubName(''));
  }, [clubId]);

  useEffect(() => {
    if (!clubId) return;
    setLoading(true);
    api.get('/events')
      .then(res => { setEvents(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load events'); setLoading(false); });
  }, [clubId, refresh]);

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleDateChange = date => setForm(f => ({ ...f, date }));
  const handleRegDeadlineChange = date => setForm(f => ({ ...f, registrationDeadline: date }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        date: form.date ? form.date.toISOString().slice(0, 10) : '',
        registrationDeadline: form.registrationDeadline ? form.registrationDeadline.toISOString().slice(0, 10) : '',
        type: 'club',
        clubId
      };
      if (editId) {
        await api.put(`/events/${editId}`, payload);
      } else {
        await api.post('/events', payload);
      }
      setForm({ title: '', description: '', date: null, time: '', venue: '', registrationDeadline: null, fee: 0 });
      setEditId(null);
      setShowForm(false);
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
      date: e.date ? new Date(e.date) : null,
      time: e.time,
      venue: e.venue,
      registrationDeadline: e.registrationDeadline ? new Date(e.registrationDeadline) : null,
      fee: e.fee || 0
    });
    setEditId(e._id);
    setShowForm(true);
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

  const canEditOrDelete = (event) => event.clubId && (event.clubId._id === clubId || event.clubId === clubId);

  if (loading) return <div className="flex justify-center py-6 text-gray-600 text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 bg-red-50 p-3 rounded-lg border border-red-200 mb-4">{error}</div>;

  return (
    <div className="bg-gradient-to-br from-[#eaf2fa] via-[#6aa9d0]/20 to-[#002147]/10 shadow-md rounded-2xl p-6 border border-[#01457e]/20">
      <h4 className="font-extrabold text-2xl mb-4 text-[#002147] tracking-wide">Club Events</h4>

      <div className="mb-6">
        <button
          className="bg-[#004983] hover:bg-[#002147] text-white px-6 py-2 rounded-lg font-semibold shadow transition"
          onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', description: '', date: null, time: '', venue: '', registrationDeadline: null, fee: 0 }); }}
        >
          Add Event
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurry overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" style={{ zIndex: 0 }} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 flex flex-col items-center" style={{ zIndex: 1 }}>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => { setShowForm(false); setEditId(null); }}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="w-full space-y-5 mt-2">
              {/* Club Name (disabled, styled) */}
              <div className="relative flex items-center">
                <Info className="absolute left-3 text-[#01457e]" size={20} />
                <input
                  className="pl-10 border border-[#01457e] p-3 rounded-lg w-full bg-[#eaf2fa] text-[#002147] font-semibold cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#6aa9d0]"
                  value={clubName || ''}
                  disabled
                  placeholder="Club Name"
                  style={{ letterSpacing: '0.5px' }}
                />
              </div>

              {/* Title */}
              <div className="relative flex items-center">
                <Pencil className="absolute left-3 text-[#01457e]" size={20} />
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInput}
                  placeholder="Event Title"
                  className="pl-10 border border-[#01457e] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#6aa9d0]"
                  required
                />
              </div>

              {/* Description */}
              <div className="relative flex items-start">
                <FileText className="absolute left-3 top-3 text-[#01457e]" size={20} />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInput}
                  placeholder="Event Description"
                  className="pl-10 border border-[#01457e] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#6aa9d0] resize-none"
                  rows={4}
                  required
                />
              </div>

              {/* Event Date */}
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 text-[#01457e]" size={20} />
                <DatePicker
                  selected={form.date}
                  onChange={handleDateChange}
                  placeholderText="Event Date"
                  className="pl-10 border border-[#01457e] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#6aa9d0]"
                  dateFormat="yyyy-MM-dd"
                  required
                />
              </div>

              {/* Time */}
              <div className="relative flex items-center">
                <Clock className="absolute left-3 text-[#01457e]" size={20} />
                <input
                  name="time"
                  value={form.time}
                  onChange={handleInput}
                  placeholder="Event Time (e.g. 10:00 AM)"
                  className="pl-10 border border-[#01457e] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#6aa9d0]"
                  required
                />
              </div>

              {/* Venue */}
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 text-[#01457e]" size={20} />
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleInput}
                  placeholder="Venue"
                  className="pl-10 border border-[#01457e] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#6aa9d0]"
                  required
                />
              </div>

              {/* Registration Deadline */}
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 text-[#01457e]" size={20} />
                <DatePicker
                  selected={form.registrationDeadline}
                  onChange={handleRegDeadlineChange}
                  placeholderText="Registration Deadline"
                  className="pl-10 border border-[#01457e] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#6aa9d0]"
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              {/* Fee */}
              <div className="relative flex items-center">
                <DollarSign className="absolute left-3 text-[#01457e]" size={20} />
                <input
                  type="number"
                  name="fee"
                  value={form.fee}
                  onChange={handleInput}
                  placeholder="Event Fee (optional)"
                  className="pl-10 border border-[#01457e] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#6aa9d0]"
                  min={0}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="submit"
                  className="bg-[#004983] hover:bg-[#002147] text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                >
                  {editId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="bg-[#6aa9d0] hover:bg-[#01457e] text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                  onClick={() => { setEditId(null); setShowForm(false); setForm({ title: '', description: '', date: null, time: '', venue: '', registrationDeadline: null, fee: 0 }); setError(''); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-[#01457e]/30 rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-[#002147] via-[#01457e] to-[#004983] text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Title</th>
              <th className="py-3 px-4 text-left font-semibold">Date</th>
              <th className="py-3 px-4 text-left font-semibold">Time</th>
              <th className="py-3 px-4 text-left font-semibold">Venue</th>
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white/80">
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-[#01457e]">No events</td>
              </tr>
            ) : (
              events.map(e => (
                <tr key={e._id} className="hover:bg-[#eaf2fa] transition-colors">
                  <td className="py-3 px-4 text-[#002147] font-medium">{e.title}</td>
                  <td className="py-3 px-4 text-[#01457e]">{e.date ? (new Date(e.date)).toLocaleDateString() : '-'}</td>
                  <td className="py-3 px-4 text-[#01457e]">{e.time}</td>
                  <td className="py-3 px-4 text-[#01457e]">{e.venue}</td>
                  <td className="py-3 px-4 space-x-2">
                    {canEditOrDelete(e) ? (
                      <>
                        <button
                          className="bg-[#004983] hover:bg-[#002147] text-white px-3 py-1.5 rounded-lg transition"
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
                      </>
                    ) : (
                      <span className="text-[#6aa9d0]">View Only</span>
                    )}
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
