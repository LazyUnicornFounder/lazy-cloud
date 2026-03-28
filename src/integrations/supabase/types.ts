export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_name: string
          id: string
          page: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_name: string
          id?: string
          page?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_name?: string
          id?: string
          page?: string | null
        }
        Relationships: []
      }
      app_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      blog_errors: {
        Row: {
          created_at: string
          error_message: string
          id: string
        }
        Insert: {
          created_at?: string
          error_message: string
          id?: string
        }
        Update: {
          created_at?: string
          error_message?: string
          id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string[]
          created_at: string
          excerpt: string
          id: string
          published_at: string | null
          read_time: string
          slug: string
          status: string
          thumbnail: string | null
          title: string
        }
        Insert: {
          content?: string[]
          created_at?: string
          excerpt: string
          id?: string
          published_at?: string | null
          read_time?: string
          slug: string
          status?: string
          thumbnail?: string | null
          title: string
        }
        Update: {
          content?: string[]
          created_at?: string
          excerpt?: string
          id?: string
          published_at?: string | null
          read_time?: string
          slug?: string
          status?: string
          thumbnail?: string | null
          title?: string
        }
        Relationships: []
      }
      blog_settings: {
        Row: {
          created_at: string
          frequency_minutes: number
          id: string
          is_publishing: boolean
          posts_per_day: number
        }
        Insert: {
          created_at?: string
          frequency_minutes?: number
          id?: string
          is_publishing?: boolean
          posts_per_day?: number
        }
        Update: {
          created_at?: string
          frequency_minutes?: number
          id?: string
          is_publishing?: boolean
          posts_per_day?: number
        }
        Relationships: []
      }
      early_access: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      geo_citations: {
        Row: {
          brand_mentioned: boolean
          confidence: string | null
          id: string
          query: string
          reason: string | null
          tested_at: string
        }
        Insert: {
          brand_mentioned?: boolean
          confidence?: string | null
          id?: string
          query: string
          reason?: string | null
          tested_at?: string
        }
        Update: {
          brand_mentioned?: boolean
          confidence?: string | null
          id?: string
          query?: string
          reason?: string | null
          tested_at?: string
        }
        Relationships: []
      }
      geo_errors: {
        Row: {
          created_at: string
          error_message: string
          id: string
        }
        Insert: {
          created_at?: string
          error_message: string
          id?: string
        }
        Update: {
          created_at?: string
          error_message?: string
          id?: string
        }
        Relationships: []
      }
      geo_posts: {
        Row: {
          body: string
          excerpt: string | null
          id: string
          published_at: string
          slug: string
          status: string
          target_query: string | null
          title: string
        }
        Insert: {
          body: string
          excerpt?: string | null
          id?: string
          published_at?: string
          slug: string
          status?: string
          target_query?: string | null
          title: string
        }
        Update: {
          body?: string
          excerpt?: string | null
          id?: string
          published_at?: string
          slug?: string
          status?: string
          target_query?: string | null
          title?: string
        }
        Relationships: []
      }
      geo_queries: {
        Row: {
          brand_cited: boolean
          created_at: string
          has_content: boolean
          id: string
          last_tested: string | null
          priority: number
          product: string | null
          query: string
          query_type: string | null
        }
        Insert: {
          brand_cited?: boolean
          created_at?: string
          has_content?: boolean
          id?: string
          last_tested?: string | null
          priority?: number
          product?: string | null
          query: string
          query_type?: string | null
        }
        Update: {
          brand_cited?: boolean
          created_at?: string
          has_content?: boolean
          id?: string
          last_tested?: string | null
          priority?: number
          product?: string | null
          query?: string
          query_type?: string | null
        }
        Relationships: []
      }
      geo_settings: {
        Row: {
          brand_name: string
          business_description: string
          competitors: string
          created_at: string
          id: string
          is_running: boolean
          niche_topics: string
          posts_per_day: number
          site_url: string
          target_audience: string
        }
        Insert: {
          brand_name: string
          business_description: string
          competitors: string
          created_at?: string
          id?: string
          is_running?: boolean
          niche_topics: string
          posts_per_day?: number
          site_url: string
          target_audience: string
        }
        Update: {
          brand_name?: string
          business_description?: string
          competitors?: string
          created_at?: string
          id?: string
          is_running?: boolean
          niche_topics?: string
          posts_per_day?: number
          site_url?: string
          target_audience?: string
        }
        Relationships: []
      }
      granola_errors: {
        Row: {
          created_at: string | null
          error_message: string | null
          function_name: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          function_name?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          function_name?: string | null
          id?: string
        }
        Relationships: []
      }
      granola_intelligence: {
        Row: {
          actioned: boolean | null
          content: string | null
          created_at: string | null
          id: string
          intel_type: string | null
          meeting_date: string | null
          meeting_id: string | null
          meeting_title: string | null
          speaker_context: string | null
        }
        Insert: {
          actioned?: boolean | null
          content?: string | null
          created_at?: string | null
          id?: string
          intel_type?: string | null
          meeting_date?: string | null
          meeting_id?: string | null
          meeting_title?: string | null
          speaker_context?: string | null
        }
        Update: {
          actioned?: boolean | null
          content?: string | null
          created_at?: string | null
          id?: string
          intel_type?: string | null
          meeting_date?: string | null
          meeting_id?: string | null
          meeting_title?: string | null
          speaker_context?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "granola_intelligence_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "granola_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      granola_meetings: {
        Row: {
          action_items: string | null
          created_at: string | null
          decisions: string | null
          duration_minutes: number | null
          ended_at: string | null
          enhanced_notes: string | null
          granola_meeting_id: string | null
          id: string
          key_insights: string | null
          meeting_type: string | null
          participants: string | null
          processed: boolean | null
          processing_status: string | null
          raw_notes: string | null
          started_at: string | null
          title: string | null
        }
        Insert: {
          action_items?: string | null
          created_at?: string | null
          decisions?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          enhanced_notes?: string | null
          granola_meeting_id?: string | null
          id?: string
          key_insights?: string | null
          meeting_type?: string | null
          participants?: string | null
          processed?: boolean | null
          processing_status?: string | null
          raw_notes?: string | null
          started_at?: string | null
          title?: string | null
        }
        Update: {
          action_items?: string | null
          created_at?: string | null
          decisions?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          enhanced_notes?: string | null
          granola_meeting_id?: string | null
          id?: string
          key_insights?: string | null
          meeting_type?: string | null
          participants?: string | null
          processed?: boolean | null
          processing_status?: string | null
          raw_notes?: string | null
          started_at?: string | null
          title?: string | null
        }
        Relationships: []
      }
      granola_outputs: {
        Row: {
          content: string | null
          created_at: string | null
          external_id: string | null
          id: string
          meeting_id: string | null
          output_type: string | null
          published: boolean | null
          published_at: string | null
          title: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          external_id?: string | null
          id?: string
          meeting_id?: string | null
          output_type?: string | null
          published?: boolean | null
          published_at?: string | null
          title?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          external_id?: string | null
          id?: string
          meeting_id?: string | null
          output_type?: string | null
          published?: boolean | null
          published_at?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "granola_outputs_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "granola_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      granola_settings: {
        Row: {
          brand_name: string | null
          create_linear_issues: boolean | null
          created_at: string | null
          feed_customer_intelligence: boolean | null
          id: string
          is_running: boolean | null
          meeting_types_to_process: string | null
          prompt_version: string | null
          publish_blog_posts: boolean | null
          publish_product_updates: boolean | null
          send_slack_summary: boolean | null
          setup_complete: boolean | null
          site_url: string | null
          slack_webhook_url: string | null
          weekly_digest_day: string | null
          weekly_digest_enabled: boolean | null
        }
        Insert: {
          brand_name?: string | null
          create_linear_issues?: boolean | null
          created_at?: string | null
          feed_customer_intelligence?: boolean | null
          id?: string
          is_running?: boolean | null
          meeting_types_to_process?: string | null
          prompt_version?: string | null
          publish_blog_posts?: boolean | null
          publish_product_updates?: boolean | null
          send_slack_summary?: boolean | null
          setup_complete?: boolean | null
          site_url?: string | null
          slack_webhook_url?: string | null
          weekly_digest_day?: string | null
          weekly_digest_enabled?: boolean | null
        }
        Update: {
          brand_name?: string | null
          create_linear_issues?: boolean | null
          created_at?: string | null
          feed_customer_intelligence?: boolean | null
          id?: string
          is_running?: boolean | null
          meeting_types_to_process?: string | null
          prompt_version?: string | null
          publish_blog_posts?: boolean | null
          publish_product_updates?: boolean | null
          send_slack_summary?: boolean | null
          setup_complete?: boolean | null
          site_url?: string | null
          slack_webhook_url?: string | null
          weekly_digest_day?: string | null
          weekly_digest_enabled?: boolean | null
        }
        Relationships: []
      }
      product_publish_settings: {
        Row: {
          created_at: string
          enabled: boolean
          geo_posts_per_day: number
          id: string
          product: string
          seo_posts_per_day: number
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          geo_posts_per_day?: number
          id?: string
          product: string
          seo_posts_per_day?: number
        }
        Update: {
          created_at?: string
          enabled?: boolean
          geo_posts_per_day?: number
          id?: string
          product?: string
          seo_posts_per_day?: number
        }
        Relationships: []
      }
      prompt_releases: {
        Row: {
          change_type: string
          changes: string | null
          created_at: string
          download_url: string | null
          engine_name: string
          id: string
          published: boolean
          release_date: string
          summary: string
          upgrade_complexity: string
          upgrade_instructions: string | null
          version: string
        }
        Insert: {
          change_type: string
          changes?: string | null
          created_at?: string
          download_url?: string | null
          engine_name: string
          id?: string
          published?: boolean
          release_date: string
          summary: string
          upgrade_complexity?: string
          upgrade_instructions?: string | null
          version: string
        }
        Update: {
          change_type?: string
          changes?: string | null
          created_at?: string
          download_url?: string | null
          engine_name?: string
          id?: string
          published?: boolean
          release_date?: string
          summary?: string
          upgrade_complexity?: string
          upgrade_instructions?: string | null
          version?: string
        }
        Relationships: []
      }
      prompt_versions: {
        Row: {
          created_at: string
          id: string
          is_current: boolean
          product: string
          prompt_text: string
          version: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_current?: boolean
          product: string
          prompt_text: string
          version: string
        }
        Update: {
          created_at?: string
          id?: string
          is_current?: boolean
          product?: string
          prompt_text?: string
          version?: string
        }
        Relationships: []
      }
      seo_errors: {
        Row: {
          created_at: string
          error_message: string
          id: string
        }
        Insert: {
          created_at?: string
          error_message: string
          id?: string
        }
        Update: {
          created_at?: string
          error_message?: string
          id?: string
        }
        Relationships: []
      }
      seo_keywords: {
        Row: {
          current_position: number | null
          id: string
          keyword: string
          last_checked: string | null
          page_url: string | null
          previous_position: number | null
          product: string | null
        }
        Insert: {
          current_position?: number | null
          id?: string
          keyword: string
          last_checked?: string | null
          page_url?: string | null
          previous_position?: number | null
          product?: string | null
        }
        Update: {
          current_position?: number | null
          id?: string
          keyword?: string
          last_checked?: string | null
          page_url?: string | null
          previous_position?: number | null
          product?: string | null
        }
        Relationships: []
      }
      seo_posts: {
        Row: {
          body: string
          excerpt: string | null
          id: string
          published_at: string
          slug: string
          status: string
          target_keyword: string | null
          title: string
        }
        Insert: {
          body: string
          excerpt?: string | null
          id?: string
          published_at?: string
          slug: string
          status?: string
          target_keyword?: string | null
          title: string
        }
        Update: {
          body?: string
          excerpt?: string | null
          id?: string
          published_at?: string
          slug?: string
          status?: string
          target_keyword?: string | null
          title?: string
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          business_description: string
          competitors: string
          created_at: string
          google_search_console_connected: boolean
          id: string
          is_running: boolean
          publishing_frequency: string
          site_url: string
          target_keywords: string
        }
        Insert: {
          business_description: string
          competitors: string
          created_at?: string
          google_search_console_connected?: boolean
          id?: string
          is_running?: boolean
          publishing_frequency?: string
          site_url: string
          target_keywords: string
        }
        Update: {
          business_description?: string
          competitors?: string
          created_at?: string
          google_search_console_connected?: boolean
          id?: string
          is_running?: boolean
          publishing_frequency?: string
          site_url?: string
          target_keywords?: string
        }
        Relationships: []
      }
      stream_clips: {
        Row: {
          clip_url: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          published_at: string | null
          session_id: string | null
          thumbnail_url: string | null
          title: string
          twitch_clip_id: string
          view_count: number | null
        }
        Insert: {
          clip_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          published_at?: string | null
          session_id?: string | null
          thumbnail_url?: string | null
          title: string
          twitch_clip_id: string
          view_count?: number | null
        }
        Update: {
          clip_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          published_at?: string | null
          session_id?: string | null
          thumbnail_url?: string | null
          title?: string
          twitch_clip_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stream_clips_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "stream_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_content: {
        Row: {
          body: string
          content_type: string
          created_at: string
          id: string
          published_at: string | null
          session_id: string | null
          slug: string
          status: string
          target_keyword: string | null
          title: string
          views: number
        }
        Insert: {
          body: string
          content_type: string
          created_at?: string
          id?: string
          published_at?: string | null
          session_id?: string | null
          slug: string
          status?: string
          target_keyword?: string | null
          title: string
          views?: number
        }
        Update: {
          body?: string
          content_type?: string
          created_at?: string
          id?: string
          published_at?: string | null
          session_id?: string | null
          slug?: string
          status?: string
          target_keyword?: string | null
          title?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "stream_content_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "stream_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_errors: {
        Row: {
          created_at: string
          error_message: string
          function_name: string
          id: string
        }
        Insert: {
          created_at?: string
          error_message: string
          function_name: string
          id?: string
        }
        Update: {
          created_at?: string
          error_message?: string
          function_name?: string
          id?: string
        }
        Relationships: []
      }
      stream_optimisation_log: {
        Row: {
          content_type: string | null
          id: string
          new_template: string | null
          old_template: string | null
          optimised_at: string | null
          trigger_reason: string | null
        }
        Insert: {
          content_type?: string | null
          id?: string
          new_template?: string | null
          old_template?: string | null
          optimised_at?: string | null
          trigger_reason?: string | null
        }
        Update: {
          content_type?: string | null
          id?: string
          new_template?: string | null
          old_template?: string | null
          optimised_at?: string | null
          trigger_reason?: string | null
        }
        Relationships: []
      }
      stream_sessions: {
        Row: {
          average_viewers: number | null
          created_at: string
          duration_minutes: number | null
          ended_at: string | null
          game_name: string | null
          id: string
          peak_viewers: number | null
          started_at: string | null
          status: string
          title: string
          twitch_stream_id: string
        }
        Insert: {
          average_viewers?: number | null
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          game_name?: string | null
          id?: string
          peak_viewers?: number | null
          started_at?: string | null
          status?: string
          title: string
          twitch_stream_id: string
        }
        Update: {
          average_viewers?: number | null
          created_at?: string
          duration_minutes?: number | null
          ended_at?: string | null
          game_name?: string | null
          id?: string
          peak_viewers?: number | null
          started_at?: string | null
          status?: string
          title?: string
          twitch_stream_id?: string
        }
        Relationships: []
      }
      stream_settings: {
        Row: {
          business_name: string | null
          content_niche: string | null
          created_at: string
          id: string
          is_running: boolean
          recap_template_guidance: string | null
          setup_complete: boolean
          site_url: string | null
          twitch_client_id: string | null
          twitch_client_secret: string | null
          twitch_user_id: string | null
          twitch_username: string | null
        }
        Insert: {
          business_name?: string | null
          content_niche?: string | null
          created_at?: string
          id?: string
          is_running?: boolean
          recap_template_guidance?: string | null
          setup_complete?: boolean
          site_url?: string | null
          twitch_client_id?: string | null
          twitch_client_secret?: string | null
          twitch_user_id?: string | null
          twitch_username?: string | null
        }
        Update: {
          business_name?: string | null
          content_niche?: string | null
          created_at?: string
          id?: string
          is_running?: boolean
          recap_template_guidance?: string | null
          setup_complete?: boolean
          site_url?: string | null
          twitch_client_id?: string | null
          twitch_client_secret?: string | null
          twitch_user_id?: string | null
          twitch_username?: string | null
        }
        Relationships: []
      }
      stream_transcripts: {
        Row: {
          id: string
          processed_at: string | null
          session_id: string | null
          transcript_text: string
          word_count: number | null
        }
        Insert: {
          id?: string
          processed_at?: string | null
          session_id?: string | null
          transcript_text: string
          word_count?: number | null
        }
        Update: {
          id?: string
          processed_at?: string | null
          session_id?: string | null
          transcript_text?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stream_transcripts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "stream_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          features: string[] | null
          id: string
          is_paid: boolean
          logo_url: string | null
          name: string
          polar_customer_id: string | null
          polar_subscription_id: string | null
          screenshot_url: string | null
          slug: string | null
          status: string
          tagline: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          features?: string[] | null
          id?: string
          is_paid?: boolean
          logo_url?: string | null
          name: string
          polar_customer_id?: string | null
          polar_subscription_id?: string | null
          screenshot_url?: string | null
          slug?: string | null
          status?: string
          tagline: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          features?: string[] | null
          id?: string
          is_paid?: boolean
          logo_url?: string | null
          name?: string
          polar_customer_id?: string | null
          polar_subscription_id?: string | null
          screenshot_url?: string | null
          slug?: string | null
          status?: string
          tagline?: string
          url?: string
        }
        Relationships: []
      }
      visitors: {
        Row: {
          city: string | null
          country: string | null
          country_code: string | null
          created_at: string
          id: string
          ip_hash: string
          latitude: number | null
          longitude: number | null
          page: string | null
          referrer: string | null
          region: string | null
          user_agent: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
          ip_hash: string
          latitude?: number | null
          longitude?: number | null
          page?: string | null
          referrer?: string | null
          region?: string | null
          user_agent?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
          ip_hash?: string
          latitude?: number | null
          longitude?: number | null
          page?: string | null
          referrer?: string | null
          region?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      voice_episodes: {
        Row: {
          audio_url: string | null
          created_at: string
          duration_seconds: number | null
          file_size_bytes: number | null
          id: string
          post_id: string | null
          post_slug: string
          post_title: string
          published_at: string | null
          status: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          id?: string
          post_id?: string | null
          post_slug: string
          post_title: string
          published_at?: string | null
          status?: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          file_size_bytes?: number | null
          id?: string
          post_id?: string | null
          post_slug?: string
          post_title?: string
          published_at?: string | null
          status?: string
        }
        Relationships: []
      }
      voice_errors: {
        Row: {
          created_at: string
          error_message: string
          id: string
          post_slug: string | null
        }
        Insert: {
          created_at?: string
          error_message: string
          id?: string
          post_slug?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string
          id?: string
          post_slug?: string | null
        }
        Relationships: []
      }
      voice_settings: {
        Row: {
          created_at: string
          elevenlabs_api_key: string | null
          id: string
          is_running: boolean
          podcast_author: string | null
          podcast_description: string | null
          podcast_title: string | null
          setup_complete: boolean
          site_url: string | null
          voice_id: string | null
        }
        Insert: {
          created_at?: string
          elevenlabs_api_key?: string | null
          id?: string
          is_running?: boolean
          podcast_author?: string | null
          podcast_description?: string | null
          podcast_title?: string | null
          setup_complete?: boolean
          site_url?: string | null
          voice_id?: string | null
        }
        Update: {
          created_at?: string
          elevenlabs_api_key?: string | null
          id?: string
          is_running?: boolean
          podcast_author?: string | null
          podcast_description?: string | null
          podcast_title?: string | null
          setup_complete?: boolean
          site_url?: string | null
          voice_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
