import React, { useState, useEffect } from 'react';

const dummyData = {
  totalMembers: 125,
  totalClubs: 12,
  upcomingEvents: 5,
  totalRevenueBDT: 150000,
  activeMembersPercentage: 78,
};

const ReportingAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate fetching data with delay
    const timer = setTimeout(() => {
      setData(dummyData);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">📊 Reporting & Analytics</h3>

      {!data ? (
        <p className="text-gray-600">Loading analytics...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-indigo-100 rounded-lg shadow flex flex-col items-center">
            <div className="text-indigo-600 text-4xl font-extrabold mb-2">{data.totalMembers}</div>
            <div className="text-indigo-700 font-semibold">Total Members</div>
          </div>
          <div className="p-6 bg-green-100 rounded-lg shadow flex flex-col items-center">
            <div className="text-green-600 text-4xl font-extrabold mb-2">{data.totalClubs}</div>
            <div className="text-green-700 font-semibold">Total Clubs</div>
          </div>
          <div className="p-6 bg-yellow-100 rounded-lg shadow flex flex-col items-center">
            <div className="text-yellow-600 text-4xl font-extrabold mb-2">{data.upcomingEvents}</div>
            <div className="text-yellow-700 font-semibold">Upcoming Events</div>
          </div>
          <div className="p-6 bg-blue-100 rounded-lg shadow flex flex-col items-center">
            <div className="text-blue-600 text-4xl font-extrabold mb-2">BDT {data.totalRevenueBDT.toLocaleString()}</div>
            <div className="text-blue-700 font-semibold">Total Revenue</div>
          </div>
          <div className="p-6 bg-purple-100 rounded-lg shadow flex flex-col items-center">
            <div className="text-purple-600 text-4xl font-extrabold mb-2">{data.activeMembersPercentage}%</div>
            <div className="text-purple-700 font-semibold">Active Members</div>
          </div>
        </div>
      )}

      {!data && <p className="mt-6 text-center text-gray-400 italic">Feature coming soon...</p>}
    </div>
  );
};

export default ReportingAnalytics;
