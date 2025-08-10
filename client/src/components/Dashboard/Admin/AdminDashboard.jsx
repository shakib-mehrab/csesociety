/* eslint-disable no-unused-vars */
import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import { 
  FaUsers, FaUserCheck, FaBullhorn, FaStickyNote, 
  FaCalendarAlt, FaClipboardList, FaBars, FaTimes 
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex font-sans">
      {/* Sidebar */}
      <div
        className={`
          fixed md:static z-40 top-0 left-0 h-full w-64 bg-white 
          shadow-2xl md:shadow-none transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 flex flex-col
        `}
      >
        {/* Sidebar Header with new gradient and logo */}
        <div className="flex items-center px-4 py-4 border-b bg-gradient-to-r from-[#002147] via-[#01457e] via-[#6aa9d0] to-[#004983] text-white">
          {club && (
            <>
              {club.logo ? (
                <img 
                  src={club.logo} 
                  alt={`${club.name} Logo`} 
                  className="w-14 h-14 object-contain rounded-full border-2 border-white mr-3" 
                />
              ) : (
                <div className="w-14 h-14 flex items-center justify-center bg-gray-300 rounded-full mr-3 text-sm italic">
                  No Logo
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-lg">{club.name}</span>
                <span className="text-sm opacity-90">{club.coordinator?.name}</span>
                <span className="text-xs opacity-80">{club.coordinator?.email}</span>
              </div>
            </>
          )}
          <button
            className="ml-auto md:hidden text-white hover:text-gray-200"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
          {sidebarLinks.map(link => (
            <button
              key={link.key}
              className={`flex items-center w-full px-4 py-2 mb-2 rounded-lg transition-all duration-200
                ${activeFeature === link.key
                  ? 'bg-gradient-to-r from-[#002147] via-[#01457e] to-[#004983] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow'}`}
              onClick={() => { setActiveFeature(link.key); setSidebarOpen(false); }}
            >
              <span className="mr-3 text-lg">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:block px-6 pb-4 text-xs text-gray-400 border-t">
          &copy; {new Date().getFullYear()} {club?.name}
        </div>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-full shadow-lg border border-gray-200"
        onClick={() => setSidebarOpen(true)}
        style={{ display: sidebarOpen ? 'none' : 'block' }}
        aria-label="Open sidebar"
      >
        <FaBars size={22} />
      </button>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-2 md:px-8 py-8 md:py-12 overflow-y-auto">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 md:p-10 custom-scrollbar">
          {loading ? (
            <div className="text-gray-500">Loading club info...</div>
          ) : !club ? (
            <div className="text-red-500">No club found for your account.</div>
          ) : (
            <div className="mb-6"></div> // Removed logo section from here
          )}

          {/* Feature Section */}
          <div className="min-h-[300px]">
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
