import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import { Calendar } from 'lucide-react';

const EventCard = ({ event }) => {
  // Extract club name
  const clubLabel =
    event.clubId?.name || event.clubId?.clubName || 'Society Event';

  return (
    <div
      className="bg-gradient-to-br rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border group"
      style={{
        backgroundImage:
          'linear-gradient(to bottom right, #6aa9d0, #ffffff)',
        borderColor: '#6aa9d0',
      }}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div
            className="p-3 rounded-full shadow-sm flex items-center justify-center"
            style={{ backgroundColor: '#d4e6f7' }} // lighter #6aa9d0 tint
          >
            <Calendar className="text-[#004983]" size={24} />
          </div>
          <div className="ml-4">
            <span
              className="text-xs font-semibold px-2 py-1 rounded mb-1 inline-block"
              style={{
                color: '#01457e',
                backgroundColor: '#d4e6f7',
              }}
            >
              {clubLabel}
            </span>
            <span className="block text-gray-500 text-sm">
              {formatDate(event.date)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-xl font-bold mb-3 transition-colors line-clamp-2"
          style={{ color: '#002147' }}
        >
          {event.title}
        </h3>

        {/* Venue */}
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <span className="font-medium mr-2" style={{ color: '#002147' }}>
            Venue:
          </span>
          <span
            className="px-2 py-1 rounded text-xs font-semibold"
            style={{
              color: '#01457e',
              backgroundColor: '#d4e6f7',
            }}
          >
            {event.venue}
          </span>
        </div>

        {/* Spacer to push button down */}
        <div className="flex-grow" />

        {/* View Details Button */}
        <Link
          to={`/events/${event._id}`}
          className="mt-2 inline-block font-semibold transition-colors duration-200 px-5 py-2 rounded-lg shadow focus:outline-none focus:ring-2 text-sm md:text-base"
          style={{
            backgroundColor: '#01457e',
            color: 'white',
            boxShadow: '0 2px 6px rgba(1, 69, 126, 0.5)',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#004983')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#01457e')
          }
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
