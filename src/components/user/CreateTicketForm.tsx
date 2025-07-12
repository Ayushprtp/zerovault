'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createSupportTicket } from '@/app/dashboard/support/user/actions'; // Assuming this action exists

type FormData = {
  subject: string;
  message: string;
};

export default function CreateTicketForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setStatus(null);
    try {
      const result = await createSupportTicket(data.subject, data.message);
      if (result.success) {
        setStatus({ type: 'success', message: 'Ticket created successfully!' });
        reset();
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to create ticket.' });
      }
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Support Ticket</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            id="subject"
            type="text"
            {...register('subject', { required: 'Subject is required' })}
            className={`mt-1 block w-full rounded-md border ${errors.subject ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          />
          {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            rows={4}
            {...register('message', { required: 'Message is required' })}
            className={`mt-1 block w-full rounded-md border ${errors.message ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
          ></textarea>
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : 'Create Ticket'}
        </button>
      </form>

      {status && (
        <div className={`mt-4 p-3 rounded-md ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}