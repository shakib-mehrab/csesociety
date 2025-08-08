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
      .catch(() => {
        setError('Failed to load events');
        setLoading(false);
      });
  }, [refresh]);

  const handleView = async (eventId) => {
    setLoading(true);
    setError('');
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
    setError('');
    try {
      await api.put(`/events/registrations/${registrationId}`, { status });
      setRefresh(r => !r);
      if (selectedEvent) await handleView(selectedEvent);
    } catch {
      setError('Failed to update registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">📅 Event Registration Review</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loading && (
        <p className="text-gray-600 mb-4">Loading...</p>
      )}

      <table className="w-full border border-gray-200 rounded-lg overflow-hidden mb-6">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="p-4 border-b">Event</th>
            <th className="p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={2} className="p-4 text-center text-gray-500">
                No society events found.
              </td>
            </tr>
          ) : (
            events.map(event => (
              <tr key={event._id} className="hover:bg-gray-50 transition">
                <td className="p-4 border-b">{event.title}</td>
                <td className="p-4 border-b">
                  <button
                    onClick={() => handleView(event._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  >
                    Review Registrations
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedEvent && (
        <div>
          <h4 className="text-xl font-semibold mb-4 text-gray-800">
            Registrations for{' '}
            <span className="text-indigo-600">
              {events.find(e => e._id === selectedEvent)?.title}
            </span>
          </h4>

          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Student ID</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                registrations.map(reg => (
                  <tr key={reg._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 border-b">{reg.name}</td>
                    <td className="p-4 border-b">{reg.email}</td>
                    <td className="p-4 border-b">{reg.studentId}</td>
                    <td className="p-4 border-b capitalize">{reg.status || 'pending'}</td>
                    <td className="p-4 border-b space-x-2">
                      <button
                        onClick={() => handleStatus(reg._id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatus(reg._id, 'rejected')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventRegistrationReview;
