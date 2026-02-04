export type Provider = 'spotify' | 'deezer' | 'apple_music' | 'youtube';

export type PlanType = 'free' | 'premium_monthly' | 'premium_annual' | 'lifetime';
export type SubscriptionStatus = 'trialing' | 'active' | 'canceled' | 'past_due' | 'unpaid';

export type SyncMode = 'add_only' | 'mirror';
export type SyncFrequency = 'manual' | 'daily' | 'weekly';
export type SyncStatus = 'pending' | 'running' | 'completed' | 'failed' | 'partial';

export type FeatureType = 'bug' | 'feature' | 'platform_request' | 'other';
export type FeatureStatus = 'new' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'declined';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  preferred_language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  current_period_end: string | null;
  trial_end: string | null;
  cancel_at_period_end: boolean;
}

export interface Connection {
  id: string;
  provider: Provider;
  status: 'connected' | 'error' | 'expired';
  capabilities: {
    can_read: boolean;
    can_write: boolean;
    can_export?: boolean;
    can_sync_inbound?: boolean;
    can_sync_outbound?: boolean;
  };
  last_used_at: string | null;
  created_at: string;
}

export interface Playlist {
  id: string;
  name: string;
  source_platform: Provider;
  destination_platform: Provider;
  sync_mode: SyncMode;
  is_active: boolean;
  last_synced_at: string | null;
  created_at: string;
}

export interface SyncJob {
  id: string;
  status: SyncStatus;
  tracks_total: number;
  tracks_matched: number;
  tracks_unmatched: number;
  started_at: string;
  completed_at: string | null;
}

export interface FeatureRequest {
  id: string;
  type: FeatureType;
  platform: string | null;
  title: string;
  message: string;
  status: FeatureStatus;
  votes_count: number;
  created_at: string;
  user_has_voted?: boolean;
}

export interface Lead {
  email: string;
  source: string;
  wants_apple_full: boolean;
}

export interface PlatformCapability {
  id: Provider;
  name: string;
  icon: string;
  source_oauth: boolean;
  source_public_link: boolean;
  destination_write: boolean;
  modes: ('add_only' | 'mirror' | 'export_only' | 'import_link')[];
  badge: 'full' | 'partial' | 'coming_soon';
  limitations: string;
}
