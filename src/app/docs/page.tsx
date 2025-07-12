import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

export default async function DocsPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  const userRole = user ? (await supabase.from('profiles').select('role').eq('id', user.id).single()).data?.role : null;

  const canAccessDevDocs = userRole === 'admin' || userRole === 'dev';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ZeroVault Documentation</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">General User Guides</h2>
        <p className="text-gray-700">
          Find guides on how to use the ZeroVault platform, manage your account, understand ZeroCoins, and interact with the community features.
        </p>
        {/* Add links to general user guides here */}
        <ul className="list-disc list-inside mt-2">
          <li>Getting Started</li>
          <li>Understanding ZeroCoins</li>
          <li>Team Management</li>
          <li>Using Support Tickets</li>
        </ul>
      </section>

      {canAccessDevDocs ? (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Developer Documentation</h2>
          <p className="text-gray-700">
            Access API guides, webhook examples, and advanced usage documentation for developers.
          </p>
          {/* Add links to developer documentation here */}
          <ul className="list-disc list-inside mt-2">
            <li>API Reference</li>
            <li>Webhook Integration</li>
            <li>Building with ZeroVault API</li>
          </ul>
        </section>
      ) : (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Developer Documentation</h2>
          <p className="text-red-600">
            You do not have sufficient permissions to access the developer documentation. This section is restricted to users with 'admin' or 'dev' roles.
          </p>
        </section>
      )}
    </div>
  );
}