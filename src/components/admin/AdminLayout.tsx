'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Services', href: '/dashboard/services' },
    { name: 'Users', href: '/dashboard/users' },
    { name: 'Roles', href: '/dashboard/roles' },
    { name: 'Support', href: '/dashboard/support' },
    { name: 'Financial Log', href: '/dashboard/financial-log' },
    { name: 'Site Customization', href: '/dashboard/site-customization' },
    { name: 'Security', href: '/dashboard/security' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul>
            {navLinks.map((link) => (
              <li key={link.name} className="mb-2">
                <Link
                  href={link.href}
                  className={`block py-2 px-4 rounded ${
                    pathname === link.href ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
};

export default AdminLayout;