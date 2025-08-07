import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/Events/EventCard';
import NoticeCard from '../components/Notices/NoticeCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { Calendar, Megaphone, Users, Code } from 'lucide-react';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, noticesRes] = await Promise.all([
          api.get('/events?limit=3'),
          api.get('/notices?type=society&limit=3'),
        ]);
        setEvents(eventsRes.data);
        setNotices(noticesRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-blue-700 text-white text-center py-24">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold leading-tight">Comilla University CSE Society</h1>
          <p className="mt-4 text-2xl font-light">
            Connect, Collaborate, and Code with the Brightest Minds.
          </p>
          <Link to="/register" className="mt-10 inline-block bg-yellow-400 text-blue-800 font-bold py-4 px-8 rounded-full hover:bg-yellow-500 transition duration-300 text-lg">
            Join the Society
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Why Join Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="text-center">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                <Calendar size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Exclusive Events</h3>
              <p className="text-gray-600">Get access to workshops, seminars, and hackathons.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                <Users size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Networking</h3>
              <p className="text-gray-600">Connect with peers, alumni, and industry professionals.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                <Code size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Skill Development</h3>
              <p className="text-gray-600">Enhance your technical and soft skills through our programs.</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
                <Megaphone size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Stay Informed</h3>
              <p className="text-gray-600">Get the latest news and announcements from the department.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          {/* Upcoming Events Section */}
          <section>
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {events.map(event => <EventCard key={event._id} event={event} />)}
            </div>
            <div className="text-center mt-12">
              <Link to="/events" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300">
                View All Events
              </Link>
            </div>
          </section>

          {/* Latest Announcements Section */}
          <section className="mt-24">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Latest Announcements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {notices.map(notice => <NoticeCard key={notice._id} notice={notice} />)}
            </div>
            <div className="text-center mt-12">
              <Link to="/notices" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300">
                View All Notices
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Call to Action Section */}
      <section className="bg-blue-700 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold">Ready to Be Part of the Community?</h2>
          <p className="mt-4 text-xl">
            Join now and start your journey with the CSE Society.
          </p>
          <Link to="/register" className="mt-8 inline-block bg-yellow-400 text-blue-800 font-bold py-4 px-8 rounded-full hover:bg-yellow-500 transition duration-300 text-lg">
            Create an Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
