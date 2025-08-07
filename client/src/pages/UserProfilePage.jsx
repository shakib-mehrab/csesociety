import React from 'react';
import { useAuth } from '../hooks/useAuth';
import UserProfileForm from '../components/Forms/UserProfileForm';

const UserProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      <div className="mt-6">
        <UserProfileForm />
      </div>
    </div>
  );
};

export default UserProfilePage;
