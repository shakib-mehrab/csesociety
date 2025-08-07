import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UserProfileForm = ({ onFormSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', formData);
      toast.success('Profile updated');
      if (onFormSubmit) onFormSubmit();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      {/* Add form fields for user profile properties */}
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Update Profile
      </button>
    </form>
  );
};

export default UserProfileForm;
