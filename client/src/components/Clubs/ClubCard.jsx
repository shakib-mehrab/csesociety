import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const ClubCard = ({ club }) => {
  const { user } = useAuth();
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (!user) {
      toast.error('Please sign in to join a club');
      return;
    }
    // Redirect to payment page with clubId as query param
    window.location.href = `/payment?clubId=${club._id}`;
  };

  return (
    <div className="bg-white p-0 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex flex-col overflow-hidden">
      <div className="relative h-40 w-full bg-gray-100 flex items-center justify-center">
        {club.logo ? (
          <img src={club.logo} alt={club.name} className="object-cover w-full h-full" />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-blue-400 text-6xl bg-blue-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </span>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{club.name}</h3>
        <p className="text-gray-600 mb-4 flex-1">
          {club.description.length > 100 ? club.description.substring(0, 100) + '...' : club.description}
        </p>
        <div className="flex gap-2 mt-auto">
          <Link
            to={`/clubs/${club._id}`}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            View Details
          </Link>
          <button
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center disabled:opacity-60"
            onClick={handleJoin}
            disabled={joining || joined}
          >
            {joined ? 'Requested' : joining ? 'Joining...' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
