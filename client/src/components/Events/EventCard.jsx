import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import { Calendar } from 'lucide-react';

const EventCard = ({ event }) => {
  // Club name logic
  let clubLabel = '';
  if (event.clubId && (event.clubId.name || event.clubId.clubName)) {
    clubLabel = event.clubId.name || event.clubId.clubName;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-blue-100 group">
      <div className="p-7 flex flex-col h-full">
        <div className="flex items-center mb-3">
          <div className="bg-blue-100 p-3 rounded-full shadow-sm">
            <Calendar className="text-blue-600" size={28} />
          </div>
          <div className="ml-4 flex flex-col">
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded mb-1 w-fit">{clubLabel || 'Society Event'}</span>
            <span className="text-gray-500 text-sm">{formatDate(event.date)}</span>
          </div>
        </div>
        <h3 className="text-2xl font-extrabold mb-2 text-gray-900 group-hover:text-blue-700 transition-colors">{event.title}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <span className="inline-block font-medium mr-2">Venue:</span>
          <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{event.venue}</span>
        </div>
        <div className="flex-1" />
        <Link
          to={`/events/${event._id}`}
          className="mt-2 inline-block font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 px-5 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
