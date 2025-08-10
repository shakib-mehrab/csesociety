/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';
import { ArrowLeft, Calendar } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (error) {
        toast.error('Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (event && user && event.registeredUsers && event.registeredUsers.includes(user._id)) {
      toast.error('Already registered for the event');
      return;
    }
    try {
      await api.post(`/events/${id}/register`);
      toast.success('Registered for event!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to register for event';
      if (msg.toLowerCase().includes('already registered')) {
        toast.error('Already registered for the event');
      } else {
        toast.error(msg);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!event) return <div className="text-center mt-20 text-gray-500">Event not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-10 px-6 md:px-16 shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm mb-6 opacity-80 hover:opacity-100 transition"
        >
          <ArrowLeft size={18} /> Back to Events
        </button>

        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{event.title}</h1>

        <div className="flex items-center gap-3 mt-3 text-sm opacity-90">
          <Calendar size={18} />
          <span>
            {formatDate(event.date)} at {event.time}
          </span>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <p className="text-gray-700 leading-relaxed">{event.description}</p>

          <div className="mt-8">
            <button
              onClick={handleRegister}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
