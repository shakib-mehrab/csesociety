import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

const ClubMembers = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const clubId = user.clubsJoined[0];
    api.get(`/clubs/${clubId}/members`)
      .then(res => { 
        setMembers(res.data); 
        setLoading(false); 
      })
      .catch(() => { 
        setError('Failed to load members'); 
        setLoading(false); 
      });
  }, [user]);

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
        Club Members
      </h4>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Student ID</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-4 px-4 text-center text-gray-500"
                >
                  No members
                </td>
              </tr>
            ) : (
              members.map(m => (
                <tr
                  key={m._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">{m.name}</td>
                  <td className="py-3 px-4">{m.email}</td>
                  <td className="py-3 px-4">{m.studentId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClubMembers;
