import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

const ClubAnnouncements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const clubId = user?.clubsJoined[0];

  useEffect(() => {
    if (!clubId) return;
    setLoading(true);
    Promise.all([
      api.get(`/notices?type=club&clubId=${clubId}`),
      api.get(`/events?clubId=${clubId}`)
    ])
      .then(([noticesRes, eventsRes]) => {
        const notices = (noticesRes.data || []).map(n => ({
          _id: n._id,
          type: 'Notice',
          title: n.title,
          content: n.content,
          date: n.createdAt || n.expiresAt,
        }));
        const events = (eventsRes.data || []).map(e => ({
          _id: e._id,
          type: 'Event',
          title: e.title,
          content: e.description,
          date: e.date,
        }));
        const all = [...notices, ...events].sort((a, b) => new Date(b.date) - new Date(a.date));
        setAnnouncements(all);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load announcements'); setLoading(false); });
  }, [clubId]);

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
        Club Announcements
      </h4>

      <div className="overflow-x-auto">
        <table className="w-full border border-[#01457e]/30 rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-[#002147] via-[#01457e] to-[#004983] text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Type</th>
              <th className="py-3 px-4 text-left font-semibold">Title</th>
              <th className="py-3 px-4 text-left font-semibold">Date</th>
              <th className="py-3 px-4 text-left font-semibold">Content</th>
            </tr>
          </thead>
          <tbody className="bg-white/80">
            {announcements.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-[#01457e]">
                  No announcements
                </td>
              </tr>
            ) : (
              announcements.map(a => (
                <tr
                  key={a.type + a._id}
                  className="hover:bg-[#eaf2fa] transition-colors"
                >
                  <td className="py-3 px-4 text-[#004983] font-semibold">{a.type}</td>
                  <td className="py-3 px-4 text-[#002147] font-medium">{a.title}</td>
                  <td className="py-3 px-4 text-[#01457e]">{a.date ? a.date.slice(0, 10) : '-'}</td>
                  <td className="py-3 px-4 text-[#01457e]">
                    {a.content?.slice(0, 60)}
                    {a.content?.length > 60 ? '...' : ''}
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

export default ClubAnnouncements;
