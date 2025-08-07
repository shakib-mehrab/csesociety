import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import { Calendar } from 'lucide-react';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Calendar className="text-blue-600" />
          </div>
          <p className="text-gray-600 text-sm ml-3">{formatDate(event.date)} at {event.venue}</p>
        </div>
        <h3 className="text-2xl font-bold mb-3 text-gray-800">{event.title}</h3>
        <Link to={`/events/${event._id}`} className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300">
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
