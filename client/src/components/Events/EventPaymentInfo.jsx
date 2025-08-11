import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const EventPaymentInfo = () => {
  const { id } = useParams(); // eventId
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/events/${id}`)
      .then(res => { setEvent(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load event info'); setLoading(false); });
  }, [id]);

  const handlePay = async () => {
    setPaying(true);
    try {
      const res = await api.get(`/payments/event/init?eventId=${id}`);
      if (res.data && res.data.GatewayPageURL) {
        window.location.href = res.data.GatewayPageURL;
      } else {
        setError('Failed to initiate payment');
      }
    } catch {
      setError('Failed to initiate payment');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-[#01457e]">Loading event payment info...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!event) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-lg border border-[#01457e]/20 p-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[#002147] mb-2">Event Payment</h2>
      <div className="mb-4 text-[#01457e] text-lg font-semibold">{event.title}</div>
      <div className="mb-2 text-gray-700">
        Organized by: <span className="font-medium">
          {event.type === 'club' ? event.clubId?.name : event.organizer?.name}
        </span>
      </div>
      <div className="mb-2 text-gray-700">Venue: <span className="font-medium">{event.venue}</span></div>
      <div className="mb-2 text-gray-700">Date: <span className="font-medium">{event.date?.slice(0,10)}</span></div>
      <div className="mb-2 text-gray-700">Fee: <span className="font-bold text-[#004983]">৳ {event.fee || 0}</span></div>
      <button
        className="mt-6 bg-[#004983] hover:bg-[#002147] text-white px-8 py-3 rounded-full font-bold text-lg shadow transition-all focus:outline-none focus:ring-2 focus:ring-[#6aa9d0] focus:ring-offset-2"
        onClick={handlePay}
        disabled={paying}
      >
        {paying ? 'Redirecting...' : 'Pay with SSLCommerz'}
      </button>
      <button
        className="mt-4 text-[#01457e] underline hover:text-[#004983] text-sm"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  );
};

export default EventPaymentInfo;
