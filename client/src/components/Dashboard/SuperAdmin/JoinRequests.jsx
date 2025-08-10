import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

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
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-[60vh] rounded-lg shadow-md">
      <h3 className="text-2xl font-extrabold mb-6 text-indigo-700 border-b pb-3">
        Club Join Requests
      </h3>

      {error && (
        <div className="mb-5 p-3 bg-red-100 text-red-700 rounded shadow-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-indigo-600 font-semibold">
          Loading join requests...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table className="min-w-full text-gray-700 text-sm border-collapse">
            <thead className="bg-indigo-100 text-indigo-900 font-semibold select-none">
              <tr>
                <th className="p-4 border border-indigo-200 text-left rounded-tl-lg">User</th>
                <th className="p-4 border border-indigo-200 text-left">Student ID</th>
                <th className="p-4 border border-indigo-200 text-left">Club</th>
                <th className="p-4 border border-indigo-200 text-left rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500 font-medium">
                    No join requests available.
                  </td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr
                    key={req._id}
                    className="hover:bg-indigo-50 transition cursor-default"
                  >
                    <td className="p-4 border border-indigo-200">
                      {req.userId?.name} <span className="text-gray-500 text-xs">({req.userId?.email})</span>
                    </td>
                    <td className="p-4 border border-indigo-200">{req.userId?.studentId}</td>
                    <td className="p-4 border border-indigo-200">{req.clubId?.name}</td>
                    <td className="p-4 border border-indigo-200 space-x-3">
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg shadow transition"
                        aria-label={`Approve join request from ${req.userId?.name}`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg shadow transition"
                        aria-label={`Reject join request from ${req.userId?.name}`}
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
