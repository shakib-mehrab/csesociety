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
    <div className="bg-gradient-to-br from-[#eaf2fa] via-[#6aa9d0]/20 to-[#002147]/10 shadow-md rounded-2xl p-6 border border-[#01457e]/20">
      <h4 className="font-extrabold text-2xl mb-4 text-[#002147] tracking-wide">
        Pending Join Requests
      </h4>

      <div className="overflow-x-auto">
        <table className="w-full border border-[#01457e]/30 rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-[#002147] via-[#01457e] to-[#004983] text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Name</th>
              <th className="py-3 px-4 text-left font-semibold">Email</th>
              <th className="py-3 px-4 text-left font-semibold">Student ID</th>
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white/80">
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 px-4 text-center text-[#01457e]"
                >
                  No pending requests
                </td>
              </tr>
            ) : (
              requests.map(r => (
                <tr
                  key={r._id}
                  className="hover:bg-[#eaf2fa] transition-colors"
                >
                  <td className="py-3 px-4 text-[#002147] font-medium">{r.userId.name}</td>
                  <td className="py-3 px-4 text-[#01457e]">{r.userId.email}</td>
                  <td className="py-3 px-4 text-[#01457e]">{r.userId.studentId}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      className="bg-[#004983] hover:bg-[#002147] text-white px-3 py-1.5 rounded-lg transition-colors"
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
