'use client';

import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    // Call the Next.js API route to handle sign out
    const { error } = await fetch('/auth/logout', {
      method: 'POST',
    });

    if (error) {
      console.error('Error signing out:', error);
    } else {
      // Redirect to the homepage after successful logout
      router.push('/');
    }
  };

  return (
    <button onClick={handleSignOut} className="py-2 px-4 rounded-md no-underline bg-btn-back text-btn-text">
      Sign Out
    </button>
  );
}