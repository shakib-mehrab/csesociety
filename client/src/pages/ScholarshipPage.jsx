import React, { useState, useEffect } from 'react';
import api from '../services/api';
import NoticeCard from '../components/Notices/NoticeCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const ScholarshipPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const { data } = await api.get('/notices?type=scholarship');
        setScholarships(data);
      } catch (error) {
        console.error("Failed to fetch scholarships", error);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold">Scholarships</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {scholarships.map(notice => <NoticeCard key={notice._id} notice={notice} />)}
      </div>
    </div>
  );
};

export default ScholarshipPage;
