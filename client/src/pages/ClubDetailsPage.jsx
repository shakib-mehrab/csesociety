/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const ClubDetailsPage = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const fetchClub = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/clubs/${id}`);
        setClub(res.data);
        // Check if user has already joined (assuming API returns this info)
        if (res.data.hasJoined) setHasJoined(true);
      } catch (err) {
        setError('Failed to load club details');
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!club) return null;


  // Join club handler
  const handleJoinClub = async () => {
    setJoinLoading(true);
    setJoinError('');
    setJoinSuccess('');
    try {
      const res = await api.post(`/clubs/${id}/join`);
      setJoinSuccess('Join request sent!');
      setHasJoined(true);
    } catch (err) {
      setJoinError(
        err?.response?.data?.message || 'Failed to join club. Please try again.'
      );
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-8 mb-8 items-center">
          <div className="flex-shrink-0 w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            {club.logo ? (
              <img src={club.logo} alt={club.name} className="object-cover w-full h-full" />
            ) : (
              <span className="text-blue-400 text-6xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{club.name}</h1>
            <p className="text-gray-600 mb-4 text-lg">{club.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {club.contactEmail && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Email: {club.contactEmail}</span>
              )}
            </div>
            {/* Join Button */}
            <div className="mt-4">
              {hasJoined ? (
                <button className="px-6 py-2 rounded-lg bg-green-100 text-green-700 font-semibold cursor-not-allowed" disabled>
                  Joined
                </button>
              ) : (
                <button
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                  onClick={handleJoinClub}
                  disabled={joinLoading}
                >
                  {joinLoading ? 'Joining...' : 'Join Club'}
                </button>
              )}
              {joinError && <div className="text-red-500 mt-2 text-sm">{joinError}</div>}
              {joinSuccess && <div className="text-green-600 mt-2 text-sm">{joinSuccess}</div>}
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Coordinator</h2>
          {club.coordinator ? (
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <img
                src={club.coordinator.profilePicture || '/default-avatar.png'}
                alt={club.coordinator.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{club.coordinator.name}</h3>
                <p className="text-gray-600">{club.coordinator.email}</p>
                {club.coordinator.phone && (
                  <p className="text-gray-500">Phone: {club.coordinator.phone}</p>
                )}
                {club.coordinator.studentId && (
                  <p className="text-gray-500">Student ID: {club.coordinator.studentId}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No coordinator information available.</div>
          )}
        </div>
        <div className="flex justify-between mt-8">
          <Link to="/clubs" className="text-blue-600 hover:underline">&larr; Back to Clubs</Link>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailsPage;
