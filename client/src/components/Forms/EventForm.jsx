import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EventForm = ({ event, onFormSubmit }) => {
  const [formData, setFormData] = useState(event || {
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    type: 'society',
    clubId: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (event) {
        await api.put(`/events/${event._id}`, formData);
        toast.success('Event updated');
      } else {
        await api.post('/events', formData);
        toast.success('Event created');
      }
      if (onFormSubmit) onFormSubmit();
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{event ? 'Edit Event' : 'Create Event'}</h2>
      {/* Add form fields for event properties */}
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        {event ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  );
};

export default EventForm;
