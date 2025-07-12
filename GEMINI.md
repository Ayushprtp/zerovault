Project Master Document: The ZeroVault Platform (Definitive Final Edition)
Project Goal: To build a highly professional, feature-rich, and customizable web platform named ZeroVault. This document serves as the single source of truth for all features, logic, and architectural decisions, ensuring a clear understanding for the development team.
Part 1: The Core Concept & Platform Architecture
1.1. Vision
ZeroVault is an exclusive, community-driven platform that provides powerful data-retrieval services. It operates on a sophisticated internal economy using "ZeroCoins" and a flexible role-based access system. It is designed to be a premium tool for tech professionals, developers, and collaborative teams, with a strong emphasis on user control, community interaction, and platform stability.
1.2. Technology Stack
Frontend & Backend: Next.js
Primary Database & Authentication: Supabase
Secondary Database (for query logs): Cloudflare D1
1.3. Fundamental Architectural Rules (Non-Negotiable)
Unified Dashboard (/dashboard): This is the core application route. The system must first check the logged-in user's role. If the role is admin or dev, it must render the Admin Dashboard. For all other roles, it must render the standard User Dashboard. This is a conditional render on a single page, not a redirect.
Single Session Enforcement: A user account can only be active on one device at a time. A new login must immediately invalidate any previous session for that user.
Priority Session Management: The platform supports a maximum of 50 simultaneous logged-in users. A priority system will automatically log out lower-tiered users to make space for higher-tiered users if the platform is at capacity.
Part 2: The Public-Facing Experience (No Login Required)
These pages serve as the "front door" to the platform, designed to attract, inform, and convert visitors into users.
Homepage (/): The primary marketing page. It must professionally showcase:
A grid of all available Services (with thumbnails and descriptions).
A section highlighting key Features (Teams, API Access, Bounty System).
A dynamic Leaderboard of the "Top 10 Richest Teams."
Shop Page (/shop):
Advertises Membership Tiers and ZeroCoin Packs via appealing cards.
Clicking a card opens a modal with details and a "Contact Support to Buy" button.
This button opens a pre-filled Telegram link to an admin, including the user's details (if logged in) and the desired item.
Public Status Page (/status):
A transparent, real-time status page showing the operational status of every service ("Operational," "Under Maintenance," etc.).
Also displays aggregated usage stats like "Most Popular Services."
Documentation Site (/docs):
A public landing page with general user guides.
The Developer Documentation (API guides, etc.) must be a protected section, only accessible to users with the dev or admin role.
Part 3: The Standard User Experience (For All Logged-In Users)
This section details the features that form the core user journey after logging in.
Customizable Dashboard: The /dashboard is composed of modular "widgets." Every user must be able to drag-and-drop these widgets to create and save their own personalized layout.
Team System ("Small Groups"):
A core collaboration feature. Users can create or join teams (max 5 members).
Teams have three internal roles: Admin (owner), Manager (can invite), and Member.
The Team Admin can set ZeroCoin spending limits for each member from a shared Team Balance.
Feature Request Board:
A community board for suggesting new platform features. Users can upvote/downvote ideas.
Bounty System: Users can pledge their ZeroCoins to features they want, increasing their visibility and priority.
Support Ticket System:
A full helpdesk where users can create support tickets, communicate with admins, and track the status of their requests (Open, Pending, Closed).
Personal Billing History: (New)
A dedicated, user-friendly page in settings titled "Transaction History."
This is a simplified, clean view showing a user's value-related actions: every time a membership was granted, a redeem code was applied, or a bounty was pledged. For Team Admins, they can toggle between their personal and their team's history.
Advanced Query History:
A page showing all of a user's past queries. This page must feature powerful search and filtering tools (by keyword, service, date range) to function as a personal, searchable database.
Referral System:
Each user gets a unique referral link. The referrer earns a ZeroCoin bonus, but only after the referred user signs up and successfully executes their very first query.
Standard Features: All users have access to Dark/Light Mode, real-time in-app notifications, and a personal security log.
Part 4: The Admin Experience (The "God Mode" Dashboard)
This is the central control panel for the entire platform, rendered at /dashboard for users with admin or dev roles.
1. Analytics: The main landing page with graphs for user growth, service popularity, and key platform metrics.
2. User & Team Management: Comprehensive panels to view and manage all users and teams.
3. Dynamic Role Management: A powerful page where admins can:
Create entirely new user roles.
Edit existing roles, defining their RPM (Requests Per Minute) limit.
4. Service & API Management:
Service Panel: Create/edit services, including thumbnail URL and a "Beta" flag to restrict visibility to testers. The "Enable/Disable" toggle here directly controls the public status page.
API Panel: Manage API access and pricing for each service separately.
5. Support Ticket Management: A full helpdesk interface to manage all user support tickets.
6. Financial Audit Log: A detailed, filterable log of every single ZeroCoin transaction on the platform.
7. Platform Customization & Security:
Site Customization (/admin/zerovault): Edit front-end text, social media links, and the admin Telegram username for the shop.
App Settings: Control global variables like bonus amounts.
Action Throttling (/admin/security): (New) A panel where admins can set platform-wide anti-abuse limits. For example: Max Support Tickets per Hour: 5, Max Team Invites per Day: 20.
8. Scheduled Maintenance Mode:
A single, prominent "Enable Maintenance Mode" switch.
When active, the entire platform is locked for non-admins, displaying a friendly "down for maintenance" page.
9. Other Management Tools: Panels for managing the Feature Request Board, creating Redeem Codes, and broadcasting announcements.
Part 5: Final Instructions & Project Deliverables
UI/UX: I will provide image files for design inspiration. The final product must be a clean, modern, and professional application that is visually appealing and easy to navigate.
Code Quality: The code must be clean, well-commented, and written with future scalability in mind.
Crucial Deliverable: Upon project completion, you must provide two separate SQL script files:
supabase_schema.sql: This file must contain all the CREATE TABLE, CREATE POLICY, and other SQL commands necessary to build the entire Supabase database structure from scratch.
d1_schema.sql: This file must contain the CREATE TABLE statements for the Cloudflare D1 database.
This document represents the complete vision for the ZeroVault platform.