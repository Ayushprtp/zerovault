Project Master Document & Detailed Functional Specification: The ZeroVault Platform
Document Purpose: This document is the single, authoritative source of truth for the ZeroVault platform. It is designed to provide the development team with a complete and granular understanding of every feature, its underlying logic, and its acceptance criteria.
Part 1: The Core Vision & Technology
1.1. Vision
ZeroVault is an exclusive, community-driven platform providing powerful data-retrieval services. It operates on a sophisticated internal economy using "ZeroCoins" and a flexible role-based access system. It is designed as a premium tool for tech professionals, with a strong emphasis on user control, community interaction, and platform stability.
1.2. Technology Stack
Frontend & Backend: Next.js
Primary Database & Authentication: Supabase
Secondary Database (for query logs): Cloudflare D1
Part 2: Foundational Architecture & Rules (Platform-Wide Logic)
This section outlines the non-negotiable architectural principles that govern the entire platform.
2.1. Unified Dashboard (/dashboard)
User Story: "As a user, I want a single, consistent URL for my dashboard, regardless of my permission level, to provide a clean and professional experience."
Functional Requirements: The main application lives at the /dashboard URL. The system must check the logged-in user's role and conditionally render the appropriate interface.
Technical Implementation Notes: The main Next.js page component at /dashboard should fetch the user's session and role. An if statement (if (user.role === 'admin' || user.role === 'dev')) will determine whether to render the <AdminDashboard /> or <UserDashboard /> component. Sub-navigation (e.g., to /admin/users) will be handled by a client-side router (like Next.js Router) within the main rendered component.
2.2. Single Session Enforcement
User Story: "As the platform owner, I want to prevent account sharing and enhance security by ensuring a user can only be logged in on one device at a time."
Functional Requirements: A new login from any device must immediately invalidate any other active session for that same user.
Technical Implementation Notes:
Add an active_session_id (type: text) column to the profiles table in Supabase.
On Login: The backend generates a unique UUID. This UUID is saved to the user's active_session_id in the database and is also sent to the client to be stored in localStorage.
On Every API Request: A backend middleware must check if the active_session_id sent from the client matches the one in the database. If they don't match, the server must return a 401 Unauthorized error, which the frontend must be programmed to catch and immediately trigger a full logout.
2.3. Priority Session Management
User Story: "As a paying/high-tier user, if the platform is full, I expect to be able to log in, with the system making space for me by logging out a lower-tier user."
Functional Requirements: The platform supports a maximum of 50 concurrent users. A priority system will manage access when full.
Hierarchy: admin/dev > elite > pro > basic > free.
Technical Implementation Notes: This should be implemented as a Supabase Edge Function triggered on login attempts.
The function checks the active session count. If < 50, login proceeds.
If = 50, it gets the role of the incoming user. It then queries for an active user with the lowest possible role that is subordinate to the incoming user's role.
If a target is found, the function uses the Supabase Admin SDK (supabase.auth.admin.signOut(userId)) to forcefully terminate their session.
Only after a slot is freed does the new login complete.
If a free user attempts to log in when the server is full, they are shown a message: "All slots are currently full. Please try again later."
Part 3: The Public-Facing Portal (The "Storefront")
3.1. Homepage (/)
Purpose: To serve as the primary marketing page to attract, inform, and convert new users.
Functional Requirements:
Services Grid: Must fetch and display all services where is_enabled is true. Each card shows the service's thumbnail, name, and description.
Features Section: Highlights key platform features like "Team Accounts," "API Access," and the "Bounty System."
Leaderboard: Dynamically displays the "Top 10 Richest Teams," ranked by their team_zerocoin_balance. This data should be cached to optimize performance.
3.2. Shop Page (/shop)
Purpose: A manual sales funnel to sell memberships and coin packs without a payment gateway.
Functional Requirements:
Displays cards for Membership Tiers and ZeroCoin Packs.
Clicking a card opens a modal with benefits and a "Contact Support to Buy" button.
This button opens https://t.me/{admin_username}?text={message}. The admin_username is configured in the admin panel. The message must be dynamically generated and URL-encoded.
Example Message: "Hello, I am interested in the Elite Membership. My username is Sultan99, current role is basic, and I have 150 ZeroCoins."
3.3. Public Status Page (/status)
Purpose: To build user trust through transparency about platform health.
Functional Requirements: Shows the real-time operational status of every service ("Operational," "Under Maintenance"), controlled directly by the admin panel.
3.4. Documentation Site (/docs)
Purpose: The central knowledge base for all users.
Functional Requirements:
A public landing page with general user guides.
The Developer Documentation section (API guides, webhook examples) must be protected. The page logic must check the user's role; if the role is not dev or admin, access is denied.
Part 4: The Standard User Portal (The Core Application)
4.1. The Main Dashboard (/dashboard)
Purpose: The user's primary workspace and navigation center.
Functional Requirements:
Service Slider (Top of Page): A horizontally scrolling carousel of cards. This is the primary navigation to the tools. Each card shows a service's thumbnail, name, and cost. Clicking a card navigates to /dashboard/{service_name}.
Customizable Widget Area: A grid area below the slider.
Functionality: Every user must be able to drag-and-drop these widgets. The layout configuration (an array of widget IDs, e.g., ['queries', 'team_activity']) must be saved in a JSONB column in the user's profile and persist across sessions.
Available Widgets: "My Recent Queries," "My Team's Activity," "Feature Request Board Summary," "Codex AI (Coming Soon)."
4.2. Detailed User Features
Service Page (e.g., /dashboard/vehicle):
Purpose: The dedicated interface for using a specific tool.
Functional Requirements:
Contains an input field, a submit button, and an output area with a "Copy" button.
Below, a table shows the user's search history for that specific service.
Crucial Logic: Before submitting, if the user is in a team, a modal or dropdown must appear asking them to select their funding source: "Personal Balance" or "Team Balance."
Team System:
Purpose: To enable collaboration and shared resource management.
Functional Requirements:
Any user not in a team can create one, becoming its Admin.
Teams have a shared ZeroCoin balance and three roles: Admin (owner), Manager (can invite), and Member.
The Team Admin's dashboard must have an interface to set monthly spending limits for each member.
Invite Flow: Inviting a user creates a pending invite in the database and sends a real-time notification to the invitee, who can accept or reject it.
Feature Request Board & Bounty System:
Purpose: To leverage the community for product development and to accurately gauge demand.
Functional Requirements:
A public board for users to post and vote on feature ideas.
The Bounty System allows users to pledge ZeroCoins. When pledged, the coins are immediately deducted and moved to an "escrow" table in the database, ensuring they cannot be spent elsewhere.
Support Ticket System:
Purpose: A professional and organized channel for user support.
Functional Requirements: Users can create tickets, view their ticket history and status (Open, Pending, Closed), and communicate with admins within a ticket thread.
Personal Billing History:
Purpose: A user-friendly, read-only view of value-based transactions to build trust.
Functional Requirements: This page will query multiple tables to build a simplified history, showing entries like "Redeemed 'PROMO123' for 100 Coins" or "Pledged 50 Coins to Feature X."
Advanced Query History:
Purpose: To turn a user's activity log into a powerful, searchable personal database.
Functional Requirements: This page must feature powerful search and filtering tools (by keyword, service, date range).
Referral System:
Purpose: To incentivize organic user growth.
Functional Requirements: Each user gets a unique referral link. A backend database trigger on the query_history table will check if it's a user's first query and if they were referred. If so, it will automatically award the bonus to the referrer.
Part 5: The Admin Control Panel (The "God Mode" Dashboard)
This is the comprehensive management suite for admin and dev roles.
1. Analytics: Graphs for user growth, service popularity, etc.
2. User Management: View all users. Clicking a user opens a detailed view: left side shows editable profile info (role, coins), right side shows their complete, raw search history.
3. Dynamic Role Management: A page where admins can create, edit, and delete user roles, defining their permissions and RPM (Requests Per Minute) limits.
4. Service Management: Create/edit services, including their Thumbnail URL, API Endpoint, and cost. Contains the "Enable/Disable" toggle (controls the public status page) and a "Beta" flag (restricts visibility to testers).
5. API Management: A dedicated panel to manage the API version of each service.
6. Redeem Code Management: A comprehensive system to:
Create single or bulk codes with specific ZeroCoin amounts and role assignments.
Include options for "Keep Existing Role" and a special "Group" role.
Create time-limited memberships that automatically expire via a daily cron job.
View a detailed log table of every code created and its status.
7. Support Ticket Management: A full helpdesk interface to manage all user support tickets.
8. Financial Audit Log: A detailed, filterable log of every single ZeroCoin transaction, designed for analysis and fraud detection. Every backend function that moves coins MUST write to this log.
9. "Gift All Users" Tool: A utility to send a specified amount of ZeroCoins to all users.
10. Platform Customization & Security:
Site Customization: Edit front-end text, social media links, admin Telegram username.
App Settings: Control global variables like bonus amounts.
Action Throttling: A panel to set anti-abuse limits (e.g., "Max Support Tickets per Hour: 5"). This will be enforced by backend middleware.
11. Scheduled Maintenance Mode: A prominent switch that locks the entire platform for non-admins and displays a "down for maintenance" page. This will be implemented as a top-level middleware that checks a single boolean in the database.
Part 6: External Service & API Integration
Saving Query Results (Cloudflare D1): After a query, the backend must save a record to D1 containing: user_id, service_used, query, response (JSON), zerocoins_spent, timestamp.
External API Call Logic: The backend will construct API URLs like https://.../search?key=...&mobile={USER_QUERY}. The key must be a secure environment variable.
Part 7: Final Instructions & Project Deliverables
UI/UX: I will provide image files for design inspiration. The final product must be a clean, modern, and professional application.
Code Quality: The code must be clean, well-commented, and scalable.
Crucial Deliverable: Upon project completion, provide two separate SQL script files:
supabase_schema.sql: Contains all commands (CREATE TABLE, CREATE POLICY, etc.) to build the Supabase database from scratch.
d1_schema.sql: Contains the CREATE TABLE statements for the Cloudflare D1 database.



Of course. This is a fantastic idea. To get the best results from a code agent like Gemini, you need to provide a prompt that is less like a conversation and more like a formal Software Requirements Specification (SRS) document. It needs to be precise, structured, and contain all the technical details, code, and logic in one place.

Based on our entire development journey, I have synthesized everything into a single, comprehensive prompt. This "master prompt" is designed to be fed directly to a code generation AI. It explains the project's architecture, defines the complete database schema, and then provides the exact file-by-file content for the entire application.

Prompt for Gemini Code Agent: Build the ZeroVault Platform

Objective: Your task is to generate the complete file structure and content for a full-stack web application named "ZeroVault" based on the detailed specifications below. The application uses Next.js with the App Router, TypeScript, and Tailwind CSS. The primary database and authentication are handled by Supabase, with a secondary D1 database for specific logging.

Follow the instructions step-by-step. The database schema is the absolute source of truth and must be established first. Then, generate the project structure and file contents as specified.

Part 1: The Database Schema (The Foundation)

Before any application code is generated, the following database schemas must be defined.

1.1. Supabase Master Schema

This SQL script should be executed in the Supabase SQL Editor. It creates all tables, roles, policies, and transactional database functions.

Generated sql
-- ####################################################
-- #      ZeroVault Master Supabase SQL Schema        #
-- ####################################################

-- 1. PROFILES & AUTH TRIGGERS
CREATE TABLE profiles ( id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY, username TEXT UNIQUE NOT NULL, first_name TEXT, last_name TEXT, avatar_url TEXT, role TEXT NOT NULL DEFAULT 'free', zero_coins BIGINT NOT NULL DEFAULT 5, referral_code TEXT UNIQUE, referred_by UUID REFERENCES profiles(id), active_session_id TEXT, dashboard_layout JSONB, created_at TIMESTAMPTZ DEFAULT NOW(), CONSTRAINT username_length CHECK (char_length(username) >= 3) );
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN INSERT INTO public.profiles (id, username, referral_code) VALUES (new.id, new.raw_user_meta_data->>'username', extensions.uuid_generate_v4()); RETURN new; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert/update their own profile." ON profiles FOR ALL USING (auth.uid() = id);

-- 2. TEAMS, MEMBERS, & INVITES
CREATE TABLE teams (id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), name TEXT NOT NULL, owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL, zero_coin_balance BIGINT NOT NULL DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE team_members (team_id UUID REFERENCES teams(id) ON DELETE CASCADE, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, role TEXT NOT NULL DEFAULT 'member', spending_limit BIGINT, joined_at TIMESTAMPTZ DEFAULT NOW(), PRIMARY KEY (team_id, user_id));
CREATE TABLE team_invites (id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL, invited_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, inviter_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(team_id, invited_user_id));
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team Policies" ON teams FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Team Members Policies" ON team_members FOR ALL USING (EXISTS (SELECT 1 FROM team_members WHERE team_id = team_members.team_id AND user_id = auth.uid()));
CREATE POLICY "Team Invites Policies" ON team_invites FOR ALL USING (invited_user_id = auth.uid() OR EXISTS (SELECT 1 FROM team_members WHERE team_id = team_invites.team_id AND user_id = auth.uid() AND role = 'admin'));

-- 3. SERVICES
CREATE TABLE services (id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), name TEXT NOT NULL, description TEXT, thumbnail_url TEXT, api_url TEXT, cost_per_query INT NOT NULL DEFAULT 1, is_active BOOLEAN NOT NULL DEFAULT TRUE, is_beta BOOLEAN NOT NULL DEFAULT FALSE, api_cost INT, is_api_active BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services Policies" ON services FOR ALL USING (true) WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'dev'));

-- 4. SUPPORT TICKETS & REPLIES
CREATE TABLE support_tickets (id SERIAL PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, subject TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE ticket_replies (id SERIAL PRIMARY KEY, ticket_id INT REFERENCES support_tickets(id) ON DELETE CASCADE, user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, message TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Support Tickets Policies" ON support_tickets FOR ALL USING (user_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'dev'));
CREATE POLICY "Ticket Replies Policies" ON ticket_replies FOR ALL USING (user_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'dev'));

-- 5. TRANSACTION LOG
CREATE TABLE transaction_log (id BIGSERIAL PRIMARY KEY, user_id UUID REFERENCES profiles(id), team_id UUID REFERENCES teams(id), type TEXT NOT NULL, description TEXT, amount BIGINT, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE transaction_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Transaction Log Policies" ON transaction_log FOR ALL USING (user_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- 6. FEATURE REQUESTS & VOTES
CREATE TABLE feature_requests (id SERIAL PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, title TEXT NOT NULL, description TEXT, status TEXT NOT NULL DEFAULT 'open', total_bounty BIGINT NOT NULL DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE feature_votes (request_id INT REFERENCES feature_requests(id) ON DELETE CASCADE, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, vote_type INT NOT NULL, PRIMARY KEY (request_id, user_id));
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Feature Policies" ON feature_requests FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (user_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Vote Policies" ON feature_votes FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (user_id = auth.uid());

-- 7. SITE SETTINGS & ROLE PERMISSIONS
CREATE TABLE site_settings (key TEXT PRIMARY KEY NOT NULL, value TEXT, updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE role_permissions (role TEXT PRIMARY KEY NOT NULL, rpm_limit INT NOT NULL DEFAULT 10, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings public read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Permissions public read" ON role_permissions FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings/permissions." ON site_settings FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can manage settings/permissions." ON role_permissions FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
INSERT INTO role_permissions (role, rpm_limit) VALUES ('free', 5), ('basic', 15), ('pro', 30), ('elite', 60), ('dev', 100), ('admin', 9999);

-- 8. DATABASE FUNCTIONS (TRANSACTIONS & RPCs)
CREATE OR REPLACE FUNCTION accept_team_invite(invite_id UUID, p_user_id UUID) RETURNS VOID AS $$ DECLARE v_team_id UUID; v_invited_user_id UUID; BEGIN SELECT team_id, invited_user_id INTO v_team_id, v_invited_user_id FROM public.team_invites WHERE id = invite_id AND status = 'pending' FOR UPDATE; IF v_team_id IS NULL OR v_invited_user_id <> p_user_id THEN RAISE EXCEPTION 'Invalid invite or not authorized.'; END IF; UPDATE public.team_invites SET status = 'accepted' WHERE id = invite_id; INSERT INTO public.team_members (team_id, user_id, role) VALUES (v_team_id, p_user_id, 'member'); EXCEPTION WHEN OTHERS THEN RAISE; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION pledge_bounty_to_feature(p_request_id INT, p_user_id UUID, p_amount BIGINT) RETURNS VOID AS $$ DECLARE user_balance BIGINT; BEGIN SELECT zero_coins INTO user_balance FROM public.profiles WHERE id = p_user_id FOR UPDATE; IF user_balance < p_amount THEN RAISE EXCEPTION 'Insufficient ZeroCoin balance.'; END IF; UPDATE public.profiles SET zero_coins = zero_coins - p_amount WHERE id = p_user_id; UPDATE public.feature_requests SET total_bounty = total_bounty + p_amount WHERE id = p_request_id; INSERT INTO public.transaction_log(user_id, type, description, amount) VALUES (p_user_id, 'BOUNTY_PLEDGE', 'Pledged bounty to feature request #' || p_request_id, p_amount); END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION award_referral_bonus(p_user_id UUID) RETURNS VOID AS $$ DECLARE v_referrer_id UUID; v_has_queried BOOLEAN; referral_bonus_amount INT; BEGIN SELECT EXISTS (SELECT 1 FROM transaction_log WHERE type = 'REFERRAL_AWARD' AND description LIKE '%' || p_user_id::text) INTO v_has_queried; IF v_has_queried THEN RETURN; END IF; SELECT referred_by INTO v_referrer_id FROM public.profiles WHERE id = p_user_id; IF v_referrer_id IS NOT NULL THEN referral_bonus_amount := 2; UPDATE public.profiles SET zero_coins = zero_coins + referral_bonus_amount WHERE id = v_referrer_id; INSERT INTO public.transaction_log(user_id, type, description, amount) VALUES (v_referrer_id, 'REFERRAL_BONUS', 'Bonus for referring user ' || p_user_id, referral_bonus_amount); INSERT INTO public.transaction_log(user_id, type, description, amount) VALUES (p_user_id, 'REFERRAL_AWARD', 'Referral signup bonus awarded to referrer ' || v_referrer_id, 0); END IF; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION get_feature_requests_with_votes(p_user_id UUID) RETURNS TABLE (id INT, title TEXT, description TEXT, status TEXT, total_bounty BIGINT, created_at TIMESTAMPTZ, username TEXT, vote_total BIGINT, user_vote INT) AS $$ BEGIN RETURN QUERY SELECT fr.id, fr.title, fr.description, fr.status, fr.total_bounty, fr.created_at, p.username, (SELECT COALESCE(SUM(fv.vote_type), 0) FROM feature_votes fv WHERE fv.request_id = fr.id) AS vote_total, (SELECT fv.vote_type FROM feature_votes fv WHERE fv.request_id = fr.id AND fv.user_id = p_user_id) AS user_vote FROM feature_requests fr LEFT JOIN profiles p ON fr.user_id = p.id ORDER BY vote_total DESC, fr.created_at DESC; END; $$ LANGUAGE plpgsql;

1.2. Cloudflare D1 Master Schema

This SQL script should be executed in the Cloudflare D1 console.

Generated sql
DROP TABLE IF EXISTS query_log;
CREATE TABLE query_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  query_input TEXT,
  query_response TEXT,
  coins_spent INTEGER NOT NULL,
  is_team_query BOOLEAN DEFAULT FALSE,
  team_id TEXT,
  timestamp TEXT NOT NULL
);
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
SQL
IGNORE_WHEN_COPYING_END
Part 2: Project Setup & Core Configuration

Initialize Project: Use npx create-next-app@latest zerovault with the following options: TypeScript, ESLint, Tailwind CSS, App Router. Do not use the src/ directory.

Install Dependencies: Run npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-ui-react @supabase/auth-ui-shared.

Environment Variables (.env.local): Create this file and populate it with Supabase credentials.

Generated text
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Text
IGNORE_WHEN_COPYING_END

Generate DB Types: Run npx supabase login then npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts.

Part 3: File-by-File Code Generation

Generate the following files with the specified content at the given paths.

3.1. Core Middleware & Layouts

File: middleware.ts (Project Root)

Purpose: Enforces platform-wide rules like Maintenance Mode before rendering any page.

Content: (Use the complete code from Phase 14)

File: app/layout.tsx

Purpose: The root layout for the entire application. Wraps everything in the SupabaseProvider.

Content: (Use the complete code from Phase 4)

File: lib/SupabaseProvider.tsx

Purpose: Manages the user's session state throughout the application.

Content: (Use the complete code from Phase 4)

File: components/admin/AdminLayout.tsx

Purpose: Provides the consistent sidebar navigation for the entire admin panel.

Content: (Use the complete code from Phase 12, ensuring all admin links are present: Services, Users, Roles, Support, Financial Log, Site Customization, Security)

File: components/UserDashboardLayout.tsx

Purpose: Provides consistent header navigation for the standard user dashboard.

Content: (Use the complete code from Phase 11, ensuring all user links are present: Dashboard, Team, Support, Referrals, Settings)

3.2. Authentication Flow (/app/auth, /app/login)

File: app/auth/callback/route.ts -> Handles the OAuth callback from Supabase.

File: app/auth/logout/route.ts -> Handles user logout.

File: app/login/page.tsx -> Renders the login form using Auth from @supabase/auth-ui-react.

(Use the code for these files from Phases 3 and 4)

3.3. Public Pages (/app, /app/shop, etc.)

File: app/page.tsx -> The main public-facing homepage. (Code from Phase 14)

File: app/shop/page.tsx -> The public shop page. (Code from Phase 13)

File: components/ShopCard.tsx -> Component for the shop page. (Code from Phase 13)

File: app/maintenance/page.tsx -> The maintenance mode page. (Code from Phase 14)

File: app/docs/page.tsx -> The documentation site with role-based access. (Code from Phase 23)

3.4. The Main Dashboard (/app/dashboard)

File: app/dashboard/page.tsx -> The primary conditional rendering logic. It fetches the user's profile and decides whether to render AdminDashboard or UserDashboard. (Code from Phase 5, updated to pass the full profile object).

File: components/AdminDashboard.tsx -> The entry point for the admin view, wrapped in AdminLayout. (Code from Phase 6)

File: components/UserDashboard.tsx -> The entry point for the user view, wrapped in UserDashboardLayout. This component should contain the logic for the customizable "Draggable Widgets." (Code from Phase 24)

3.5. Admin Panel Pages (/app/dashboard/...)

For each admin feature (Services, Users, Roles, Support-Admin, Financial-Log, Zerovault-Settings, Security), generate the corresponding /page.tsx, /actions.ts, and component files as detailed in our conversation.

Example for Services:

/app/dashboard/services/page.tsx (Phase 8)

/app/dashboard/services/actions.ts (Phase 7 & 8)

/components/admin/ServiceForm.tsx (Phase 7)

/components/admin/ServiceActions.tsx (Phase 8)

(Follow this pattern for all other admin features we built.)

3.6. User Dashboard Pages (/app/dashboard/...)

For each user feature (Team, Support, Feature-Requests, Referrals, Settings), generate the corresponding /page.tsx, /actions.ts, and component files.

Example for Teams:

/app/dashboard/team/page.tsx (Phase 17)

/app/dashboard/team/actions.ts (Phase 15, 16, 17)

/components/team/CreateTeamForm.tsx (Phase 15)

/components/team/TeamDashboard.tsx (Phase 16)

/components/team/InviteMemberForm.tsx (Phase 16)

/components/team/MemberActions.tsx (Phase 16)

/components/team/PendingInvites.tsx (Phase 17)

/components/team/InviteResponseButtons.tsx (Phase 17)

/components/team/ManageMember.tsx (Phase 21)

(Follow this pattern for all other user features we built.)

Final Instruction

Generate the complete project based on this master plan. The structure is logical, starting from the database and core configuration, then building out each feature's pages, components, and server actions. The provided code snippets from our conversation are the source of truth for each file's content. Begin by confirming the project setup, then proceed to generate each file in a logical order.




i have already opened folder which i want to make my app