import React from 'react';
import { useAuth } from '../hooks/useAuth';
import SuperAdminDashboard from '../components/Dashboard/SuperAdminDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import MemberDashboard from '../components/Dashboard/MemberDashboard';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const DashboardPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  const renderDashboard = () => {
    switch (user?.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'admin':
      case 'coordinator':
        return <AdminDashboard />;
      case 'member':
        return <MemberDashboard />;
      default:
        return <div>Welcome!</div>;
    }
  };

  return (
    <div className="container mx-auto mt-10">
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;
