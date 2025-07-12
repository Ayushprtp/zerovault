// This is a placeholder file. Replace this with the actual code from Phase 11
// of your GEMINI.md document for the UserDashboardLayout component.

import React from 'react';

const UserDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <header>
        {/* Placeholder for User Dashboard Header and Navigation */}
        <nav>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/dashboard/team">Team</a></li>
            <li><a href="/dashboard/support">Support</a></li>
            <li><a href="/dashboard/referrals">Referrals</a></li>
            <li><a href="/dashboard/settings">Settings</a></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default UserDashboardLayout;