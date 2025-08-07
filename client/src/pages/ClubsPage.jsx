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
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold">Clubs</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {clubs.map(club => <ClubCard key={club._id} club={club} />)}
      </div>
    </div>
  );
};

export default ClubsPage;
