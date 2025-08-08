/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const ClubDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const { data } = await api.get(`/clubs/${id}`);
        setClub(data);
      } catch (error) {
        toast.error('Failed to fetch club details');
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

const handleJoin = () => {
    if (!user) {
      toast.error('Please sign in to join a club');
      return;
    }
    // Redirect to payment page with clubId as query param
    window.location.href = `/payment?clubId=${club._id}`;
  };

  if (loading) return <LoadingSpinner />;
  if (!club) return <div>Club not found</div>;

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-3xl font-bold">{club.name}</h2>
      <p className="mt-4">{club.description}</p>
      <button onClick={handleJoin} className="mt-4 bg-blue-500 text-white p-2 rounded">Join Club</button>
      {/* Further details like members, events, etc. */}
    </div>
  );
};

export default ClubDetails;
