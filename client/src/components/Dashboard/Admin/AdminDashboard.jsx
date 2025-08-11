/* eslint-disable no-unused-vars */
import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import {
  FaUsers, FaUserCheck, FaBullhorn, FaStickyNote,
  FaCalendarAlt, FaClipboardList, FaTimes
} from 'react-icons/fa';

import ClubJoinRequests from './ClubJoinRequests';
import ClubMembers from './ClubMembers';
import ClubNotices from './ClubNotices';
import ClubEvents from './ClubEvents';
import EventRegistrations from './EventRegistrations';
import ClubAnnouncements from './ClubAnnouncements';
import TaskSection from './TaskSection';

const featureComponents = {
  joinRequests: <ClubJoinRequests />,
  members: <ClubMembers />,
  announcements: <ClubAnnouncements />,
  notices: <ClubNotices />,
  events: <ClubEvents />,
  registrations: <EventRegistrations />,
  tasks: <TaskSection />,
};

const sidebarLinks = [
  { key: 'joinRequests', label: 'Join Requests', icon: <FaUserCheck size={18} /> },
  { key: 'members', label: 'Members', icon: <FaUsers size={18} /> },
  { key: 'announcements', label: 'Announcements', icon: <FaBullhorn size={18} /> },
  { key: 'notices', label: 'Notices', icon: <FaStickyNote size={18} /> },
  { key: 'events', label: 'Events', icon: <FaCalendarAlt size={18} /> },
  { key: 'registrations', label: 'Registrations', icon: <FaClipboardList size={18} /> },
  { key: 'tasks', label: 'Tasks', icon: <FaClipboardList size={18} /> },
];

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const [club, setClub] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [activeFeature, setActiveFeature] = React.useState('announcements');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchClub = async () => {
      if (!user || isLoading) return;
      try {
        const { data } = await api.get('/clubs');
        let foundClub = null;
        if (user.role === 'coordinator') {
          foundClub = data.find(club => club.coordinator && club.coordinator._id === user._id);
        } else if (user.role === 'admin') {
          foundClub = data.find(club =>
            Array.isArray(club.subCoordinators) &&
            club.subCoordinators.some(sc => sc._id === user._id)
          );
        }
        setClub(foundClub);
      } catch {
        setClub(null);
      }
      setLoading(false);
    };
    fetchClub();
  }, [user, isLoading]);

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Sidebar */}
      <div
        className={`
          fixed md:static z-40 top-0 left-0 w-[300px] bg-[#f3f6fa] 
          shadow-2xl md:shadow-none transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 flex flex-col
        `}
        style={{ minWidth: 280, maxWidth: 340 }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center px-6 py-5 border-b bg-gradient-to-r from-[#002147] via-[#01457e] to-[#004983] text-white">
          {club && (
            <>
              {club.logo ? (
                <img
                  src={club.logo}
                  alt={`${club.name} Logo`}
                  className="w-16 h-16 object-contain rounded-full border-2 border-white mr-4"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-300 rounded-full mr-4 italic">
                  No Logo
                </div>
              )}
              <div>
                <span className="font-bold text-xl">{club.name}</span>
                <span className="block text-sm opacity-90">{club.coordinator?.name}</span>
                <span className="block text-xs opacity-80">{club.coordinator?.email}</span>
              </div>
            </>
          )}
          <button
            className="ml-auto md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          {sidebarLinks.map(link => (
            <button
              key={link.key}
              className={`flex items-center w-full px-5 py-3 mb-3 rounded-xl transition-all duration-200
                ${activeFeature === link.key
                  ? 'bg-gradient-to-r from-[#002147] via-[#01457e] to-[#004983] text-white shadow-lg'
                  : 'bg-[#f3f6fa] text-[#002147] hover:bg-[#eaf2fa] hover:shadow'}`}
              onClick={() => { setActiveFeature(link.key); setSidebarOpen(false); }}
            >
              <span className="mr-4 text-lg">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:block px-8 pb-6 text-xs text-[#01457e] border-t">
          &copy; {new Date().getFullYear()} {club?.name}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-2 md:px-8 py-6 md:py-8 overflow-y-auto bg-gradient-to-br from-[#eaf2fa] via-[#f3f6fa] to-[#6aa9d0]/10">
        <div className="w-full max-w-4xl bg-white/90 rounded-2xl shadow-2xl border border-[#01457e]/20 p-6 md:p-12 flex flex-col items-center">
          {loading ? (
            <div className="text-gray-500">Loading club info...</div>
          ) : !club ? (
            <div className="text-red-500">No club found for your account.</div>
          ) : (
            <div className="mb-6"></div>
          )}

          {/* Feature Section */}
          <div className="min-h-[300px] w-full">
            {activeFeature
              ? featureComponents[activeFeature]
              : <div className="text-gray-500">Select a feature from the sidebar.</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
