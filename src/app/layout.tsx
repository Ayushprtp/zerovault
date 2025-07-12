import './globals.css';
import SupabaseProvider from '@/lib/SupabaseProvider';

export const metadata = {
  title: 'ZeroVault',
  description: 'Exclusive data retrieval platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}