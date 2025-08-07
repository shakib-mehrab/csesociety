import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';

const EventDetails = () => {
  const { id } = useParams();
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
    try {
        await api.post(`/events/${id}/register`);
        toast.success('Registered for event!');
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to register for event');
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-3xl font-bold">{event.title}</h2>
      <p className="mt-2 text-lg">{formatDate(event.date)} at {event.time}</p>
      <p className="mt-4">{event.description}</p>
      <button onClick={handleRegister} className="mt-4 bg-blue-500 text-white p-2 rounded">Register</button>
    </div>
  );
};

export default EventDetails;
