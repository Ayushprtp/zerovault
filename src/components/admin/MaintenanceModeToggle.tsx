'use client';

import { useState } from 'react';
import { toggleMaintenanceMode } from '@/src/app/dashboard/settings/maintenance/actions';

interface MaintenanceModeToggleProps {
  initialState: boolean;
}

export default function MaintenanceModeToggle({ initialState }: MaintenanceModeToggleProps) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const newState = !isMaintenanceMode;
    try {
      await toggleMaintenanceMode(newState);
      setIsMaintenanceMode(newState);
    } catch (error) {
      console.error('Failed to toggle maintenance mode:', error);
      // Optionally show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="maintenance-toggle" className="text-sm font-medium text-gray-700">
        Maintenance Mode
      </label>
      <button
        id="maintenance-toggle"
        type="button"
        aria-pressed={isMaintenanceMode}
        onClick={handleToggle}
        disabled={isLoading}
        className={`${
          isMaintenanceMode ? 'bg-indigo-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        role="switch"
      >
        <span
          aria-hidden="true"
          className={`${
            isMaintenanceMode ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        ></span>
      </button>
      {isLoading && <span className="text-sm text-gray-500">Saving...</span>}
    </div>
  );
}