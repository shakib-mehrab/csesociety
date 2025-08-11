import React, { useState, useEffect } from 'react';
import api from '../services/api';
import NoticeCard from '../components/Notices/NoticeCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Search } from 'lucide-react';

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await api.get('/notices');
        setNotices(data);
      } catch (error) {
        console.error("Failed to fetch notices", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter((notice) =>
    notice.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf2fa] via-[#f3f6fa] to-[#6aa9d0] py-10 px-4 md:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#002147] flex items-center space-x-2">
          <span role="img" aria-label="megaphone" className="text-[#01457e]">📢</span>
          <span>Notices</span>
        </h1>
        <div className="relative w-full md:w-72 mt-4 md:mt-0">
          <Search className="absolute left-3 top-2.5 text-[#6aa9d0]" size={18} />
          <input
            type="text"
            placeholder="Search notices..."
            className="
              w-full pl-10 pr-4 py-2 text-sm border rounded-lg shadow-sm
              focus:ring-2 focus:ring-[#6aa9d0] focus:border-[#01457e] bg-white
              text-[#002147]
            "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Notices Grid */}
      {filteredNotices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <div
              key={notice._id}
              className="transform transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <NoticeCard notice={notice} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md text-center text-[#01457e] font-semibold">
          No notices found.
        </div>
      )}
    </div>
  );
};

export default NoticesPage;
