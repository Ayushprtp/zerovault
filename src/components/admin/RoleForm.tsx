'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createRole, updateRole } from '@/src/app/dashboard/roles/actions';
import { RolePermissions } from '@/src/lib/database.types';

interface RoleFormProps {
  rolePermission?: RolePermissions;
}

export default function RoleForm({ rolePermission }: RoleFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: rolePermission?.role || '',
    rpm_limit: rolePermission?.rpm_limit || 10,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rolePermission) {
      await updateRole(rolePermission.role, formData);
    } else {
      await createRole(formData);
    }
    router.push('/dashboard/roles');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role Name
        </label>
        <input
          type="text"
          name="role"
          id="role"
          value={formData.role}
          onChange={handleChange}
          required
          disabled={!!rolePermission} // Disable role name input when editing
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label htmlFor="rpm_limit" className="block text-sm font-medium text-gray-700">
          RPM Limit (Requests Per Minute)
        </label>
        <input
          type="number"
          name="rpm_limit"
          id="rpm_limit"
          value={formData.rpm_limit}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {/* Add fields for other permissions if needed in the future */}
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {rolePermission ? 'Update Role' : 'Create Role'}
        </button>
      </div>
    </form>
  );
}