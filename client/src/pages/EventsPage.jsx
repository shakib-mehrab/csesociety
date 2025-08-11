import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/Events/EventCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Search } from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eaf2fa] via-[#f3f6fa] to-[#6aa9d0] py-12 px-4 md:px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Events
        </h1>
        <div className="relative w-full md:w-80 mt-4 md:mt-0">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-md text-center text-gray-500 text-lg">
          No events found.
        </div>
      )}
    </div>
  );
};

export default EventsPage;
