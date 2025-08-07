import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">Manage Club Members</div>
        <div className="bg-white p-4 rounded-lg shadow">Host Club Events</div>
        <div className="bg-white p-4 rounded-lg shadow">Publish Club Notices</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
