/* eslint-disable no-unused-vars */
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h4 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
        Event Registrations
      </h4>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Event
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                  Loading events...
                </td>
              </tr>
            )}
            {!loading && events.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
            {!loading &&
              events.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                    {e.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleView(e._id)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
                    >
                      View Registrations
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div>
          <h5 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Registrations for{' '}
            <span className="text-blue-600">
              {events.find((e) => e._id === selected)?.title}
            </span>
          </h5>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Student ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      Loading registrations...
                    </td>
                  </tr>
                )}
                {!loading && registrations.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No registrations found.
                    </td>
                  </tr>
                )}
                {!loading &&
                  registrations.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {r.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {r.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {r.studentId}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRegistrations;
