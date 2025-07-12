'use client';

import { useState } from 'react';

interface ServiceOutputProps {
  output: string | object | null;
}

export default function ServiceOutput({ output }: ServiceOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (output) {
      const outputText = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
      navigator.clipboard.copy(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }
  };

  if (!output) {
    return null;
  }

  const displayOutput = typeof output === 'string' ? output : JSON.stringify(output, null, 2);

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md relative">
      <h3 className="text-lg font-medium mb-2">Output:</h3>
      <pre className="whitespace-pre-wrap break-all text-sm text-gray-800">{displayOutput}</pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}