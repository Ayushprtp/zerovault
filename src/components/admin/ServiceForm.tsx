'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createService, updateService } from '@/src/app/dashboard/services/actions';
import { Service } from '@/src/lib/database.types';

interface ServiceFormProps {
 service?: Service;
}

export default function ServiceForm({ service }: ServiceFormProps) {
 const router = useRouter();
 const [formData, setFormData] = useState({
 name: service?.name || '',
 description: service?.description || '',
 thumbnail_url: service?.thumbnail_url || '',
 api_url: service?.api_url || '',
 cost_per_query: service?.cost_per_query || 1,
 is_active: service?.is_active || true,
 is_beta: service?.is_beta || false,
 api_cost: service?.api_cost || 0,
 is_api_active: service?.is_api_active || false,
 });

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
 const { name, value, type } = e.target;
 setFormData({
 ...formData,
 [name]: type === 'number' ? parseInt(value, 10) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
 });
 };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 if (service) {
 await updateService(service.id, formData);
 } else {
 await createService(formData);
 }
 router.push('/dashboard/services');
 router.refresh();
 };

 return (
 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
 Service Name
 </label>
 <input
 type="text"
 name="name"
 id="name"
 value={formData.name}
 onChange={handleChange}
 required
 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
 />
 </div>
 <div>
 <label htmlFor="description" className="block text-sm font-medium text-gray-700">
 Description
 </label>
 <textarea
 id="description"
 name="description"
 rows={3}
 value={formData.description}
 onChange={handleChange}
 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
 ></textarea>
 </div>
 <div>
 <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700">
 Thumbnail URL
 </label>
 <input
 type="text"
 name="thumbnail_url"
 id="thumbnail_url"
 value={formData.thumbnail_url}
 onChange={handleChange}
 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
 />
 </div>
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
 <label htmlFor="cost_per_query" className="block text-sm font-medium text-gray-700">
 Cost Per Query (ZeroCoins)
 </label>
 <input
 type="number"
 name="cost_per_query"
 id="cost_per_query"
 value={formData.cost_per_query}
 onChange={handleChange}
 required
 min="0"
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
 id="is_active"
 name="is_active"
 type="checkbox"
 checked={formData.is_active}
 onChange={handleChange}
 className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
 />
 </div>
 <div className="ml-3 text-sm">
 <label htmlFor="is_active" className="font-medium text-gray-700">
 Is Active
 </label>
 <p className="text-gray-500">Toggle service visibility on the public status page.</p>
 </div>
 </div>
 <div className="flex items-start">
 <div className="flex items-center h-5">
 <input
 id="is_beta"
 name="is_beta"
 type="checkbox"
 checked={formData.is_beta}
 onChange={handleChange}
 className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
 />
 </div>
 <div className="ml-3 text-sm">
 <label htmlFor="is_beta" className="font-medium text-gray-700">
 Is Beta
 </label>
 <p className="text-gray-500">Restrict visibility to testers (dev/admin roles).</p>
 </div>
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
 {service ? 'Update Service' : 'Create Service'}
 </button>
 </div>
 </form>
 );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createService, updateService } from '@/src/app/dashboard/services/actions';
import { Service } from '@/src/lib/database.types';

interface ServiceFormProps {
  service?: Service;
}

export default function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    thumbnail_url: service?.thumbnail_url || '',
    api_url: service?.api_url || '',
    cost_per_query: service?.cost_per_query || 1,
    is_active: service?.is_active || true,
    is_beta: service?.is_beta || false,
    api_cost: service?.api_cost || 0,
    is_api_active: service?.is_api_active || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value, 10) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (service) {
      await updateService(service.id, formData);
    } else {
      await createService(formData);
    }
    router.push('/dashboard/services');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Service Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        ></textarea>
      </div>
      <div>
        <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700">
          Thumbnail URL
        </label>
        <input
          type="text"
          name="thumbnail_url"
          id="thumbnail_url"
          value={formData.thumbnail_url}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
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
        <label htmlFor="cost_per_query" className="block text-sm font-medium text-gray-700">
          Cost Per Query (ZeroCoins)
        </label>
        <input
          type="number"
          name="cost_per_query"
          id="cost_per_query"
          value={formData.cost_per_query}
          onChange={handleChange}
          required
          min="0"
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
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={formData.is_active}
            onChange={handleChange}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="is_active" className="font-medium text-gray-700">
            Is Active
          </label>
          <p className="text-gray-500">Toggle service visibility on the public status page.</p>
        </div>
      </div>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="is_beta"
            name="is_beta"
            type="checkbox"
            checked={formData.is_beta}
            onChange={handleChange}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="is_beta" className="font-medium text-gray-700">
            Is Beta
          </label>
          <p className="text-gray-500">Restrict visibility to testers (dev/admin roles).</p>
        </div>
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
          {service ? 'Update Service' : 'Create Service'}
        </button>
      </div>
    </form>
  );
}