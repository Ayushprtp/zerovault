'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateApiService } from '@/src/app/dashboard/api-management/actions';
import { Service } from '@/src/lib/database.types';

interface ApiSettingsFormProps {
  service: Service;
}

export default function ApiSettingsForm({ service }: ApiSettingsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    api_url: service?.api_url || '',
    api_cost: service?.api_cost || 0,
    is_api_active: service?.is_api_active || false,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        api_url: service.api_url || '',
        api_cost: service.api_cost || 0,
        is_api_active: service.is_api_active || false,
      });
    }
  }, [service]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value, 10) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (service?.id) {
      await updateApiService(service.id, formData);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="api_url" className="block text-sm font-medium text-gray-700">
          API URL
        </label>
        <input
          type="text"
          name="api_url"
          id="api_url"
          value={formData.api_url}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="api_cost" className="block text-sm font-medium text-gray-700">
          API Cost (if applicable)
        </label>
        <input
          type="number"
          name="api_cost"
          id="api_cost"
          value={formData.api_cost}
          onChange={handleChange}
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="is_api_active"
            name="is_api_active"
            type="checkbox"
            checked={formData.is_api_active}
            onChange={handleChange}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="is_api_active" className="font-medium text-gray-700">
            Is API Active
          </label>
          <p className="text-gray-500">Enable/Disable the API version of this service.</p>
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update API Settings
        </button>
      </div>
    </form>
  );
}