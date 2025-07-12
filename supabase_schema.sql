-- ####################################################
-- #      ZeroVault Master Supabase SQL Schema        #
-- ####################################################

-- 1. PROFILES & AUTH TRIGGERS
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'free',
    zero_coins BIGINT NOT NULL DEFAULT 5,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES profiles(id),
    dashboard_layout JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, referral_code)
  VALUES (new.id, new.raw_user_meta_data->>'username', extensions.uuid_generate_v4());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert/update their own profile." ON profiles FOR ALL USING (auth.uid() = id);

-- 2. TEAMS, MEMBERS, & INVITES
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    zero_coin_balance BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_members (
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member',
    spending_limit BIGINT,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (team_id, user_id)
);

CREATE TABLE team_invites (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
    invited_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    inviter_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, invited_user_id)
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team Policies" ON teams FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Team Members Policies" ON team_members FOR ALL USING (EXISTS (SELECT 1 FROM team_members WHERE team_id = team_members.team_id AND user_id = auth.uid()));
CREATE POLICY "Team Invites Policies" ON team_invites FOR ALL USING (invited_user_id = auth.uid() OR EXISTS (SELECT 1 FROM team_members WHERE team_id = team_invites.team_id AND user_id = auth.uid() AND role = 'admin'));

-- 3. SERVICES
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    api_url TEXT,
    cost_per_query INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_beta BOOLESE