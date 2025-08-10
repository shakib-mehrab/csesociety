import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

const ClubJoinRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.get('/clubs/requests')
      .then(res => {
        const clubId = user.clubsJoined[0];
        setRequests(res.data.filter(r => r.clubId._id === clubId));
        setLoading(false);
      })
      .catch(() => { setError('Failed to load join requests'); setLoading(false); });
  }, [user, refresh]);

  const handleProcess = async (id, status) => {
    setLoading(true);
    try {
      await api.put(`/clubs/requests/${id}`, { status });
      setRefresh(r => !r);
    } catch {
      setError('Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6 text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h4 className="font-semibold text-lg mb-4 text-gray-800">
        Pending Join Requests
      </h4>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Student ID</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 px-4 text-center text-gray-500"
                >
                  No pending requests
                </td>
              </tr>
            ) : (
              requests.map(r => (
                <tr
                  key={r._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">{r.userId.name}</td>
                  <td className="py-3 px-4">{r.userId.email}</td>
                  <td className="py-3 px-4">{r.userId.studentId}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                      onClick={() => handleProcess(r._id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                      onClick={() => handleProcess(r._id, 'rejected')}
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
    </div>
  );
};

export default ClubJoinRequests;
