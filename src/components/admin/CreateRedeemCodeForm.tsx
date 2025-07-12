'use client';

import { useState } from 'react';
import { createRedeemCode } from '@/src/app/dashboard/redeem-codes/actions'; // Assuming actions file path
import { useRouter } from 'next/navigation';

interface CreateRedeemCodeFormProps {
  roles: { role: string }[]; // Assuming roles are fetched and passed down
}

export default function CreateRedeemCodeForm({ roles }: CreateRedeemCodeFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    codeType: 'single', // 'single' or 'bulk'
    singleCode: '',
    bulkPrefix: '',
    bulkCount: 1,
    zeroCoinAmount: 0,
    assignedRole: '',
    keepExistingRole: true,
    isTimeLimited: false,
    duration: 0, // in days
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value, 10) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createRedeemCode(formData);
      // Clear form or show success message
      setFormData({
        codeType: 'single',
        singleCode: '',
        bulkPrefix: '',
        bulkCount: 1,
        zeroCoinAmount: 0,
        assignedRole: '',
        keepExistingRole: true,
        isTimeLimited: false,
        duration: 0,
      });
      router.refresh(); // Refresh the page to show new codes
    } catch (error) {
      console.error('Error creating redeem code:', error);
      // Show error message to user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Redeem Code(s)</h3>

      <div>
        <label htmlFor="codeType" className="block text-sm font-medium text-gray-700">
          Code Type
        </label>
        <select
          id="codeType"
          name="codeType"
          value={formData.codeType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="single">Single Code</option>
          <option value="bulk">Bulk Codes</option>
        </select>
      </div>

      {formData.codeType === 'single' ? (
        <div>
          <label htmlFor="singleCode" className="block text-sm font-medium text-gray-700">
            Single Code
          </label>
          <input
            type="text"
            name="singleCode"
            id="singleCode"
            value={formData.singleCode}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="bulkPrefix" className="block text-sm font-medium text-gray-700">
              Bulk Prefix
            </label>
            <input
              type="text"
              name="bulkPrefix"
              id="bulkPrefix"
              value={formData.bulkPrefix}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="bulkCount" className="block text-sm font-medium text-gray-700">
              Number of Codes
            </label>
            <input
              type="number"
              name="bulkCount"
              id="bulkCount"
              value={formData.bulkCount}
              onChange={handleChange}
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="zeroCoinAmount" className="block text-sm font-medium text-gray-700">
          ZeroCoin Amount
        </label>
        <input
          type="number"
          name="zeroCoinAmount"
          id="zeroCoinAmount"
          value={formData.zeroCoinAmount}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="assignedRole" className="block text-sm font-medium text-gray-700">
          Assign Role (Optional)
        </label>
        <select
          id="assignedRole"
          name="assignedRole"
          value={formData.assignedRole}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">None</option>
          {roles.map((role) => (
            <option key={role.role} value={role.role}>
              {role.role}
            </option>
          ))}
           <option value="group">Group Role (Special)</option> {/* Add special "Group" role */}
        </select>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="keepExistingRole"
            name="keepExistingRole"
            type="checkbox"
            checked={formData.keepExistingRole}
            onChange={handleChange}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="keepExistingRole" className="font-medium text-gray-700">
            Keep Existing Role if Higher
          </label>
          <p className="text-gray-500">If checked, the user's role will only be updated if the assigned role is higher than their current role.</p>
        </div>
      </div>


      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="isTimeLimited"
            name="isTimeLimited"
            type="checkbox"
            checked={formData.isTimeLimited}
            onChange={handleChange}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="isTimeLimited" className="font-medium text-gray-700">
            Time Limited Membership
          </label>
          <p className="text-gray-500">If checked, the assigned role will expire after a set duration.</p>
        </div>
      </div>

      {formData.isTimeLimited && (
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (days)
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            value={formData.duration}
            onChange={handleChange}
            required={formData.isTimeLimited}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      )}


      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Code(s)
        </button>
      </div>
    </form>
  );
}