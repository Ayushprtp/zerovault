'use client';

import { deleteService, toggleServiceActive, toggleServiceBeta } from '@/src/app/dashboard/services/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ServiceActionsProps {
  serviceId: string;
  isActive: boolean;
  isBeta: boolean;
}

export default function ServiceActions({ serviceId, isActive, isBeta }: ServiceActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this service?')) {
      setLoading(true);
      await deleteService(serviceId);
      router.refresh();
      setLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <button onClick={() => toggleServiceActive(serviceId, !isActive)} disabled={loading} className={`text-sm px-3 py-1 rounded ${isActive ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>{isActive ? 'Disable' : 'Enable'}</button>
      <button onClick={() => toggleServiceBeta(serviceId, !isBeta)} disabled={loading} className={`text-sm px-3 py-1 rounded ${isBeta ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>{isBeta ? 'Toggle Beta' : 'Toggle Beta'}</button>
      <button onClick={handleDelete} disabled={loading} className="text-red-600 hover:text-red-900 text-sm px-3 py-1 rounded border border-red-600">Delete</button>
    </div>
  );
}
'use client';

import { deleteService } from '@/src/app/dashboard/services/actions';
import { useRouter } from 'next/navigation';

interface ServiceActionsProps {
  serviceId: string;
}

export default function ServiceActions({ serviceId }: ServiceActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this service?')) {
      await deleteService(serviceId);
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900 text-sm"
    >
      Delete
    </button>
  );
}