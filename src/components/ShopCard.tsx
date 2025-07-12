'use client';

// This file should contain the code for the ShopCard component
// based on Phase 13 of the GEMINI.md document.
// It should display a card for a membership tier or ZeroCoin pack
// with details and a "Contact Support to Buy" button.

// Note: The actual implementation will depend on the specific code
// provided in Phase 13 of your GEMINI.md. This is a placeholder.

import React from 'react';

interface ShopCardProps {
  name: string;
  description: string;
  type: 'membership' | 'coinpack';
}

const ShopCard: React.FC<ShopCardProps> = ({ name, description, type }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
      </div>
      <button className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-200">
        Contact Support to Buy
      </button>
    </div>
  );
};

export default ShopCard;
