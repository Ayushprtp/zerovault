'use client';

import { useState, useEffect } from 'react';
import { updateSetting } from '@/src/app/dashboard/settings/site/actions'; // Assuming action is in site settings actions
import { SiteSetting } from '@/src/lib/database.types'; // Assuming SiteSetting type

interface ActionThrottlingSettingsFormProps {
  settings: SiteSetting[]; // Or a specific type for throttling settings if structured differently
}

export default function ActionThrottlingSettingsForm({ settings }: ActionThrottlingSettingsFormProps) {
  const [maxSupportTicketsPerHour, setMaxSupportTicketsPerHour] = useState(
    settings.find(s => s.key === 'max_support_tickets_per_hour')?.value || '5'
  );
  // Add state for other throttling settings as defined in your GEMINI.md

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ticketSetting = settings.find(s => s.key === 'max_support_tickets_per_hour');
    if (ticketSetting) {
      setMaxSupportTicketsPerHour(ticketSetting.value || '5');
    }
    // Update state for other throttling settings as needed
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Update specific settings. You might need separate actions or a single action handling multiple keys
      await updateSetting('max_support_tickets_per_hour', maxSupportTicketsPerHour);
      // Call updateSetting for other throttling settings
      setSuccess(true);
    } catch (err) {
      setError('Failed to update settings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'max_support_tickets_per_hour') {
      setMaxSupportTicketsPerHour(value);
    }
    // Handle input changes for other throttling settings
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="max_support_tickets_per_hour" className="block text-sm font-medium text-gray-700">
          Max Support Tickets per Hour
        </label>
        <input
          type="number"
          name="max_support_tickets_per_hour"
          id="max_support_tickets_per_hour"
          value={maxSupportTicketsPerHour}
          onChange={handleInputChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Add input fields for other action throttling settings here */}

      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Throttling Settings'}
        </button>
      </div>

      {success && (
        <p className="text-green-600 text-sm">Settings saved successfully!</p>
      )}
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </form>
  );
}