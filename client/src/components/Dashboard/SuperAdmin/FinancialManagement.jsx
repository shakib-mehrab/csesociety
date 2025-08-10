/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPayments } from '../../../services/paymentService';

const statusColors = {
  paid: 'bg-[#26cc00] text-white',
  completed: 'bg-[#409fc8] text-white',
  pending: 'bg-[#034986] text-white',
  failed: 'bg-[#00183a] text-white',
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
        

        <h3 className="text-4xl font-extrabold mb-10" style={{ color: '#00183a' }}>
          Financial Management
        </h3>

        {loading ? (
          <p className="text-center font-semibold py-20" style={{ color: '#034986' }}>
            Loading transactions...
          </p>
        ) : error ? (
          <p className="text-center font-semibold py-20 text-red-600">{error}</p>
        ) : payments.length === 0 ? (
          <p className="text-center font-medium py-20 text-gray-600">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
            <table className="min-w-full table-auto text-gray-700">
              <thead
                className="font-semibold select-none"
                style={{ backgroundColor: '#409fc8', color: 'white' }}
              >
                <tr>
                  <th className="px-8 py-4 text-left rounded-tl-lg" scope="col">
                    User
                  </th>
                  <th className="px-6 py-4 text-left" scope="col">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left" scope="col">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left" scope="col">
                    Date
                  </th>
                  <th
                    className="px-6 py-4 text-left rounded-tr-lg text-xs tracking-wide font-mono"
                    scope="col"
                    style={{ color: '#002a54' }}
                  >
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, idx) => (
                  <tr
                    key={payment._id}
                    className={`transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#e5f1fb]'
                    } hover:bg-[#c3defd] cursor-default`}
                  >
                    <td className="px-8 py-5 whitespace-nowrap" style={{ color: '#00183a' }}>
                      {payment.userId && typeof payment.userId === 'object'
                        ? `${payment.userId.name} (${payment.userId.email})`
                        : payment.userId}
                    </td>
                    <td
                      className="px-6 py-5 font-semibold whitespace-nowrap"
                      style={{ color: '#034986' }}
                    >
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
                    <td className="px-6 py-5 text-sm whitespace-nowrap" style={{ color: '#002a54' }}>
                      {new Date(payment.paymentDate).toLocaleString()}
                    </td>
                    <td
                      className="px-6 py-5 text-xs font-mono truncate whitespace-nowrap"
                      style={{ color: '#409fc8' }}
                      title={payment.transactionId}
                    >
                      {payment.transactionId.slice(0, 15) + '...'}
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
