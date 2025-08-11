import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EventPaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Optionally, parse eventId or other params from query string
  // const params = new URLSearchParams(location.search);
  // const eventId = params.get('eventId');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#eaf2fa] via-[#f3f6fa] to-[#6aa9d0]">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full flex flex-col items-center border border-[#01457e]/20">
        <svg className="mb-4" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#22c55e"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"/></svg>
        <h2 className="text-2xl font-bold text-[#002147] mb-2">Payment Successful!</h2>
        <p className="text-[#01457e] mb-4 text-center">Thank you for registering for the event. Your payment has been received and your registration is confirmed.</p>
        <button
          className="mt-4 bg-[#004983] hover:bg-[#002147] text-white px-8 py-3 rounded-full font-bold text-lg shadow transition-all focus:outline-none focus:ring-2 focus:ring-[#6aa9d0] focus:ring-offset-2"
          onClick={() => navigate('/events')}
        >
          Back to Events
        </button>
      </div>
    </div>
  );
};

export default EventPaymentSuccessPage;
