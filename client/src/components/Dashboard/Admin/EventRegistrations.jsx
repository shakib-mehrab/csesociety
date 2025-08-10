import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

const EventRegistrations = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const clubId = user?.clubsJoined[0];

  useEffect(() => {
    if (!clubId) return;
    setLoading(true);
    api.get('/events')
      .then(res => {
        setEvents((res.data || []).filter(e => e.type === 'club' && (e.clubId?._id === clubId || e.clubId === clubId)));
        setLoading(false);
      })
      .catch(() => { setError('Failed to load events'); setLoading(false); });
  }, [clubId]);

  const handleView = async (eventId) => {
    setLoading(true);
    try {
      const res = await api.get(`/events/${eventId}/registrations`);
      setRegistrations(res.data);
      setSelected(eventId);
    } catch {
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="font-bold mb-2">Event Registrations</h4>
      <table className="w-full border mb-4">
        <thead><tr className="bg-gray-100"><th>Event</th><th>Actions</th></tr></thead>
        <tbody>
          {events.length === 0 && <tr><td colSpan={2}>No events</td></tr>}
          {events.map(e => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td><button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleView(e._id)}>View Registrations</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div className="mb-4">
          <h5 className="font-bold mb-2">Registrations for {events.find(e => e._id === selected)?.title}</h5>
          <table className="w-full border">
            <thead><tr className="bg-gray-100"><th>Name</th><th>Email</th><th>Student ID</th></tr></thead>
            <tbody>
              {registrations.length === 0 && <tr><td colSpan={3}>No registrations</td></tr>}
              {registrations.map(r => (
                <tr key={r._id}><td>{r.name}</td><td>{r.email}</td><td>{r.studentId}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventRegistrations;
