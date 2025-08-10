import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, Loader2 } from 'lucide-react';

const PaymentSummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const clubId = query.get('clubId');
  const clubName = query.get('clubName');
  const [loading, setLoading] = React.useState(false);

  const handleProceed = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  if (!clubId || !clubName) {
    navigate('/clubs');
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full border border-gray-100">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-cyan-100 p-3 rounded-xl">
            <CreditCard className="w-6 h-6 text-cyan-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Payment Summary
          </h2>
        </div>

        {/* Summary Details */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600 font-medium">Club</span>
            <span className="text-gray-900 font-semibold">{clubName}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600 font-medium">Amount</span>
            <span className="text-gray-900 font-bold text-lg">৳ 100 BDT</span>
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          <span>{loading ? 'Redirecting...' : 'Proceed to Payment'}</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentSummaryPage;
