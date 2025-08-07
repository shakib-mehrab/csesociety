import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ClubCard from '../components/Clubs/ClubCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const { data } = await api.get('/clubs');
        setClubs(data);
      } catch (error) {
        console.error("Failed to fetch clubs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-700">Our Clubs</h1>
        <p className="text-gray-500 mt-2 text-lg">Explore the vibrant clubs under the CSE Society</p>
      </div>

      {clubs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map(club => (
            <ClubCard key={club._id} club={club} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">No clubs found. Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default ClubsPage;
