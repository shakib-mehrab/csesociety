/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NoticeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  if (!notice) return <div className="text-center mt-20 text-gray-500">Notice not found</div>;

  // Determine club/society label
  let clubLabel = '';
  if (notice.type === 'society') {
    clubLabel = 'Society Notice';
  } else if (notice.clubId && (notice.clubId.name || notice.clubId.clubName)) {
    clubLabel = notice.clubId.name || notice.clubId.clubName;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-6 md:px-16 shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm mb-6 opacity-80 hover:opacity-100 transition"
        >
          <ArrowLeft size={18} /> Back to Notices
        </button>

        {clubLabel && (
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold inline-block mb-4 backdrop-blur-sm">
            {clubLabel}
          </span>
        )}

        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{notice.title}</h1>
        <p className="mt-2 text-sm opacity-90">
          Published on {formatDate(notice.publishedAt)}
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <div
            className="prose max-w-none prose-lg text-gray-700 prose-headings:text-gray-900 prose-a:text-blue-600 prose-a:underline"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetails;
