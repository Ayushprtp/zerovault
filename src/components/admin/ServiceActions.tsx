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