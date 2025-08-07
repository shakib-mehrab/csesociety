import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const NoticeForm = ({ notice, onFormSubmit }) => {
  const [formData, setFormData] = useState(notice || {
    title: '',
    content: '',
    type: 'society',
    clubId: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (notice) {
        await api.put(`/notices/${notice._id}`, formData);
        toast.success('Notice updated');
      } else {
        await api.post('/notices', formData);
        toast.success('Notice created');
      }
      if (onFormSubmit) onFormSubmit();
    } catch (error) {
      toast.error('Failed to save notice');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{notice ? 'Edit Notice' : 'Create Notice'}</h2>
      {/* Add form fields for notice properties */}
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        {notice ? 'Update Notice' : 'Create Notice'}
      </button>
    </form>
  );
};

export default NoticeForm;
