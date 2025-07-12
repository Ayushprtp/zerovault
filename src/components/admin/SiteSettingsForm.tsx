'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSiteSettings, updateSiteSettings } from '@/src/app/dashboard/settings/site/actions';

interface SiteSettings {
  key: string;
  value: string;
}

export default function SiteSettingsForm() {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await getSiteSettings();
      if (error) {
        setError('Failed to fetch settings');
      } else {
        setSettings(data || []);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(settings.map(setting =>
      setting.key === key ? { ...setting, value } : setting
    ));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await updateSiteSettings(settings);
    if (error) {
      setError('Failed to update settings');
    } else {
      alert('Settings updated successfully!');
      router.refresh();
    }
    setLoading(false);
  };

  if (loading) {
    return <p>Loading settings...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Site Settings</h2>
      {settings.map(setting => (
        <div key={setting.key}>
          <label htmlFor={setting.key} className="block text-sm font-medium text-gray-700">
            {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} {/* Basic key formatting */}
          </label>
          <input
            type="text"
            name={setting.key}
            id={setting.key}
            value={setting.value}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      ))}
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSiteSettings, updateSiteSettings } from '@/src/app/dashboard/settings/site/actions';

interface SiteSettings {
  key: string;
  value: string;
}

export default function SiteSettingsForm() {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await getSiteSettings();
      if (error) {
        setError('Failed to fetch settings');
      } else {
        setSettings(data || []);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(settings.map(setting =>
      setting.key === key ? { ...setting, value } : setting
    ));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await updateSiteSettings(settings);
    if (error) {
      setError('Failed to update settings');
    } else {
      alert('Settings updated successfully!');
      router.refresh();
    }
    setLoading(false);
  };

  if (loading) {
    return <p>Loading settings...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Site Settings</h2>
      {settings.map(setting => (
        <div key={setting.key}>
          <label htmlFor={setting.key} className="block text-sm font-medium text-gray-700">
            {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} {/* Basic key formatting */}
          </label>
          <input
            type="text"
            name={setting.key}
            id={setting.key}
            value={setting.value}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      ))}
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}