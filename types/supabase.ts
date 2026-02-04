export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          lead_source: string | null
          original_lead_id: string | null
          preferred_language: string
          timezone: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          lead_source?: string | null
          original_lead_id?: string | null
          preferred_language?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          lead_source?: string | null
          original_lead_id?: string | null
          preferred_language?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_original_lead_id_fkey"
            columns: ["original_lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      connections: {
        Row: {
          access_token: string
          capabilities: Json
          created_at: string
          expires_at: string | null
          id: string
          last_used_at: string | null
          provider: string
          provider_user_id: string | null
          refresh_token: string | null
          scope: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          capabilities?: Json
          created_at?: string
          expires_at?: string | null
          id?: string
          last_used_at?: string | null
          provider: string
          provider_user_id?: string | null
          refresh_token?: string | null
          scope?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          capabilities?: Json
          created_at?: string
          expires_at?: string | null
          id?: string
          last_used_at?: string | null
          provider?: string
          provider_user_id?: string | null
          refresh_token?: string | null
          scope?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      playlists: {
        Row: {
          created_at: string
          destination_connection_id: string
          destination_platform: string
          destination_playlist_id: string | null
          id: string
          is_active: boolean
          last_synced_at: string | null
          name: string
          next_sync_at: string | null
          source_connection_id: string
          source_platform: string
          source_playlist_id: string
          sync_frequency: string | null
          sync_mode: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          destination_connection_id: string
          destination_platform: string
          destination_playlist_id?: string | null
          id?: string
          is_active?: boolean
          last_synced_at?: string | null
          name: string
          next_sync_at?: string | null
          source_connection_id: string
          source_platform: string
          source_playlist_id: string
          sync_frequency?: string | null
          sync_mode?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          destination_connection_id?: string
          destination_platform?: string
          destination_playlist_id?: string | null
          id?: string
          is_active?: boolean
          last_synced_at?: string | null
          name?: string
          next_sync_at?: string | null
          source_connection_id?: string
          source_platform?: string
          source_playlist_id?: string
          sync_frequency?: string | null
          sync_mode?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlists_destination_connection_id_fkey"
            columns: ["destination_connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlists_source_connection_id_fkey"
            columns: ["source_connection_id"]
            isOneToOne: false
            referencedRelation: "connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      sync_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          logs: Json
          playlist_id: string
          source_mode: string | null
          started_at: string
          status: string | null
          tracks_added: number
          tracks_matched: number
          tracks_total: number
          tracks_unmatched: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          logs?: Json
          playlist_id: string
          source_mode?: string | null
          started_at?: string
          status?: string | null
          tracks_added?: number
          tracks_matched?: number
          tracks_total?: number
          tracks_unmatched?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          logs?: Json
          playlist_id?: string
          source_mode?: string | null
          started_at?: string
          status?: string | null
          tracks_added?: number
          tracks_matched?: number
          tracks_total?: number
          tracks_unmatched?: number
        }
        Relationships: [
          {
            foreignKeyName: "sync_jobs_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          }
        ]
      }
      sync_logs: {
        Row: {
          confidence_score: number | null
          created_at: string
          error_details: string | null
          id: string
          status: string | null
          sync_job_id: string
          track_dest_artist: string | null
          track_dest_id: string | null
          track_dest_title: string | null
          track_source_artist: string | null
          track_source_id: string | null
          track_source_title: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          error_details?: string | null
          id?: string
          status?: string | null
          sync_job_id: string
          track_dest_artist?: string | null
          track_dest_id?: string | null
          track_dest_title?: string | null
          track_source_artist?: string | null
          track_source_id?: string | null
          track_source_title?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          error_details?: string | null
          id?: string
          status?: string | null
          sync_job_id?: string
          track_dest_artist?: string | null
          track_dest_id?: string | null
          track_dest_title?: string | null
          track_source_artist?: string | null
          track_source_id?: string | null
          track_source_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_sync_job_id_fkey"
            columns: ["sync_job_id"]
            isOneToOne: false
            referencedRelation: "sync_jobs"
            referencedColumns: ["id"]
          }
        ]
      }
      usage_logs: {
        Row: {
          action: string
          count: number
          created_at: string
          date: string
          id: string
          user_id: string
        }
        Insert: {
          action: string
          count?: number
          created_at?: string
          date?: string
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          count?: number
          created_at?: string
          date?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      leads: {
        Row: {
          converted_at: string | null
          converted_to_user_id: string | null
          created_at: string
          email: string
          id: string
          ip_hash: string | null
          locale: string
          metadata: Json
          source: string
          wants_apple_full: boolean
          wants_lifetime_deal: boolean
        }
        Insert: {
          converted_at?: string | null
          converted_to_user_id?: string | null
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
          locale?: string
          metadata?: Json
          source: string
          wants_apple_full?: boolean
          wants_lifetime_deal?: boolean
        }
        Update: {
          converted_at?: string | null
          converted_to_user_id?: string | null
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
          locale?: string
          metadata?: Json
          source?: string
          wants_apple_full?: boolean
          wants_lifetime_deal?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "leads_converted_to_user_id_fkey"
            columns: ["converted_to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      feature_requests: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
          platform: string | null
          status: string
          title: string
          type: string
          updated_at: string
          user_id: string | null
          votes_count: number
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
          platform?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
          user_id?: string | null
          votes_count?: number
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          platform?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
          votes_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "feature_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      feature_votes: {
        Row: {
          created_at: string
          feature_request_id: string
          id: string
          ip_hash: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feature_request_id: string
          id?: string
          ip_hash?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feature_request_id?: string
          id?: string
          ip_hash?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_votes_feature_request_id_fkey"
            columns: ["feature_request_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      upvote_feature: {
        Args: {
          feature_id: string
          voter_ip_hash: string
          voter_user_id: string
        }
        Returns: undefined
      }
      check_user_quota: {
        Args: {
          p_action: string
          p_limit: number
          p_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
