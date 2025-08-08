/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
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

const featureComponents = {
  user: <UserManagement />,
  club: <ClubManagement />,
  content: <ContentManagement />,
  event: <EventManagement />,
  finance: <FinancialManagement />,
  report: <ReportingAnalytics />,
  joinRequests: <JoinRequests />,
  eventRegistrations: <EventRegistrationReview />,
};

const features = [
  { key: 'user', label: 'User Management', icon: User },
  { key: 'joinRequests', label: 'Club Join Requests', icon: Users },
  { key: 'club', label: 'Club Management', icon: ClipboardList },
  { key: 'finance', label: 'Financial Management', icon: DollarSign },
  { key: 'content', label: 'Content Management', icon: FileText },
  { key: 'event', label: 'Event Management', icon: Calendar },
  { key: 'eventRegistrations', label: 'Event Registration Review', icon: ClipboardCheck },
  { key: 'report', label: 'Reporting & Analytics', icon: BarChart2 },
];

const SuperAdminDashboard = () => {
  const [activeFeature, setActiveFeature] = useState('user');

  return (
    <div className="h-screen flex flex-col bg-gradient-to-tr from-indigo-50 via-white to-indigo-100 font-sans text-gray-800">
      {/* Smaller header */}
      <header className="flex-shrink-0 py-3 px-6 bg-white shadow-md">
        <h1 className="text-2xl font-extrabold text-indigo-700">Super Admin Dashboard</h1>
        <p className="text-indigo-500 mt-0.5 text-sm">Manage all core features effortlessly</p>
      </header>

      {/* Main content */}
      <main className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Sidebar */}
        <nav
          className="w-64 bg-white rounded-xl shadow-md p-4 flex flex-col gap-3
                     overflow-y-auto"
        >
          <h2 className="text-xl font-semibold text-indigo-700 mb-3">Features</h2>
          {features.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveFeature(key)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg shadow-md transition
                hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-indigo-300
                ${activeFeature === key ? 'bg-indigo-600 text-white' : 'text-indigo-700'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-base">{label}</span>
            </button>
          ))}
        </nav>

        {/* Content area */}
        <section className="flex-1 bg-white rounded-2xl shadow-2xl p-6 overflow-auto">
          {featureComponents[activeFeature]}
        </section>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
