import React from 'react';
import PaymentRecordForm from '../components/Forms/PaymentRecordForm';

const PaymentPage = () => {
  // This page should be protected for Super Admins only
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold">Payment Management</h1>
      <div className="mt-6">
        <PaymentRecordForm />
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold">All Payments</h2>
        {/* Table of payments will go here */}
      </div>
    </div>
  );
};

export default PaymentPage;
