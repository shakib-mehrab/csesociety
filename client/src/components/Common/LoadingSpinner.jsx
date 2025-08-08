import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-[100px]">
      <div
        className="animate-spin rounded-full h-12 w-12
          border-4 border-t-blue-600 border-b-gray-300 border-l-gray-300 border-r-gray-300"
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
