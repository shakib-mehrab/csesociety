import React from 'react';
import { Link } from 'react-router-dom';

const ClubCard = ({ club }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold">{club.name}</h3>
      <p className="text-gray-600 mt-2">{club.description.substring(0, 100)}...</p>
      <Link to={`/clubs/${club._id}`} className="text-blue-500 mt-4 inline-block">
        View Details
      </Link>
    </div>
  );
};

export default ClubCard;
