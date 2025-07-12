'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUser } from '@/src/app/dashboard/users/actions';
import { Profile } from '@/src/lib/database.types';

interface EditUserFormProps {
  user: Profile;
}

export default function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: user.username || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    avatar_url: user.avatar_url || '',
    role: user.role || 'free',
    zero_coins: user.zero_coins || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateUser(user.id, formData);
    router.push('/dashboard/users');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          name="first_name"
          id="first_name"
          value={formData.first_name || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          name="last_name"
          id="last_name"
          value={formData.last_name || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">
          Avatar URL
        </label>
        <input
          type="text"
          name="avatar_url"
          id="avatar_url"
          value={formData.avatar_url || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="elite">Elite</option>
          <option value="dev">Dev</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label htmlFor="zero_coins" className="block text-sm font-medium text-gray-700">
          ZeroCoins
        </label>
        <input
          type="number"
          name="zero_coins"
          id="zero_coins"
          value={formData.zero_coins}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update User
        </button>
      </div>
    </form>
  );
}