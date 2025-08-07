import React, { useEffect, useState } from 'react';
import api from '../../services/api';

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
      await api.put(`/clubs/requests/${requestId}`, { status: 'rejected' });
      setRefresh(r => !r);
    } catch (err) {
      setError('Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Club Join Requests</h3>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">User</th>
              <th className="p-2 border">Student ID</th>
              <th className="p-2 border">Club</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req._id}>
                <td className="p-2 border">{req.userId?.name} ({req.userId?.email})</td>
                <td className="p-2 border">{req.userId?.studentId}</td>
                <td className="p-2 border">{req.clubId?.name}</td>
                <td className="p-2 border">
                  <button className="bg-green-600 text-white px-2 py-1 rounded mr-2" onClick={() => handleApprove(req._id)}>Approve</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleReject(req._id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JoinRequests;
