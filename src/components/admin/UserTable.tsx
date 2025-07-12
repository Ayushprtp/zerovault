'use client';

import { useState } from 'react';
import { UserProfile } from '@/src/lib/database.types';
import { updateUserRole, deleteUser } from '@/src/app/dashboard/users/actions';

interface UserTableProps {
  users: UserProfile[];
}

export default function UserTable({ users }: UserTableProps) {
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleEditClick = (user: UserProfile) => {
    setEditingUser(user);
    setSelectedRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setSelectedRole('');
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const handleSaveRole = async (userId: string) => {
    if (selectedRole && editingUser) {
      await updateUserRole(userId, selectedRole);
      setEditingUser(null);
      setSelectedRole('');
      // You might want to trigger a data refresh here
      // e.g., router.refresh() if used in a page
    }
  };

  const handleDeleteClick = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await deleteUser(userId);
      // You might want to trigger a data refresh here
      // e.g., router.refresh() if used in a page
    }
  };

  return (
    <div className="mt-8 flow-root">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Username
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    ZeroCoins
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {user.username}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.role}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.zero_coins}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button onClick={() => handleEditClick(user)} className="text-indigo-600 hover:text-indigo-900">
                        Edit<span className="sr-only">, {user.username}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { UserProfile } from '@/src/lib/database.types';
import { updateUserRole, deleteUser } from '@/src/app/dashboard/users/actions';

interface UserTableProps {
  users: UserProfile[];
}

export default function UserTable({ users }: UserTableProps) {
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleEditClick = (user: UserProfile) => {
    setEditingUser(user);
    setSelectedRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setSelectedRole('');
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const handleSaveRole = async (userId: string) => {
    if (selectedRole && editingUser) {
      await updateUserRole(userId, selectedRole);
      setEditingUser(null);
      setSelectedRole('');
      // You might want to trigger a data refresh here
      // e.g., router.refresh() if used in a page
    }
  };

  const handleDeleteClick = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await deleteUser(userId);
      // You might want to trigger a data refresh here
      // e.g., router.refresh() if used in a page
    }
  };

  return (
    <div className="mt-8 flow-root">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Username
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    ZeroCoins
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {user.username}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingUser?.id === user.id ? (
                        <select
                          value={selectedRole}
                          onChange={handleRoleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          {/* You'll need to fetch available roles here */}
                          <option value="free">free</option>
                          <option value="basic">basic</option>
                          <option value="pro">pro</option>
                          <option value="elite">elite</option>
                          <option value="dev">dev</option>
                          <option value="admin">admin</option>
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.zero_coins}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      {editingUser?.id === user.id ? (
                        <>
                          <button
                            onClick={() => handleSaveRole(user.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Save<span className="sr-only">, {user.username}</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel<span className="sr-only">, {user.username}</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(user)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit<span className="sr-only">, {user.username}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete<span className="sr-only">, {user.username}</span>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}