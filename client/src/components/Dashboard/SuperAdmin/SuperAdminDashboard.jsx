/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import {
  User,
  Users,
  ClipboardList,
  DollarSign,
  FileText,
  Calendar,
  ClipboardCheck,
  BarChart2,
} from 'lucide-react';

import UserManagement from './UserManagement';
import ClubManagement from './ClubManagement';
import ContentManagement from './ContentManagement';
import EventManagement from './EventManagement';
import EventRegistrationReview from './EventRegistrationReview';
import FinancialManagement from './FinancialManagement';
import ReportingAnalytics from './ReportingAnalytics';
import JoinRequests from './JoinRequests';
// Scholarship Management
import ScholarshipManagement from './ScholarshipManagement';

const featureComponents = {
  user: <UserManagement />,
  club: <ClubManagement />,
  // content: <ContentManagement />,
  event: <EventManagement />,
  finance: <FinancialManagement />,
  report: <ReportingAnalytics />,
  joinRequests: <JoinRequests />,
  eventRegistrations: <EventRegistrationReview />,
  scholarship: <ScholarshipManagement />,
};

const features = [
  { key: 'user', label: 'User Management', icon: User },
  { key: 'joinRequests', label: 'Club Join Requests', icon: Users },
  { key: 'club', label: 'Club Management', icon: ClipboardList },
  { key: 'finance', label: 'Financial Management', icon: DollarSign },
  // { key: 'content', label: 'Content Management', icon: FileText },
  { key: 'event', label: 'Event Management', icon: Calendar },
  { key: 'eventRegistrations', label: 'Registration Review', icon: ClipboardCheck },
  { key: 'scholarship', label: 'Manage Scholarship', icon: DollarSign },
  { key: 'report', label: 'Reporting & Analytics', icon: BarChart2 },
];

const colors = {
  darkest: '#00183a',
  dark: '#002a54',
  medium: '#034986',
  light: '#409fc8',
};

const SuperAdminDashboard = () => {
  const { logout } = useAuth();
  const [activeFeature, setActiveFeature] = useState(() => {
    return localStorage.getItem('superadmin_active_feature') || 'user';
  });

  useEffect(() => {
    localStorage.setItem('superadmin_active_feature', activeFeature);
  }, [activeFeature]);

  return (
    <div
      className="h-screen flex flex-col font-sans text-gray-800"
      style={{
        background:
          'linear-gradient(135deg, #00183a 0%, #034986 50%, #002a54 90%, #409fc8 100%)',
        color: colors.light,
      }}
    >
      {/* Header */}
      <header
        className="flex-shrink-0 py-6 px-6 bg-transparent flex items-center justify-between"
        style={{ color: colors.light }}
      >
        <h1 className="text-3xl font-extrabold text-center ">
          Super Admin Dashboard
        </h1>
        <button
          onClick={logout}
          className="ml-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
          style={{ marginLeft: 'auto' }}
        >
          Logout
        </button>
      </header>

      {/* Main content */}
      <main className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Sidebar */}
        <nav
          className="w-64 rounded-xl p-4 flex flex-col gap-3 overflow-y-auto"
          style={{ backgroundColor: colors.dark, color: colors.light }}
        >
          <h2 className="text-xl font-semibold mb-3" style={{ color: colors.light }}>
            Features
          </h2>
          {features.map(({ key, label, icon: Icon }) => {
            const isActive = activeFeature === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFeature(key)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg shadow-md transition focus:outline-none focus:ring-4 group ${isActive ? '' : 'hover:bg-blue-100 hover:text-blue-900'}`}
                style={{
                  backgroundColor: isActive ? colors.medium : 'transparent',
                  color: isActive ? '#fff' : colors.light,
                  boxShadow: isActive
                    ? `0 0 8px 2px ${colors.light}`
                    : 'none',
                  border: isActive ? `2px solid ${colors.light}` : '2px solid transparent',
                  transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, border 0.2s',
                }}
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-base">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content area */}
        <section
          className="flex-1 rounded-2xl p-6 overflow-auto shadow-2xl"
          style={{ backgroundColor: '#fff', color: colors.dark }}
        >
          {featureComponents[activeFeature]}
        </section>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
