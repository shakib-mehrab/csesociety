import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const clubId = query.get('clubId');

  useEffect(() => {
    if (!clubId) {
      navigate('/clubs');
      return;
    }
    // Initiate payment by calling backend
    const startPayment = async () => {
      try {
        const res = await api.get(`/payments/init?clubId=${clubId}`);
        if (res.data && res.data.GatewayPageURL) {
          window.location.href = res.data.GatewayPageURL;
        } else {
          alert('Failed to initiate payment.');
          navigate('/clubs');
        }
      } catch (err) {
        alert('Failed to initiate payment.');
        navigate('/clubs');
        console.error('Payment initiation error:', err);
      }
    };
    startPayment();
  }, [clubId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-xl font-semibold mb-4">Redirecting to payment gateway...</div>
      <div className="text-gray-500">Please wait.</div>
    </div>
  );
};

export default PaymentPage;
