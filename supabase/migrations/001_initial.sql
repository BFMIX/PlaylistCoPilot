-- ==========================================
-- PLAYLIST SYNC - INITIAL MIGRATION (V0)
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PROFILES (extends auth.users)
-- ==========================================
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  preferred_language text DEFAULT 'en',
  timezone text DEFAULT 'UTC',
  lead_source text,
  original_lead_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 2. SUBSCRIPTIONS
-- ==========================================
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  plan_type text CHECK (plan_type IN ('free', 'premium_monthly', 'premium_annual', 'lifetime')),
  status text CHECK (status IN ('trialing', 'active', 'canceled', 'past_due', 'unpaid')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ==========================================
-- 3. CONNECTIONS (OAuth tokens)
-- ==========================================
CREATE TABLE connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  provider text CHECK (provider IN ('spotify', 'deezer', 'apple_music', 'youtube')),
  provider_user_id text,
  access_token text NOT NULL,
  refresh_token text,
  expires_at timestamptz,
  scope text,
  capabilities jsonb DEFAULT '{"can_read": true, "can_write": false, "can_export": false}',
  status text CHECK (status IN ('connected', 'error', 'expired')) DEFAULT 'connected',
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- ==========================================
-- 4. PLAYLISTS
-- ==========================================
CREATE TABLE playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  source_connection_id uuid REFERENCES connections(id),
  source_playlist_id text NOT NULL,
  source_platform text,
  destination_connection_id uuid REFERENCES connections(id),
  destination_playlist_id text,
  destination_platform text,
  sync_mode text CHECK (sync_mode IN ('add_only', 'mirror')) DEFAULT 'add_only',
  is_active boolean DEFAULT true,
  last_synced_at timestamptz,
  next_sync_at timestamptz,
  sync_frequency text CHECK (sync_frequency IN ('manual', 'daily', 'weekly')) DEFAULT 'manual',
  created_at timestamptz DEFAULT now()
);

-- ==========================================
-- 5. SYNC JOBS
-- ==========================================
CREATE TABLE sync_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES playlists(id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending', 'running', 'completed', 'failed', 'partial')),
  source_mode text CHECK (source_mode IN ('oauth_full', 'lite_import', 'export_only')) DEFAULT 'oauth_full',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  tracks_total integer DEFAULT 0,
  tracks_matched integer DEFAULT 0,
  tracks_unmatched integer DEFAULT 0,
  tracks_added integer DEFAULT 0,
  error_message text,
  logs jsonb DEFAULT '[]'
);

-- ==========================================
-- 6. SYNC LOGS (per track)
-- ==========================================
CREATE TABLE sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_job_id uuid REFERENCES sync_jobs(id) ON DELETE CASCADE,
  track_source_id text,
  track_source_title text,
  track_source_artist text,
  status text CHECK (status IN ('matched', 'unmatched', 'error', 'skipped')),
  track_dest_id text,
  track_dest_title text,
  track_dest_artist text,
  confidence_score decimal(5,2),
  error_details text,
  created_at timestamptz DEFAULT now()
);

-- ==========================================
-- 7. USAGE LOGS (quotas)
-- ==========================================
CREATE TABLE usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  action text CHECK (action IN ('sync_manual', 'ai_generate', 'playlist_create')),
  count integer DEFAULT 1,
  date date DEFAULT CURRENT_DATE,
  UNIQUE(user_id, action, date)
);

-- ==========================================
-- 8. LEADS (V0 - Lead capture)
-- ==========================================
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  locale text DEFAULT 'en',
  source text NOT NULL,
  wants_apple_full boolean DEFAULT false,
  wants_lifetime_deal boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  ip_hash text,
  created_at timestamptz DEFAULT now(),
  converted_to_user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  converted_at timestamptz
);

-- ==========================================
-- 9. FEATURE REQUESTS (V0)
-- ==========================================
CREATE TABLE feature_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  email text,
  type text CHECK (type IN ('bug', 'feature', 'platform_request', 'other')) NOT NULL,
  platform text,
  title text NOT NULL,
  message text NOT NULL,
  status text CHECK (status IN ('new', 'under_review', 'planned', 'in_progress', 'completed', 'declined')) DEFAULT 'new',
  votes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ==========================================
-- 10. FEATURE VOTES (V0)
-- ==========================================
CREATE TABLE feature_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_request_id uuid REFERENCES feature_requests(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ip_hash text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(feature_request_id, user_id),
  UNIQUE(feature_request_id, ip_hash)
);

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_connections_user ON connections(user_id);
CREATE INDEX idx_connections_provider ON connections(provider);
CREATE INDEX idx_playlists_user ON playlists(user_id);
CREATE INDEX idx_sync_jobs_playlist ON sync_jobs(playlist_id);
CREATE INDEX idx_sync_logs_job ON sync_logs(sync_job_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_wants_apple ON leads(wants_apple_full) WHERE wants_apple_full = true;
CREATE INDEX idx_feature_requests_status ON feature_requests(status);
CREATE INDEX idx_feature_requests_platform ON feature_requests(platform);

-- ==========================================
-- RLS POLICIES
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_votes ENABLE ROW LEVEL SECURITY;

-- Profiles: users see only their own
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Subscriptions: users see only their own
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- Connections: users manage their own
CREATE POLICY "Users can manage own connections" ON connections
  FOR ALL USING (user_id = auth.uid());

-- Playlists: users manage their own
CREATE POLICY "Users can manage own playlists" ON playlists
  FOR ALL USING (user_id = auth.uid());

-- Sync jobs: users view their own (via playlist)
CREATE POLICY "Users can view own sync jobs" ON sync_jobs
  FOR SELECT USING (
    playlist_id IN (SELECT id FROM playlists WHERE user_id = auth.uid())
  );

-- Sync logs: users view their own
CREATE POLICY "Users can view own sync logs" ON sync_logs
  FOR SELECT USING (
    sync_job_id IN (
      SELECT id FROM sync_jobs WHERE playlist_id IN (
        SELECT id FROM playlists WHERE user_id = auth.uid()
      )
    )
  );

-- Usage logs: users view their own
CREATE POLICY "Users can view own usage" ON usage_logs
  FOR SELECT USING (user_id = auth.uid());

-- Leads: public can insert, only service role can view (or create admin policy)
CREATE POLICY "Anyone can create leads" ON leads
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can view leads" ON leads
  FOR SELECT USING (false); -- Adjust based on your admin setup

-- Feature requests: public read, public insert (with rate limiting in app)
CREATE POLICY "Public can view feature requests" ON feature_requests
  FOR SELECT USING (true);
CREATE POLICY "Public can create feature requests" ON feature_requests
  FOR INSERT WITH CHECK (true);

-- Feature votes: public insert (with rate limiting)
CREATE POLICY "Public can view votes" ON feature_votes
  FOR SELECT USING (true);
CREATE POLICY "Public can vote" ON feature_votes
  FOR INSERT WITH CHECK (true);

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Function to upvote feature (atomic)
CREATE OR REPLACE FUNCTION upvote_feature(feature_id uuid, voter_user_id uuid, voter_ip_hash text)
RETURNS void AS $$
BEGIN
  INSERT INTO feature_votes (feature_request_id, user_id, ip_hash) 
  VALUES (feature_id, voter_user_id, voter_ip_hash);
  
  UPDATE feature_requests 
  SET votes_count = votes_count + 1, updated_at = now()
  WHERE id = feature_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check user quota
CREATE OR REPLACE FUNCTION check_user_quota(p_user_id uuid, p_action text, p_limit integer)
RETURNS boolean AS $$
DECLARE
  current_count integer;
BEGIN
  SELECT COALESCE(SUM(count), 0) INTO current_count
  FROM usage_logs
  WHERE user_id = p_user_id 
    AND action = p_action 
    AND date = CURRENT_DATE;
    
  RETURN current_count < p_limit;
END;
$$ LANGUAGE plpgsql;
