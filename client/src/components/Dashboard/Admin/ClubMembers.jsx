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

    const fetchMembers = async () => {
      setLoading(true);
      try {
        const clubId = user.clubsJoined[0];
        const { data } = await api.get(`/clubs/${clubId}/members`);
        setMembers(data);
      } catch {
        setError('Failed to load members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
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
    <div className="bg-gradient-to-br from-[#eaf2fa] via-[#6aa9d0]/20 to-[#002147]/10 shadow-md rounded-2xl p-6 border border-[#01457e]/20">
      <h4 className="font-extrabold text-2xl mb-4 text-[#002147] tracking-wide">
        Club Members
      </h4>

      <div className="overflow-x-auto">
        <table className="w-full border border-[#01457e]/30 rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-[#002147] via-[#01457e] to-[#004983] text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Name</th>
              <th className="py-3 px-4 text-left font-semibold">Email</th>
              <th className="py-3 px-4 text-left font-semibold">Student ID</th>
            </tr>
          </thead>
          <tbody className="bg-white/80">
            {members.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-4 px-4 text-center text-[#01457e]"
                >
                  No members
                </td>
              </tr>
            ) : (
              members.map(({ _id, name, email, studentId }) => (
                <tr
                  key={_id}
                  className="hover:bg-[#eaf2fa] transition-colors"
                >
                  <td className="py-3 px-4 text-[#002147] font-medium">{name}</td>
                  <td className="py-3 px-4 text-[#01457e]">{email}</td>
                  <td className="py-3 px-4 text-[#01457e]">{studentId}</td>
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
