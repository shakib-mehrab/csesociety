import React from 'react';
import { useAuth } from '../hooks/useAuth';
import SuperAdminDashboard from '../components/Dashboard/SuperAdmin/SuperAdminDashboard';
import AdminDashboard from '../components/Dashboard/Admin/AdminDashboard';
import MemberDashboard from '../components/Dashboard/Member/MemberDashboard';
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

  // Remove container/margin for super_admin dashboard
  if (user?.role === 'super_admin') {
    return renderDashboard();
  }
  return (
    <div className="container mx-auto mt-10">
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;
