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
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-[#eaf2fa] via-[#6aa9d0]/20 to-[#002147]/10 rounded-2xl shadow-md border border-[#01457e]/20">
      <h4 className="text-2xl font-extrabold text-[#002147] mb-6 border-b-2 border-[#01457e] pb-2 tracking-wide">
        Event Registrations
      </h4>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full table-auto text-sm rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-[#002147] via-[#01457e] to-[#004983] text-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                Event
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/80 divide-y divide-[#6aa9d0]/30">
            {loading && (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-[#01457e]">
                  Loading events...
                </td>
              </tr>
            )}
            {!loading && events.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-[#01457e]">
                  No events found.
                </td>
              </tr>
            )}
            {!loading &&
              events.map((e) => (
                <tr key={e._id} className="hover:bg-[#eaf2fa] transition-colors border-b last:border-b-0">
                  <td className="px-6 py-4 whitespace-nowrap text-[#002147] font-medium">
                    {e.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleView(e._id)}
                      className="bg-[#004983] hover:bg-[#002147] text-white px-4 py-1 rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#6aa9d0] focus:ring-offset-2"
                      style={{ minWidth: 120 }}
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
          <h5 className="text-xl font-semibold text-[#002147] mb-4 border-b-2 border-[#01457e] pb-2">
            Registrations for{' '}
            <span className="text-[#004983]">
              {events.find((e) => e._id === selected)?.title}
            </span>
          </h5>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm rounded-xl overflow-hidden">
              <thead className="bg-gradient-to-r from-[#002147] via-[#01457e] to-[#004983] text-white">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    Student ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    Payment Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    Transaction ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    Payment Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    Payment Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/80 divide-y divide-[#6aa9d0]/30">
                {loading && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-[#01457e]">
                      Loading registrations...
                    </td>
                  </tr>
                )}
                {!loading && registrations.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-[#01457e]">
                      No registrations found.
                    </td>
                  </tr>
                )}
                {!loading &&
                  registrations.map((r) => (
                    <tr key={r._id} className="hover:bg-[#eaf2fa] transition-colors border-b last:border-b-0">
                      <td className="px-6 py-4 whitespace-nowrap text-[#002147]">
                        {r.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#01457e]">
                        {r.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#01457e]">
                        {r.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#01457e]">
                        {r.payment ? r.payment.amount : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#01457e]">
                        {r.payment ? r.payment.transactionId : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#01457e]">
                        {r.payment ? r.payment.status : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-[#01457e]">
                        {r.payment && r.payment.paymentDate ? new Date(r.payment.paymentDate).toLocaleString() : <span className="text-gray-400">-</span>}
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
