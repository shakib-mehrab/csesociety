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

  const handleRegister = () => {
    if (
      event &&
      user &&
      event.registeredUsers &&
      event.registeredUsers.some(
        u => (typeof u === 'string' ? u === user._id : u._id === user._id)
      )
    ) {
      toast.error('Already registered for the event');
      return;
    }
    navigate(`/events/${id}/payment`);
  };

  if (loading) return <LoadingSpinner />;
  if (!event)
    return (
      <div className="text-center mt-20" style={{ color: '#002147' }}>
        Event not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf2fa] via-[#f3f6fa] to-[#6aa9d0] pb-12">
      {/* Hero Section */}
      <div
        className="text-white py-10 px-6 md:px-16 shadow-md"
        style={{
          background:
            'linear-gradient(to right, #002147, #01457e, #6aa9d0, #004983)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm mb-6 opacity-80 hover:opacity-100 transition"
          style={{ color: 'rgba(255 255 255 / 0.85)' }}
        >
          <ArrowLeft size={18} />
          Back to Events
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
        <div
          className="rounded-2xl shadow-lg p-6 md:p-10"
          style={{ backgroundColor: 'white', color: '#002147' }}
        >
          <p className="leading-relaxed">{event.description}</p>

          <div className="mt-8">
            <button
              onClick={handleRegister}
              className="px-6 py-3 font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
              style={{
                backgroundColor: '#01457e',
                color: 'white',
                boxShadow: '0 4px 12px rgba(1,69,126,0.5)',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = '#004983')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = '#01457e')
              }
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
