import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const EventRegistrationReview = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/events')
      .then(res => {
        // Only show society events
        setEvents((res.data || []).filter(e => e.type === 'society'));
        setLoading(false);
      })
      .catch(() => { setError('Failed to load events'); setLoading(false); });
  }, [refresh]);

  const handleView = async (eventId) => {
    setLoading(true);
    try {
      const res = await api.get(`/events/${eventId}/registrations`);
      setRegistrations(res.data);
      setSelectedEvent(eventId);
    } catch {
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (registrationId, status) => {
    setLoading(true);
    try {
      await api.put(`/events/registrations/${registrationId}`, { status });
      setRefresh(r => !r);
      if (selectedEvent) handleView(selectedEvent);
    } catch {
      setError('Failed to update registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="font-bold mb-2">Event Registration Review</h4>
      <table className="w-full border mb-4">
        <thead><tr className="bg-gray-100"><th>Event</th><th>Actions</th></tr></thead>
        <tbody>
          {events.length === 0 && <tr><td colSpan={2}>No events</td></tr>}
          {events.map(e => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td><button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleView(e._id)}>Review Registrations</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEvent && (
        <div className="mb-4">
          <h5 className="font-bold mb-2">Registrations for {events.find(e => e._id === selectedEvent)?.title}</h5>
          <table className="w-full border">
            <thead><tr className="bg-gray-100"><th>Name</th><th>Email</th><th>Student ID</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {registrations.length === 0 && <tr><td colSpan={5}>No registrations</td></tr>}
              {registrations.map(r => (
                <tr key={r._id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.studentId}</td>
                  <td>{r.status || 'pending'}</td>
                  <td>
                    <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleStatus(r._id, 'approved')}>Approve</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleStatus(r._id, 'rejected')}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventRegistrationReview;
