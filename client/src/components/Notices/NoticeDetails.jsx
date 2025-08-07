import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

const NoticeDetails = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const { data } = await api.get(`/notices/${id}`);
        setNotice(data);
      } catch (error) {
        toast.error('Failed to fetch notice details');
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!notice) return <div>Notice not found</div>;

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-3xl font-bold">{notice.title}</h2>
      <p className="text-sm text-gray-500 mt-2">Published on: {formatDate(notice.publishedAt)}</p>
      <div className="mt-6" dangerouslySetInnerHTML={{ __html: notice.content }}></div>
    </div>
  );
};

export default NoticeDetails;
