import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Page Not Found</p>
      <Link to="/" className="text-blue-500 mt-6 inline-block">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
