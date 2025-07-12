'use client';

import { useState } from 'react';
import { createFeatureRequest } from '@/src/app/dashboard/feature-requests/actions';

export default function FeatureRequestForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const result = await createFeatureRequest({ title, description });

    if (result.success) {
      setMessage('Feature request submitted successfully!');
      setTitle('');
      setDescription('');
      // Optionally refresh the list of feature requests
      // router.refresh();
    } else {
      setMessage(`Failed to submit feature request: ${result.error}`);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Submit a New Feature Idea</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={isSubmitting}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={isSubmitting}
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Idea'}
          </button>
        </div>
        {message && (
          <p className={`text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { createFeatureRequest } from '@/src/app/dashboard/feature-requests/actions';

export default function FeatureRequestForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const result = await createFeatureRequest({ title, description });

    if (result.success) {
      setMessage('Feature request submitted successfully!');
      setTitle('');
      setDescription('');
      // Optionally refresh the list of feature requests
      // router.refresh();
    } else {
      setMessage(`Failed to submit feature request: ${result.error}`);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Submit a New Feature Idea</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={isSubmitting}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled={isSubmitting}
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Idea'}
          </button>
        </div>
        {message && (
          <p className={`text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}