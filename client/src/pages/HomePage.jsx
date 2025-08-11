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
    <div className="bg-gradient-to-br from-[#eaf2fa] via-[#f3f6fa] to-[#6aa9d0]">
      {/* Hero Section */}
      <section className="relative bg-[#002147] text-white text-center py-24">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-extrabold leading-tight">
            Comilla University CSE Society
          </h1>
          <p className="mt-4 text-2xl font-light">
            Connect, Collaborate, and Code with the Brightest Minds.
          </p>
          <Link
            to="/register"
            className="mt-10 inline-block bg-[#6aa9d0] text-[#002147] font-bold py-4 px-8 rounded-full hover:bg-[#004983] hover:text-white transition duration-300 text-lg"
          >
            Join the Society
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#002147]">
            Why Join Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                icon: <Calendar size={40} />,
                title: "Exclusive Events",
                desc: "Get access to workshops, seminars, and hackathons.",
              },
              {
                icon: <Users size={40} />,
                title: "Networking",
                desc: "Connect with peers, alumni, and industry professionals.",
              },
              {
                icon: <Code size={40} />,
                title: "Skill Development",
                desc: "Enhance your technical and soft skills through our programs.",
              },
              {
                icon: <Megaphone size={40} />,
                title: "Stay Informed",
                desc: "Get the latest news and announcements from the department.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-[#6aa9d0]/20 text-[#004983] mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-br from-[#eaf2fa] via-[#f3f6fa] to-[#6aa9d0]">
        <div className="container mx-auto px-4 py-20">
          {/* Upcoming Events Section */}
          <section>
            <h2 className="text-4xl font-bold text-center mb-12 text-[#002147]">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/events"
                className="bg-[#01457e] text-white font-bold py-3 px-6 rounded-full hover:bg-[#004983] transition duration-300"
              >
                View All Events
              </Link>
            </div>
          </section>

          {/* Latest Announcements Section */}
          <section className="mt-24">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#002147]">
              Latest Announcements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {notices.map((notice) => (
                <NoticeCard key={notice._id} notice={notice} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/notices"
                className="bg-[#01457e] text-white font-bold py-3 px-6 rounded-full hover:bg-[#004983] transition duration-300"
              >
                View All Notices
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Call to Action Section */}
      <section className="bg-[#002147] text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold">
            Ready to Be Part of the Community?
          </h2>
          <p className="mt-4 text-xl">
            Join now and start your journey with the CSE Society.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-block bg-[#6aa9d0] text-[#002147] font-bold py-4 px-8 rounded-full hover:bg-[#004983] hover:text-white transition duration-300 text-lg"
          >
            Create an Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
