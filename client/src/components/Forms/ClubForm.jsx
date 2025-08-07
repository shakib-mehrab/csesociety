import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ClubForm = ({ club, onFormSubmit }) => {
  const [formData, setFormData] = useState(club || {
    name: '',
    description: '',
    contactEmail: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (club) {
        await api.put(`/clubs/${club._id}`, formData);
        toast.success('Club updated');
      } else {
        await api.post('/clubs', formData);
        toast.success('Club created');
      }
      if (onFormSubmit) onFormSubmit();
    } catch (error) {
      toast.error('Failed to save club');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{club ? 'Edit Club' : 'Create Club'}</h2>
      {/* Add form fields for club properties */}
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        {club ? 'Update Club' : 'Create Club'}
      </button>
    </form>
  );
};

export default ClubForm;
