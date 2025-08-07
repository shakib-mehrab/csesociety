import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PaymentRecordForm = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    status: 'paid',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments', formData);
      toast.success('Payment recorded');
      if (onFormSubmit) onFormSubmit();
    } catch (error) {
      toast.error('Failed to record payment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Record Payment</h2>
      {/* Add form fields for payment properties */}
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Record Payment
      </button>
    </form>
  );
};

export default PaymentRecordForm;
