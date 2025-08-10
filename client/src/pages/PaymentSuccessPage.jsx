import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const clubId = query.get('clubId');
    if (!clubId) {
      setError('Missing club information.');
      setLoading(false);
      return;
    }
    setSuccess(true);
    toast.success('Payment successful! Join request sent.');
    setTimeout(() => navigate(`/clubs/${clubId}`), 2000);
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {loading && <div className="text-xl font-semibold mb-4">Processing your membership...</div>}
      {error && <div className="text-red-500 text-lg">{error}</div>}
      {success && !loading && <div className="text-green-600 text-lg">Membership request sent! Redirecting...</div>}
    </div>
  );
};

export default PaymentSuccessPage;
