'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { createReply } from '@/app/dashboard/support/user/actions';

interface ReplyToTicketFormProps {
  ticketId: number;
}

interface ReplyFormInputs {
  message: string;
}

const ReplyToTicketForm: React.FC<ReplyToTicketFormProps> = ({ ticketId }) => {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ReplyFormInputs>();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: ReplyFormInputs) => {
    setStatus('idle');
    setMessage(null);
    const result = await createReply(ticketId, data.message);

    if (result.success) {
      setStatus('success');
      setMessage('Reply added successfully!');
      reset();
      router.refresh(); // Refresh the page to show the new reply
    } else {
      setStatus('error');
      setMessage(`Failed to add reply: ${result.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 p-4 border rounded-md shadow-sm bg-gray-50">
      <h3 className="text-lg font-semibold mb-3">Add a Reply</h3>
      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Your Reply
        </label>
        <textarea
          id="message"
          {...register('message', { required: 'Reply message is required' })}
          rows={4}
          className={`mt-1 block w-full rounded-md border ${errors.message ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
        ></textarea>
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Reply'}
        </button>
      </div>

      {status === 'success' && (
        <p className="mt-3 text-sm text-green-600">{message}</p>
      )}
      {status === 'error' && (
        <p className="mt-3 text-sm text-red-600">{message}</p>
      )}
    </form>
  );
};

export default ReplyToTicketForm;