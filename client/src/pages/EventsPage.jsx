import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/Events/EventCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold">Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {events.map(event => <EventCard key={event._id} event={event} />)}
      </div>
    </div>
  );
};

export default EventsPage;
