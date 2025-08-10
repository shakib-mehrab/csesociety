/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

const colors = {
  darkest: '#00183a',
  dark: '#002a54',
  medium: '#034986',
  light: '#409fc8',
};

const JoinRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/clubs/requests')
      .then(res => { setRequests(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load join requests'); setLoading(false); });
  }, [refresh]);

  const handleApprove = async (requestId) => {
    setLoading(true);
    setError('');
    try {
      await api.put(`/clubs/requests/${requestId}`, { status: 'approved' });
      setRefresh(r => !r);
    } catch (err) {
      setError('Failed to approve request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    setLoading(true);
    setError('');
    try {
      await api.delete(`/clubs/requests/${requestId}`);
      setRefresh(r => !r);
    } catch (err) {
      setError('Failed to reject (delete) request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-[60vh] rounded-lg shadow-md"
      style={{ border: `1px solid ${colors.medium}` }}
    >
      <h3
        className="text-2xl font-extrabold mb-6 border-b pb-3"
        style={{ color: colors.darkest }}
      >
        Club Join Requests
      </h3>

      {error && (
        <div
          className="mb-5 p-3 rounded shadow-sm"
          style={{ backgroundColor: '#fddede', color: '#9b2226' }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          className="text-center py-16 font-semibold"
          style={{ color: colors.medium }}
        >
          Loading join requests...
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-lg shadow-lg bg-white"
          style={{ border: `1px solid ${colors.medium}` }}
        >
          <table
            className="min-w-full text-sm border-collapse"
            style={{ color: colors.darkest }}
          >
            <thead
              className="font-semibold select-none"
              style={{ backgroundColor: colors.light, color: '#fff' }}
            >
              <tr>
                <th
                  className="p-4 border text-left"
                  style={{ borderColor: colors.medium, borderTopLeftRadius: 12 }}
                >
                  User
                </th>
                <th
                  className="p-4 border text-left"
                  style={{ borderColor: colors.medium }}
                >
                  Student ID
                </th>
                <th
                  className="p-4 border text-left"
                  style={{ borderColor: colors.medium }}
                >
                  Club
                </th>
                <th
                  className="p-4 border text-left"
                  style={{ borderColor: colors.medium, borderTopRightRadius: 12 }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-6 text-center font-medium"
                    style={{ color: colors.medium }}
                  >
                    No join requests available.
                  </td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr
                    key={req._id}
                    className="hover:bg-indigo-50 transition cursor-default"
                    style={{ borderBottom: `1px solid ${colors.light}` }}
                  >
                    <td className="p-4 border" style={{ borderColor: colors.medium }}>
                      {req.userId?.name}{' '}
                      <span
                        className="text-xs"
                        style={{ color: '#666' }}
                      >
                        ({req.userId?.email})
                      </span>
                    </td>
                    <td className="p-4 border" style={{ borderColor: colors.medium }}>
                      {req.userId?.studentId}
                    </td>
                    <td className="p-4 border" style={{ borderColor: colors.medium }}>
                      {req.clubId?.name}
                    </td>
                    <td
                      className="p-4 space-x-3"
                      style={{ borderColor: colors.medium }}
                    >
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="px-4 py-1 rounded-lg shadow transition font-semibold"
                        aria-label={`Approve join request from ${req.userId?.name}`}
                        style={{
                          backgroundColor: colors.medium,
                          color: '#fff',
                        }}
                        onMouseOver={e => (e.currentTarget.style.backgroundColor = colors.dark)}
                        onMouseOut={e => (e.currentTarget.style.backgroundColor = colors.medium)}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="px-4 py-1 rounded-lg shadow transition font-semibold"
                        aria-label={`Reject join request from ${req.userId?.name}`}
                        style={{
                          backgroundColor: '#9b2226',
                          color: '#fff',
                        }}
                        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#7a1a1d')}
                        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#9b2226')}
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

export default JoinRequests;
