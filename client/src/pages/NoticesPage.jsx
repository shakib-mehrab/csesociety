import React, { useState, useEffect } from 'react';
import api from '../services/api';
import NoticeCard from '../components/Notices/NoticeCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold">Notices</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {notices.map(notice => <NoticeCard key={notice._id} notice={notice} />)}
      </div>
    </div>
  );
};

export default NoticesPage;
