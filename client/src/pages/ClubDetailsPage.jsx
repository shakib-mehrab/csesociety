/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import EventCard from '../components/Events/EventCard';

const ClubDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);


  useEffect(() => {
    const fetchClubAndEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const [clubRes, eventsRes] = await Promise.all([
          api.get(`/clubs/${id}`),
          api.get(`/events?clubId=${id}`),
        ]);
        setClub(clubRes.data);
        // Only show events where event.clubId matches the current club id (handles backend population edge cases)
        const filteredEvents = (eventsRes.data || []).filter(ev => {
          if (!ev.clubId) return false;
          // clubId can be an object or string
          if (typeof ev.clubId === 'string') return ev.clubId === clubRes.data._id;
          if (typeof ev.clubId === 'object' && ev.clubId._id) return ev.clubId._id === clubRes.data._id;
          return false;
        });
        setEvents(filteredEvents);
        if (clubRes.data.hasJoined) setHasJoined(true);
      } catch (err) {
        setError('Failed to load club details');
      } finally {
        setLoading(false);
      }
    };
    fetchClubAndEvents();
  }, [id]);


  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!club) return null;


  // Join club handler
  const handleJoinClub = () => {
    if (!user) {
      toast.error('Please sign in to join a club');
      return;
    }
    // Check if user is already a member of this club
    if (user.clubsJoined && user.clubsJoined.some(
      c => (typeof c === 'string' ? c === club._id : c._id === club._id)
    )) {
      toast.success('Already Joined');
      setHasJoined(true);
      return;
    }
    // Navigate to payment summary page with clubId and clubName
    navigate(`/payment-summary?clubId=${club._id}&clubName=${encodeURIComponent(club.name)}`);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-2 md:px-0">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
        {/* Club Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 items-center">
          <div className="flex-shrink-0 w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-blue-200 shadow">
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
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 drop-shadow">{club.name}</h1>
            <div className="mb-4 text-gray-700 text-lg">
              {club.description && club.description.length > 220 ? (
                <>
                  <span>{showFullDesc ? club.description : club.description.slice(0, 220) + '...'}</span>
                  <button
                    className="ml-2 text-blue-600 hover:underline text-sm font-semibold"
                    onClick={() => setShowFullDesc(v => !v)}
                  >
                    {showFullDesc ? 'Show less' : 'Read more'}
                  </button>
                </>
              ) : (
                <span>{club.description}</span>
              )}
            </div>
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
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 shadow"
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

        {/* Benefits Section (placeholder, can be replaced with real data) */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-900 mb-3">Why Join {club.name}?</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Networking with like-minded peers and professionals</li>
            <li>Exclusive access to club events and workshops</li>
            <li>Leadership and teamwork opportunities</li>
            <li>Enhance your resume with real-world experience</li>
            <li>Be part of a vibrant campus community</li>
          </ul>
        </div>

        {/* Events Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-900 mb-3">Upcoming Events</h2>
          {events.length === 0 ? (
            <div className="text-gray-500">No upcoming events for this club.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>

        {/* Coordinators Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-900 mb-3">Coordinator</h2>
          <div className="flex flex-wrap gap-6 mb-8">
            {club.coordinator ? (
              <div className="flex flex-col items-center bg-blue-50 border border-blue-100 rounded-xl p-5 shadow w-64">
                <img
                  src={club.coordinator.profilePicture && club.coordinator.profilePicture !== '' ? club.coordinator.profilePicture : '/default-avatar.png'}
                  alt={club.coordinator.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow mb-2"
                  onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                />
                <h3 className="text-lg font-bold text-gray-900">{club.coordinator.name}</h3>
                <p className="text-gray-600 text-sm">{club.coordinator.email}</p>
                {club.coordinator.studentId && (
                  <p className="text-gray-500 text-xs">ID: {club.coordinator.studentId}</p>
                )}
              </div>
            ) : (
              <div className="text-gray-500 flex items-center">No coordinator listed.</div>
            )}
          </div>
          <h2 className="text-2xl font-semibold text-blue-900 mb-3">Subcoordinators</h2>
          <div className="flex flex-wrap gap-6">
            {club.subCoordinators && club.subCoordinators.length > 0 ? (
              club.subCoordinators.map(sub => (
                <div key={sub._id} className="flex flex-col items-center bg-blue-50 border border-blue-100 rounded-xl p-5 shadow w-64">
                  <img
                    src={sub.profilePicture && sub.profilePicture !== '' ? sub.profilePicture : '/default-avatar.png'}
                    alt={sub.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow mb-2"
                    onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                  />
                  <h3 className="text-lg font-bold text-gray-900">{sub.name}</h3>
                  <p className="text-gray-600 text-sm">{sub.email}</p>
                  {sub.studentId && (
                    <p className="text-gray-500 text-xs">ID: {sub.studentId}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 flex items-center">No subcoordinators listed.</div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="flex justify-between mt-8">
          <Link to="/clubs" className="text-blue-600 hover:underline">&larr; Back to Clubs</Link>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailsPage;
