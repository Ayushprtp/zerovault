import React from 'react';

const MaintenancePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Under Maintenance</h1>
        <p className="text-gray-600 text-lg">
          We're currently performing scheduled maintenance.
          <br />
          Please check back later.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;