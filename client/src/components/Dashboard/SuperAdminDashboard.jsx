import React, { useState } from 'react';
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

const SuperAdminDashboard = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  const handleOpen = (feature) => setActiveFeature(feature);
  const handleClose = () => setActiveFeature(null);

  return (
    <div>
      <h2 className="text-2xl font-bold">Super Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('user')}>User Management</button>
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('joinRequests')}>Club Join Requests</button>
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('club')}>Club Management</button>
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('finance')}>Financial Management</button>
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('content')}>Content Management</button>
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('event')}>Event Management</button>
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('eventRegistrations')}>Event Registration Review</button>
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('report')}>Reporting & Analytics</button>
      </div>

      {/* Simple modal/drawer for feature sections */}
      {activeFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={handleClose}>&times;</button>
            {featureComponents[activeFeature]}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
