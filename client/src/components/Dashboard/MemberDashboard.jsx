import React from 'react';

const MemberDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold">Member Dashboard</h2>
      <div className="mt-6">
        <h3 className="text-xl font-semibold">My Clubs</h3>
        {/* List of clubs joined */}
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold">My Events</h3>
        {/* List of registered events */}
      </div>
    </div>
  );
};

export default MemberDashboard;
