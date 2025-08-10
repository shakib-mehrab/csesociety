import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPayments } from '../../../services/paymentService';

const statusColors = {
  paid: 'bg-green-100 text-green-800',
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
};

const FinancialManagement = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();
        setPayments(data);
      } catch (err) {
        setError('Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-10 flex justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-6xl relative">
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-3xl font-extrabold transition-shadow shadow-md"
          aria-label="Close and return to dashboard"
        >
          &times;
        </button>

        <h3 className="text-4xl font-extrabold mb-10 text-indigo-700">
          💰 Financial Management
        </h3>

        {loading ? (
          <p className="text-center text-indigo-600 font-semibold py-20">Loading transactions...</p>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold py-20">{error}</p>
        ) : payments.length === 0 ? (
          <p className="text-center text-gray-600 font-medium py-20">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
            <table className="min-w-full table-auto text-gray-700">
              <thead className="bg-indigo-100 text-indigo-900 font-semibold select-none">
                <tr>
                  <th className="px-8 py-4 text-left rounded-tl-lg">User</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left rounded-tr-lg text-xs text-gray-500 tracking-wide">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, idx) => (
                  <tr
                    key={payment._id}
                    className={`transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-indigo-50'
                    } hover:bg-indigo-100 cursor-default`}
                  >
                    <td className="px-8 py-5 whitespace-nowrap">
                      {payment.userId && typeof payment.userId === 'object'
                        ? `${payment.userId.name} (${payment.userId.email})`
                        : payment.userId}
                    </td>
                    <td className="px-6 py-5 font-semibold text-indigo-900 whitespace-nowrap">
                      BDT {payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          statusColors[payment.status.toLowerCase()] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(payment.paymentDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-xs text-gray-400 font-mono truncate max-w-[150px] whitespace-nowrap">
                      {payment.transactionId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialManagement;
