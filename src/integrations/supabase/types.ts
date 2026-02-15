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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ab_tests: {
        Row: {
          created_at: string
          created_by: string | null
          daily_data: Json | null
          description: string | null
          end_date: string | null
          id: string
          metrics: Json | null
          name: string
          start_date: string | null
          status: string
          success_metrics: string[] | null
          target_audience: string | null
          test_type: string
          traffic_split: Json
          updated_at: string
          variants: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          daily_data?: Json | null
          description?: string | null
          end_date?: string | null
          id?: string
          metrics?: Json | null
          name: string
          start_date?: string | null
          status?: string
          success_metrics?: string[] | null
          target_audience?: string | null
          test_type: string
          traffic_split?: Json
          updated_at?: string
          variants?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          daily_data?: Json | null
          description?: string | null
          end_date?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          start_date?: string | null
          status?: string
          success_metrics?: string[] | null
          target_audience?: string | null
          test_type?: string
          traffic_split?: Json
          updated_at?: string
          variants?: Json
        }
        Relationships: []
      }
      admin_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      admin_audit_log: {
        Row: {
          action_type: string
          changes: Json | null
          created_at: string | null
          id: string
          record_id: string | null
          table_name: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_conversation_insights: {
        Row: {
          communication_style: string | null
          conversation_partner_id: string
          conversation_summary: string | null
          created_at: string
          id: string
          last_updated: string | null
          shared_interests: Json | null
          suggested_topics: Json | null
          user_id: string
        }
        Insert: {
          communication_style?: string | null
          conversation_partner_id: string
          conversation_summary?: string | null
          created_at?: string
          id?: string
          last_updated?: string | null
          shared_interests?: Json | null
          suggested_topics?: Json | null
          user_id: string
        }
        Update: {
          communication_style?: string | null
          conversation_partner_id?: string
          conversation_summary?: string | null
          created_at?: string
          id?: string
          last_updated?: string | null
          shared_interests?: Json | null
          suggested_topics?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      app_translations: {
        Row: {
          auto_translated: boolean | null
          category: string
          context: string | null
          created_at: string | null
          id: string
          language_code: string
          needs_review: boolean | null
          translation_key: string
          translation_value: string
          updated_at: string | null
        }
        Insert: {
          auto_translated?: boolean | null
          category: string
          context?: string | null
          created_at?: string | null
          id?: string
          language_code: string
          needs_review?: boolean | null
          translation_key: string
          translation_value: string
          updated_at?: string | null
        }
        Update: {
          auto_translated?: boolean | null
          category?: string
          context?: string | null
          created_at?: string | null
          id?: string
          language_code?: string
          needs_review?: boolean | null
          translation_key?: string
          translation_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blocked_users: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_users_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      category_items: {
        Row: {
          active: boolean
          category_id: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          item_type: string
          name: string
          options: string[] | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          category_id: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          item_type: string
          name: string
          options?: string[] | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          category_id?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          item_type?: string
          name?: string
          options?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      chaperone_settings: {
        Row: {
          can_view_messages: boolean
          can_view_photos: boolean
          chaperone_email: string | null
          chaperone_name: string | null
          chaperone_user_id: string | null
          created_at: string
          enabled: boolean
          id: string
          notify_on_match: boolean
          notify_on_message: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          can_view_messages?: boolean
          can_view_photos?: boolean
          chaperone_email?: string | null
          chaperone_name?: string | null
          chaperone_user_id?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          notify_on_match?: boolean
          notify_on_message?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          can_view_messages?: boolean
          can_view_photos?: boolean
          chaperone_email?: string | null
          chaperone_name?: string | null
          chaperone_user_id?: string | null
          created_at?: string
          enabled?: boolean
          id?: string
          notify_on_match?: boolean
          notify_on_message?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      content_categories: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          display_order: number
          id: string
          item_count: number
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          item_count?: number
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          item_count?: number
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversation_metadata: {
        Row: {
          created_at: string
          id: string
          is_archived: boolean | null
          last_message_at: string | null
          updated_at: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          updated_at?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          updated_at?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      daily_usage: {
        Row: {
          boosts_count: number
          created_at: string
          date: string
          id: string
          likes_count: number
          rewinds_count: number
          super_likes_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          boosts_count?: number
          created_at?: string
          date?: string
          id?: string
          likes_count?: number
          rewinds_count?: number
          super_likes_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          boosts_count?: number
          created_at?: string
          date?: string
          id?: string
          likes_count?: number
          rewinds_count?: number
          super_likes_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_stats: {
        Row: {
          change_percentage: number
          created_at: string | null
          icon: string
          id: number
          stat_name: string
          stat_value: number
          trend: string | null
          updated_at: string | null
        }
        Insert: {
          change_percentage?: number
          created_at?: string | null
          icon: string
          id: number
          stat_name: string
          stat_value?: number
          trend?: string | null
          updated_at?: string | null
        }
        Update: {
          change_percentage?: number
          created_at?: string | null
          icon?: string
          id?: number
          stat_name?: string
          stat_value?: number
          trend?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      data_exports: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          error_message: string | null
          export_type: string
          file_size: number | null
          file_url: string | null
          filters: Json | null
          format: string
          id: string
          name: string
          row_count: number | null
          schedule_frequency: string | null
          scheduled: boolean | null
          selected_fields: string[] | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          export_type: string
          file_size?: number | null
          file_url?: string | null
          filters?: Json | null
          format?: string
          id?: string
          name: string
          row_count?: number | null
          schedule_frequency?: string | null
          scheduled?: boolean | null
          selected_fields?: string[] | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          export_type?: string
          file_size?: number | null
          file_url?: string | null
          filters?: Json | null
          format?: string
          id?: string
          name?: string
          row_count?: number | null
          schedule_frequency?: string | null
          scheduled?: boolean | null
          selected_fields?: string[] | null
          status?: string
        }
        Relationships: []
      }
      date_proposals: {
        Row: {
          activity: string
          created_at: string
          id: string
          location: string | null
          message: string | null
          proposed_date: string
          proposer_id: string
          recipient_id: string
          responded_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          activity: string
          created_at?: string
          id?: string
          location?: string | null
          message?: string | null
          proposed_date: string
          proposer_id: string
          recipient_id: string
          responded_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          activity?: string
          created_at?: string
          id?: string
          location?: string | null
          message?: string | null
          proposed_date?: string
          proposer_id?: string
          recipient_id?: string
          responded_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "date_proposals_proposer_id_fkey"
            columns: ["proposer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "date_proposals_proposer_id_fkey"
            columns: ["proposer_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "date_proposals_proposer_id_fkey"
            columns: ["proposer_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "date_proposals_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "date_proposals_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "date_proposals_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          bounced_count: number | null
          campaign_type: string
          clicked_count: number | null
          created_at: string
          created_by: string | null
          id: string
          metrics: Json | null
          name: string
          opened_count: number | null
          recipient_count: number | null
          scheduled_date: string | null
          sent_count: number | null
          sent_date: string | null
          status: string
          subject: string
          target_audience: string | null
          template: string | null
          unsubscribed_count: number | null
          updated_at: string
        }
        Insert: {
          bounced_count?: number | null
          campaign_type: string
          clicked_count?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          metrics?: Json | null
          name: string
          opened_count?: number | null
          recipient_count?: number | null
          scheduled_date?: string | null
          sent_count?: number | null
          sent_date?: string | null
          status?: string
          subject: string
          target_audience?: string | null
          template?: string | null
          unsubscribed_count?: number | null
          updated_at?: string
        }
        Update: {
          bounced_count?: number | null
          campaign_type?: string
          clicked_count?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          opened_count?: number | null
          recipient_count?: number | null
          scheduled_date?: string | null
          sent_count?: number | null
          sent_date?: string | null
          status?: string
          subject?: string
          target_audience?: string | null
          template?: string | null
          unsubscribed_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      event_attendees: {
        Row: {
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          attendees_count: number
          category: string | null
          created_at: string
          description: string
          event_date: string
          id: string
          image_url: string | null
          location: string
          max_attendees: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attendees_count?: number
          category?: string | null
          created_at?: string
          description: string
          event_date: string
          id?: string
          image_url?: string | null
          location: string
          max_attendees?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attendees_count?: number
          category?: string | null
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          image_url?: string | null
          location?: string
          max_attendees?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_posts: {
        Row: {
          created_at: string
          group_id: string
          id: string
          post_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          post_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          category: string
          cover_image: string | null
          created_at: string
          created_by: string
          description: string | null
          icon: string | null
          id: string
          member_count: number
          name: string
          post_count: number
          privacy: string
          updated_at: string
        }
        Insert: {
          category: string
          cover_image?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          icon?: string | null
          id?: string
          member_count?: number
          name: string
          post_count?: number
          privacy?: string
          updated_at?: string
        }
        Update: {
          category?: string
          cover_image?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          icon?: string | null
          id?: string
          member_count?: number
          name?: string
          post_count?: number
          privacy?: string
          updated_at?: string
        }
        Relationships: []
      }
      hashtags: {
        Row: {
          created_at: string
          id: string
          last_used_at: string
          name: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_used_at?: string
          name: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_used_at?: string
          name?: string
          usage_count?: number
        }
        Relationships: []
      }
      interests: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      landing_page_content: {
        Row: {
          content: Json
          created_at: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      landing_page_sections: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          language_code: string
          section_order: number
          section_type: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          language_code: string
          section_order: number
          section_type: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          language_code?: string
          section_order?: number
          section_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      landing_page_snapshots: {
        Row: {
          content: Json
          created_at: string | null
          created_by: string | null
          id: string
          language_code: string
          version_name: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          language_code: string
          version_name?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          language_code?: string
          version_name?: string | null
        }
        Relationships: []
      }
      landing_page_translations: {
        Row: {
          content: Json
          created_at: string | null
          id: number
          is_published: boolean | null
          language_code: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: number
          is_published?: boolean | null
          language_code: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: number
          is_published?: boolean | null
          language_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      landing_page_v2_translations: {
        Row: {
          community_description: string
          community_dialects: Json
          community_images: Json
          community_subtitle: string
          community_title: string
          created_at: string | null
          cta_button_text: string
          cta_subtitle: string | null
          cta_title: string
          features: Json
          footer_links: Json | null
          footer_text: string
          gallery_categories: Json | null
          gallery_subtitle: string | null
          gallery_title: string | null
          hero_cta_text: string
          hero_image_url: string
          hero_subtitle: string
          hero_title: string
          how_it_works_steps: Json
          how_it_works_title: string
          id: string
          is_published: boolean | null
          language_code: string
          updated_at: string | null
        }
        Insert: {
          community_description: string
          community_dialects?: Json
          community_images?: Json
          community_subtitle: string
          community_title: string
          created_at?: string | null
          cta_button_text: string
          cta_subtitle?: string | null
          cta_title: string
          features?: Json
          footer_links?: Json | null
          footer_text: string
          gallery_categories?: Json | null
          gallery_subtitle?: string | null
          gallery_title?: string | null
          hero_cta_text?: string
          hero_image_url: string
          hero_subtitle: string
          hero_title: string
          how_it_works_steps?: Json
          how_it_works_title?: string
          id?: string
          is_published?: boolean | null
          language_code: string
          updated_at?: string | null
        }
        Update: {
          community_description?: string
          community_dialects?: Json
          community_images?: Json
          community_subtitle?: string
          community_title?: string
          created_at?: string | null
          cta_button_text?: string
          cta_subtitle?: string | null
          cta_title?: string
          features?: Json
          footer_links?: Json | null
          footer_text?: string
          gallery_categories?: Json | null
          gallery_subtitle?: string | null
          gallery_title?: string | null
          hero_cta_text?: string
          hero_image_url?: string
          hero_subtitle?: string
          hero_title?: string
          how_it_works_steps?: Json
          how_it_works_title?: string
          id?: string
          is_published?: boolean | null
          language_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          likee_id: string | null
          liker_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          likee_id?: string | null
          liker_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          likee_id?: string | null
          liker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_likee_id_fkey"
            columns: ["likee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_likee_id_fkey"
            columns: ["likee_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_likee_id_fkey"
            columns: ["likee_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_liker_id_fkey"
            columns: ["liker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_liker_id_fkey"
            columns: ["liker_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_liker_id_fkey"
            columns: ["liker_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      marriage_intentions: {
        Row: {
          created_at: string
          family_plans: string | null
          id: string
          intention: string
          timeline: string | null
          updated_at: string
          user_id: string
          visible_on_profile: boolean
        }
        Insert: {
          created_at?: string
          family_plans?: string | null
          id?: string
          intention: string
          timeline?: string | null
          updated_at?: string
          user_id: string
          visible_on_profile?: boolean
        }
        Update: {
          created_at?: string
          family_plans?: string | null
          id?: string
          intention?: string
          timeline?: string | null
          updated_at?: string
          user_id?: string
          visible_on_profile?: boolean
        }
        Relationships: []
      }
      matches: {
        Row: {
          id: string
          matched_at: string | null
          user1_id: string | null
          user2_id: string | null
        }
        Insert: {
          id?: string
          matched_at?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Update: {
          id?: string
          matched_at?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      message_rate_limits: {
        Row: {
          created_at: string
          id: string
          message_count: number
          user_id: string
          window_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_count?: number
          user_id: string
          window_start?: string
        }
        Update: {
          created_at?: string
          id?: string
          message_count?: number
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      message_safety_flags: {
        Row: {
          action_taken: string | null
          ai_detected: boolean | null
          created_at: string
          flag_type: string
          id: string
          message_id: string | null
          recipient_id: string
          reviewed: boolean | null
          sender_id: string
          severity: string
        }
        Insert: {
          action_taken?: string | null
          ai_detected?: boolean | null
          created_at?: string
          flag_type: string
          id?: string
          message_id?: string | null
          recipient_id: string
          reviewed?: boolean | null
          sender_id: string
          severity?: string
        }
        Update: {
          action_taken?: string | null
          ai_detected?: boolean | null
          created_at?: string
          flag_type?: string
          id?: string
          message_id?: string | null
          recipient_id?: string
          reviewed?: boolean | null
          sender_id?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_safety_flags_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_safety_flags_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_safety_flags_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_safety_flags_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_safety_flags_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_safety_flags_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_safety_flags_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string | null
          id: string
          media_duration: number | null
          media_type: string | null
          media_url: string | null
          read: boolean | null
          recipient_id: string | null
          sender_id: string | null
          text: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_duration?: number | null
          media_type?: string | null
          media_url?: string | null
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
          text: string
        }
        Update: {
          created_at?: string | null
          id?: string
          media_duration?: number | null
          media_type?: string | null
          media_url?: string | null
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_actions: {
        Row: {
          action_type: string
          admin_id: string
          content_id: string
          content_type: string
          created_at: string
          duration_hours: number | null
          id: string
          reason: string | null
          report_id: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          content_id: string
          content_type: string
          created_at?: string
          duration_hours?: number | null
          id?: string
          reason?: string | null
          report_id?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          content_id?: string
          content_type?: string
          created_at?: string
          duration_hours?: number | null
          id?: string
          reason?: string | null
          report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_actions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      muted_conversations: {
        Row: {
          created_at: string
          id: string
          muted_until: string | null
          muted_user_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          muted_until?: string | null
          muted_user_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          muted_until?: string | null
          muted_user_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "muted_conversations_muted_user_id_fkey"
            columns: ["muted_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "muted_conversations_muted_user_id_fkey"
            columns: ["muted_user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "muted_conversations_muted_user_id_fkey"
            columns: ["muted_user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "muted_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "muted_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "muted_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          created_at: string
          group_id: string | null
          id: string
          link: string | null
          message: string
          post_id: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          group_id?: string | null
          id?: string
          link?: string | null
          message: string
          post_id?: string | null
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          group_id?: string | null
          id?: string
          link?: string | null
          message?: string
          post_id?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          payment_method_encrypted: string | null
          status: string
          stripe_customer_id: string | null
          stripe_customer_id_encrypted: string | null
          stripe_payment_intent_id: string | null
          stripe_payment_intent_id_encrypted: string | null
          subscription_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_method_encrypted?: string | null
          status: string
          stripe_customer_id?: string | null
          stripe_customer_id_encrypted?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payment_intent_id_encrypted?: string | null
          subscription_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_method_encrypted?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_customer_id_encrypted?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payment_intent_id_encrypted?: string | null
          subscription_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      phone_verifications: {
        Row: {
          attempts: number | null
          created_at: string
          expires_at: string
          id: string
          phone_number: string
          user_id: string | null
          verification_code: string
          verified: boolean | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string
          expires_at: string
          id?: string
          phone_number: string
          user_id?: string | null
          verification_code: string
          verified?: boolean | null
        }
        Update: {
          attempts?: number | null
          created_at?: string
          expires_at?: string
          id?: string
          phone_number?: string
          user_id?: string | null
          verification_code?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      photos: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          profile_id: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          profile_id?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          profile_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          depth: number
          id: string
          likes_count: number
          mentions: string[] | null
          parent_comment_id: string | null
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          depth?: number
          id?: string
          likes_count?: number
          mentions?: string[] | null
          parent_comment_id?: string | null
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          depth?: number
          id?: string
          likes_count?: number
          mentions?: string[] | null
          parent_comment_id?: string | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          applause_count: number
          comments_count: number
          content: string
          created_at: string
          fire_count: number
          haha_count: number
          hashtags: string[] | null
          id: string
          likes_count: number
          love_count: number
          media_type: string | null
          media_url: string | null
          sad_count: number
          thoughtful_count: number
          total_reactions: number
          updated_at: string
          user_id: string
          wow_count: number
        }
        Insert: {
          applause_count?: number
          comments_count?: number
          content: string
          created_at?: string
          fire_count?: number
          haha_count?: number
          hashtags?: string[] | null
          id?: string
          likes_count?: number
          love_count?: number
          media_type?: string | null
          media_url?: string | null
          sad_count?: number
          thoughtful_count?: number
          total_reactions?: number
          updated_at?: string
          user_id: string
          wow_count?: number
        }
        Update: {
          applause_count?: number
          comments_count?: number
          content?: string
          created_at?: string
          fire_count?: number
          haha_count?: number
          hashtags?: string[] | null
          id?: string
          likes_count?: number
          love_count?: number
          media_type?: string | null
          media_url?: string | null
          sad_count?: number
          thoughtful_count?: number
          total_reactions?: number
          updated_at?: string
          user_id?: string
          wow_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_details: {
        Row: {
          body_type: string | null
          career_ambitions: string | null
          charity_involvement: string | null
          children_status: string | null
          communication_style: string | null
          company: string | null
          created_at: string
          decision_making_style: string | null
          dietary_preferences: string | null
          dream_home: string | null
          dream_vacation: string | null
          drinking: string | null
          education: string | null
          ethnicity: string | null
          evening_routine: string | null
          family_closeness: string | null
          favorite_memory: string | null
          favorite_quote: string | null
          favorite_season: string | null
          financial_habits: string | null
          friendship_style: string | null
          have_pets: string | null
          height: string | null
          id: string
          ideal_date: string | null
          ideal_weather: string | null
          love_language: string | null
          morning_routine: string | null
          personality_type: string | null
          political_views: string | null
          profile_id: string
          religion: string | null
          sleep_schedule: string | null
          smoking: string | null
          transportation_preference: string | null
          travel_frequency: string | null
          updated_at: string
          work_environment: string | null
          work_life_balance: string | null
          zodiac_sign: string | null
        }
        Insert: {
          body_type?: string | null
          career_ambitions?: string | null
          charity_involvement?: string | null
          children_status?: string | null
          communication_style?: string | null
          company?: string | null
          created_at?: string
          decision_making_style?: string | null
          dietary_preferences?: string | null
          dream_home?: string | null
          dream_vacation?: string | null
          drinking?: string | null
          education?: string | null
          ethnicity?: string | null
          evening_routine?: string | null
          family_closeness?: string | null
          favorite_memory?: string | null
          favorite_quote?: string | null
          favorite_season?: string | null
          financial_habits?: string | null
          friendship_style?: string | null
          have_pets?: string | null
          height?: string | null
          id?: string
          ideal_date?: string | null
          ideal_weather?: string | null
          love_language?: string | null
          morning_routine?: string | null
          personality_type?: string | null
          political_views?: string | null
          profile_id: string
          religion?: string | null
          sleep_schedule?: string | null
          smoking?: string | null
          transportation_preference?: string | null
          travel_frequency?: string | null
          updated_at?: string
          work_environment?: string | null
          work_life_balance?: string | null
          zodiac_sign?: string | null
        }
        Update: {
          body_type?: string | null
          career_ambitions?: string | null
          charity_involvement?: string | null
          children_status?: string | null
          communication_style?: string | null
          company?: string | null
          created_at?: string
          decision_making_style?: string | null
          dietary_preferences?: string | null
          dream_home?: string | null
          dream_vacation?: string | null
          drinking?: string | null
          education?: string | null
          ethnicity?: string | null
          evening_routine?: string | null
          family_closeness?: string | null
          favorite_memory?: string | null
          favorite_quote?: string | null
          favorite_season?: string | null
          financial_habits?: string | null
          friendship_style?: string | null
          have_pets?: string | null
          height?: string | null
          id?: string
          ideal_date?: string | null
          ideal_weather?: string | null
          love_language?: string | null
          morning_routine?: string | null
          personality_type?: string | null
          political_views?: string | null
          profile_id?: string
          religion?: string | null
          sleep_schedule?: string | null
          smoking?: string | null
          transportation_preference?: string | null
          travel_frequency?: string | null
          updated_at?: string
          work_environment?: string | null
          work_life_balance?: string | null
          zodiac_sign?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_interests: {
        Row: {
          created_at: string
          id: string
          interest_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interest_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interest_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_interests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_interests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_interests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_preferences: {
        Row: {
          created_at: string
          exercise_habits: string | null
          id: string
          kurdistan_region: string | null
          profile_id: string
          relationship_goals: string | null
          updated_at: string
          want_children: string | null
        }
        Insert: {
          created_at?: string
          exercise_habits?: string | null
          id?: string
          kurdistan_region?: string | null
          profile_id: string
          relationship_goals?: string | null
          updated_at?: string
          want_children?: string | null
        }
        Update: {
          created_at?: string
          exercise_habits?: string | null
          id?: string
          kurdistan_region?: string | null
          profile_id?: string
          relationship_goals?: string | null
          updated_at?: string
          want_children?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_section_views: {
        Row: {
          created_at: string
          id: string
          sections_opened: string[]
          updated_at: string
          view_percentage: number
          viewed_profile_id: string
          viewer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          sections_opened?: string[]
          updated_at?: string
          view_percentage?: number
          viewed_profile_id: string
          viewer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          sections_opened?: string[]
          updated_at?: string
          view_percentage?: number
          viewed_profile_id?: string
          viewer_id?: string
        }
        Relationships: []
      }
      profile_sharing: {
        Row: {
          created_at: string
          id: string
          owner_id: string
          share_type: string
          shared_fields: string[] | null
          shared_with_user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_id: string
          share_type?: string
          shared_fields?: string[] | null
          shared_with_user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_id?: string
          share_type?: string
          shared_fields?: string[] | null
          shared_with_user_id?: string
        }
        Relationships: []
      }
      profile_views: {
        Row: {
          created_at: string
          id: string
          viewed_at: string
          viewed_profile_id: string
          viewer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          viewed_at?: string
          viewed_profile_id: string
          viewer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          viewed_at?: string
          viewed_profile_id?: string
          viewer_id?: string
        }
        Relationships: []
      }
      profile_visibility_settings: {
        Row: {
          created_at: string
          field_name: string
          id: string
          is_visible: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          field_name: string
          id?: string
          is_visible?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          field_name?: string
          id?: string
          is_visible?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number
          bio: string
          blur_photos: boolean | null
          body_type: string
          career_ambitions: string | null
          charity_involvement: string | null
          children_status: string | null
          communication_style: string | null
          company: string | null
          created_at: string | null
          creative_pursuits: string[] | null
          dating_profile_visible: boolean | null
          decision_making_style: string | null
          dietary_preferences: string | null
          dream_home: string | null
          dream_vacation: string | null
          drinking: string | null
          education: string
          ethnicity: string
          evening_routine: string | null
          exercise_habits: string
          family_closeness: string | null
          favorite_books: string[] | null
          favorite_foods: string[] | null
          favorite_games: string[] | null
          favorite_memory: string | null
          favorite_movies: string[] | null
          favorite_music: string[] | null
          favorite_podcasts: string[] | null
          favorite_quote: string | null
          favorite_season: string | null
          financial_habits: string | null
          friendship_style: string | null
          gender: string | null
          geo_location: unknown
          growth_goals: string[] | null
          have_pets: string | null
          height: string
          hidden_talents: string[] | null
          hobbies: string[] | null
          id: string
          ideal_date: string | null
          ideal_weather: string | null
          interests: string[] | null
          kurdistan_region: string
          languages: string[] | null
          last_active: string | null
          latitude: number | null
          location: string
          longitude: number | null
          love_language: string | null
          morning_routine: string | null
          music_instruments: string[] | null
          name: string
          notification_preferences: Json | null
          occupation: string
          personality_type: string | null
          pet_peeves: string[] | null
          phone_number: string | null
          phone_verified: boolean | null
          political_views: string | null
          profile_image: string
          relationship_goals: string
          religion: string
          sleep_schedule: string | null
          smoking: string | null
          stress_relievers: string[] | null
          tech_skills: string[] | null
          transportation_preference: string | null
          travel_frequency: string | null
          travel_location: string | null
          travel_mode_active: boolean
          values: string[] | null
          verified: boolean | null
          video_verified: boolean | null
          video_verified_at: string | null
          want_children: string
          weekend_activities: string[] | null
          work_environment: string | null
          work_life_balance: string | null
          zodiac_sign: string | null
        }
        Insert: {
          age: number
          bio?: string
          blur_photos?: boolean | null
          body_type?: string
          career_ambitions?: string | null
          charity_involvement?: string | null
          children_status?: string | null
          communication_style?: string | null
          company?: string | null
          created_at?: string | null
          creative_pursuits?: string[] | null
          dating_profile_visible?: boolean | null
          decision_making_style?: string | null
          dietary_preferences?: string | null
          dream_home?: string | null
          dream_vacation?: string | null
          drinking?: string | null
          education?: string
          ethnicity?: string
          evening_routine?: string | null
          exercise_habits?: string
          family_closeness?: string | null
          favorite_books?: string[] | null
          favorite_foods?: string[] | null
          favorite_games?: string[] | null
          favorite_memory?: string | null
          favorite_movies?: string[] | null
          favorite_music?: string[] | null
          favorite_podcasts?: string[] | null
          favorite_quote?: string | null
          favorite_season?: string | null
          financial_habits?: string | null
          friendship_style?: string | null
          gender?: string | null
          geo_location?: unknown
          growth_goals?: string[] | null
          have_pets?: string | null
          height?: string
          hidden_talents?: string[] | null
          hobbies?: string[] | null
          id: string
          ideal_date?: string | null
          ideal_weather?: string | null
          interests?: string[] | null
          kurdistan_region?: string
          languages?: string[] | null
          last_active?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          love_language?: string | null
          morning_routine?: string | null
          music_instruments?: string[] | null
          name: string
          notification_preferences?: Json | null
          occupation?: string
          personality_type?: string | null
          pet_peeves?: string[] | null
          phone_number?: string | null
          phone_verified?: boolean | null
          political_views?: string | null
          profile_image?: string
          relationship_goals?: string
          religion?: string
          sleep_schedule?: string | null
          smoking?: string | null
          stress_relievers?: string[] | null
          tech_skills?: string[] | null
          transportation_preference?: string | null
          travel_frequency?: string | null
          travel_location?: string | null
          travel_mode_active?: boolean
          values?: string[] | null
          verified?: boolean | null
          video_verified?: boolean | null
          video_verified_at?: string | null
          want_children?: string
          weekend_activities?: string[] | null
          work_environment?: string | null
          work_life_balance?: string | null
          zodiac_sign?: string | null
        }
        Update: {
          age?: number
          bio?: string
          blur_photos?: boolean | null
          body_type?: string
          career_ambitions?: string | null
          charity_involvement?: string | null
          children_status?: string | null
          communication_style?: string | null
          company?: string | null
          created_at?: string | null
          creative_pursuits?: string[] | null
          dating_profile_visible?: boolean | null
          decision_making_style?: string | null
          dietary_preferences?: string | null
          dream_home?: string | null
          dream_vacation?: string | null
          drinking?: string | null
          education?: string
          ethnicity?: string
          evening_routine?: string | null
          exercise_habits?: string
          family_closeness?: string | null
          favorite_books?: string[] | null
          favorite_foods?: string[] | null
          favorite_games?: string[] | null
          favorite_memory?: string | null
          favorite_movies?: string[] | null
          favorite_music?: string[] | null
          favorite_podcasts?: string[] | null
          favorite_quote?: string | null
          favorite_season?: string | null
          financial_habits?: string | null
          friendship_style?: string | null
          gender?: string | null
          geo_location?: unknown
          growth_goals?: string[] | null
          have_pets?: string | null
          height?: string
          hidden_talents?: string[] | null
          hobbies?: string[] | null
          id?: string
          ideal_date?: string | null
          ideal_weather?: string | null
          interests?: string[] | null
          kurdistan_region?: string
          languages?: string[] | null
          last_active?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          love_language?: string | null
          morning_routine?: string | null
          music_instruments?: string[] | null
          name?: string
          notification_preferences?: Json | null
          occupation?: string
          personality_type?: string | null
          pet_peeves?: string[] | null
          phone_number?: string | null
          phone_verified?: boolean | null
          political_views?: string | null
          profile_image?: string
          relationship_goals?: string
          religion?: string
          sleep_schedule?: string | null
          smoking?: string | null
          stress_relievers?: string[] | null
          tech_skills?: string[] | null
          transportation_preference?: string | null
          travel_frequency?: string | null
          travel_location?: string | null
          travel_mode_active?: boolean
          values?: string[] | null
          verified?: boolean | null
          video_verified?: boolean | null
          video_verified_at?: string | null
          want_children?: string
          weekend_activities?: string[] | null
          work_environment?: string | null
          work_life_balance?: string | null
          zodiac_sign?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          is_active: boolean | null
          last_used_at: string
          p256dh: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string
          p256dh: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string
          p256dh?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      registration_questions: {
        Row: {
          category: string
          display_order: number
          enabled: boolean | null
          field_options: string[] | null
          field_type: string
          id: string
          is_system_field: boolean | null
          placeholder: string | null
          profile_field: string | null
          registration_step: string
          required: boolean | null
          text: string
        }
        Insert: {
          category: string
          display_order: number
          enabled?: boolean | null
          field_options?: string[] | null
          field_type: string
          id: string
          is_system_field?: boolean | null
          placeholder?: string | null
          profile_field?: string | null
          registration_step: string
          required?: boolean | null
          text: string
        }
        Update: {
          category?: string
          display_order?: number
          enabled?: boolean | null
          field_options?: string[] | null
          field_type?: string
          id?: string
          is_system_field?: boolean | null
          placeholder?: string | null
          profile_field?: string | null
          registration_step?: string
          required?: boolean | null
          text?: string
        }
        Relationships: []
      }
      reported_messages: {
        Row: {
          conversation_id: string | null
          created_at: string
          description: string | null
          id: string
          message_id: string | null
          reason: string
          reported_user_id: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          message_id?: string | null
          reason: string
          reported_user_id: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          message_id?: string | null
          reason?: string
          reported_user_id?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reported_messages_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          admin_notes: string | null
          content_id: string | null
          content_type: string | null
          context: Json | null
          created_at: string
          details: string | null
          id: string
          reason: string
          reported_user_id: string | null
          reporter_user_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          content_id?: string | null
          content_type?: string | null
          context?: Json | null
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reported_user_id?: string | null
          reporter_user_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          content_id?: string | null
          content_type?: string | null
          context?: Json | null
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reported_user_id?: string | null
          reporter_user_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_user_id_fkey"
            columns: ["reporter_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_user_id_fkey"
            columns: ["reporter_user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_user_id_fkey"
            columns: ["reporter_user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_posts: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      sent_gifts: {
        Row: {
          created_at: string
          gift_id: string
          id: string
          message: string | null
          read: boolean
          recipient_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          gift_id: string
          id?: string
          message?: string | null
          read?: boolean
          recipient_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          gift_id?: string
          id?: string
          message?: string | null
          read?: boolean
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sent_gifts_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "virtual_gifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sent_gifts_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sent_gifts_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sent_gifts_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sent_gifts_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sent_gifts_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sent_gifts_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      social_login_providers: {
        Row: {
          client_id: string | null
          client_secret: string | null
          enabled: boolean | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          client_secret?: string | null
          enabled?: boolean | null
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          client_secret?: string | null
          enabled?: boolean | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          category: string | null
          created_at: string
          duration: number | null
          expires_at: string
          id: string
          media_type: string
          media_url: string
          reactions: Json | null
          user_id: string
          views_count: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          duration?: number | null
          expires_at?: string
          id?: string
          media_type: string
          media_url: string
          reactions?: Json | null
          user_id: string
          views_count?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          duration?: number | null
          expires_at?: string
          id?: string
          media_type?: string
          media_url?: string
          reactions?: Json | null
          user_id?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "stories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      story_views: {
        Row: {
          id: string
          story_id: string
          viewed_at: string
          viewer_id: string
        }
        Insert: {
          id?: string
          story_id: string
          viewed_at?: string
          viewer_id: string
        }
        Update: {
          id?: string
          story_id?: string
          viewed_at?: string
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_views_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          admin_notes: string | null
          category: string
          created_at: string
          email: string | null
          id: string
          message: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          subject: string
          updated_at: string
          user_feedback: string | null
          user_id: string | null
          user_rating: number | null
        }
        Insert: {
          admin_notes?: string | null
          category: string
          created_at?: string
          email?: string | null
          id?: string
          message: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_feedback?: string | null
          user_id?: string | null
          user_rating?: number | null
        }
        Update: {
          admin_notes?: string | null
          category?: string
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_feedback?: string | null
          user_id?: string | null
          user_rating?: number | null
        }
        Relationships: []
      }
      swipe_history: {
        Row: {
          action: string
          created_at: string
          id: string
          rewound: boolean
          swiped_profile_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          rewound?: boolean
          swiped_profile_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          rewound?: boolean
          swiped_profile_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipe_history_swiped_profile_id_fkey"
            columns: ["swiped_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipe_history_swiped_profile_id_fkey"
            columns: ["swiped_profile_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipe_history_swiped_profile_id_fkey"
            columns: ["swiped_profile_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          created_at: string
          id: string
          metric_data: Json
          metric_type: string
          severity: string | null
          timestamp: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_data?: Json
          metric_type: string
          severity?: string | null
          timestamp?: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_data?: Json
          metric_type?: string
          severity?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      typing_status: {
        Row: {
          conversation_id: string
          id: string
          is_typing: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          is_typing?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          is_typing?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_coins: {
        Row: {
          balance: number
          id: string
          total_earned: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          id?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          id?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_coins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_coins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_coins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      user_engagement: {
        Row: {
          conversations: number
          created_at: string | null
          date: string
          id: number
          likes: number
          matches: number
          trend: string | null
          users: number
          views: number
        }
        Insert: {
          conversations?: number
          created_at?: string | null
          date: string
          id?: number
          likes?: number
          matches?: number
          trend?: string | null
          users?: number
          views?: number
        }
        Update: {
          conversations?: number
          created_at?: string | null
          date?: string
          id?: number
          likes?: number
          matches?: number
          trend?: string | null
          users?: number
          views?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          notifications_comments: boolean | null
          notifications_email: boolean | null
          notifications_events: boolean | null
          notifications_follows: boolean | null
          notifications_groups: boolean | null
          notifications_likes: boolean | null
          notifications_marketing: boolean | null
          notifications_matches: boolean | null
          notifications_mentions: boolean | null
          notifications_messages: boolean | null
          notifications_profile_views: boolean | null
          notifications_push: boolean | null
          notifications_sms: boolean | null
          privacy_discoverable: boolean | null
          privacy_location_sharing: string | null
          privacy_message_privacy: string | null
          privacy_profile_visibility: string | null
          privacy_read_receipts: boolean | null
          privacy_show_age: boolean | null
          privacy_show_distance: boolean | null
          privacy_show_last_active: boolean | null
          privacy_show_online: boolean | null
          privacy_show_online_status: boolean | null
          privacy_show_profile_views: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notifications_comments?: boolean | null
          notifications_email?: boolean | null
          notifications_events?: boolean | null
          notifications_follows?: boolean | null
          notifications_groups?: boolean | null
          notifications_likes?: boolean | null
          notifications_marketing?: boolean | null
          notifications_matches?: boolean | null
          notifications_mentions?: boolean | null
          notifications_messages?: boolean | null
          notifications_profile_views?: boolean | null
          notifications_push?: boolean | null
          notifications_sms?: boolean | null
          privacy_discoverable?: boolean | null
          privacy_location_sharing?: string | null
          privacy_message_privacy?: string | null
          privacy_profile_visibility?: string | null
          privacy_read_receipts?: boolean | null
          privacy_show_age?: boolean | null
          privacy_show_distance?: boolean | null
          privacy_show_last_active?: boolean | null
          privacy_show_online?: boolean | null
          privacy_show_online_status?: boolean | null
          privacy_show_profile_views?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notifications_comments?: boolean | null
          notifications_email?: boolean | null
          notifications_events?: boolean | null
          notifications_follows?: boolean | null
          notifications_groups?: boolean | null
          notifications_likes?: boolean | null
          notifications_marketing?: boolean | null
          notifications_matches?: boolean | null
          notifications_mentions?: boolean | null
          notifications_messages?: boolean | null
          notifications_profile_views?: boolean | null
          notifications_push?: boolean | null
          notifications_sms?: boolean | null
          privacy_discoverable?: boolean | null
          privacy_location_sharing?: string | null
          privacy_message_privacy?: string | null
          privacy_profile_visibility?: string | null
          privacy_read_receipts?: boolean | null
          privacy_show_age?: boolean | null
          privacy_show_distance?: boolean | null
          privacy_show_last_active?: boolean | null
          privacy_show_online?: boolean | null
          privacy_show_online_status?: boolean | null
          privacy_show_profile_views?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          subscription_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          subscription_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          subscription_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_requests: {
        Row: {
          created_at: string
          document_url: string | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          selfie_url: string | null
          status: string
          submitted_at: string
          updated_at: string
          user_id: string
          verification_type: string
        }
        Insert: {
          created_at?: string
          document_url?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id: string
          verification_type: string
        }
        Update: {
          created_at?: string
          document_url?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id?: string
          verification_type?: string
        }
        Relationships: []
      }
      video_verifications: {
        Row: {
          confidence_score: number | null
          created_at: string
          expires_at: string | null
          id: string
          rejection_reason: string | null
          status: string
          thumbnail_url: string | null
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
          video_url: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          expires_at?: string | null
          id?: string
          rejection_reason?: string | null
          status?: string
          thumbnail_url?: string | null
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
          video_url: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          expires_at?: string | null
          id?: string
          rejection_reason?: string | null
          status?: string
          thumbnail_url?: string | null
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_verifications_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_verifications_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "user_public_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_verifications_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "user_public_view"
            referencedColumns: ["id"]
          },
        ]
      }
      virtual_gifts: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string | null
          emoji: string
          id: string
          is_premium: boolean
          name: string
          price_coins: number
          sort_order: number
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string | null
          emoji?: string
          id?: string
          is_premium?: boolean
          name: string
          price_coins?: number
          sort_order?: number
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string | null
          emoji?: string
          id?: string
          is_premium?: boolean
          name?: string
          price_coins?: number
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      user_public_profile: {
        Row: {
          age: number | null
          bio: string | null
          blur_photos: boolean | null
          created_at: string | null
          dating_profile_visible: boolean | null
          gender: string | null
          hobbies: string[] | null
          id: string | null
          interests: string[] | null
          languages: string[] | null
          last_active: string | null
          name: string | null
          occupation: string | null
          profile_image: string | null
          relationship_goals: string | null
          verified: boolean | null
          video_verified: boolean | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          blur_photos?: boolean | null
          created_at?: string | null
          dating_profile_visible?: boolean | null
          gender?: string | null
          hobbies?: string[] | null
          id?: string | null
          interests?: string[] | null
          languages?: string[] | null
          last_active?: string | null
          name?: string | null
          occupation?: string | null
          profile_image?: string | null
          relationship_goals?: string | null
          verified?: boolean | null
          video_verified?: boolean | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          blur_photos?: boolean | null
          created_at?: string | null
          dating_profile_visible?: boolean | null
          gender?: string | null
          hobbies?: string[] | null
          id?: string | null
          interests?: string[] | null
          languages?: string[] | null
          last_active?: string | null
          name?: string | null
          occupation?: string | null
          profile_image?: string | null
          relationship_goals?: string | null
          verified?: boolean | null
          video_verified?: boolean | null
        }
        Relationships: []
      }
      user_public_view: {
        Row: {
          age: number | null
          bio: string | null
          gender: string | null
          hobbies: string[] | null
          id: string | null
          interests: string[] | null
          kurdistan_region: string | null
          languages: string[] | null
          location: string | null
          name: string | null
          occupation: string | null
          profile_image: string | null
          verified: boolean | null
        }
        Insert: {
          age?: number | null
          bio?: string | null
          gender?: string | null
          hobbies?: string[] | null
          id?: string | null
          interests?: string[] | null
          kurdistan_region?: string | null
          languages?: string[] | null
          location?: string | null
          name?: string | null
          occupation?: string | null
          profile_image?: string | null
          verified?: boolean | null
        }
        Update: {
          age?: number | null
          bio?: string | null
          gender?: string | null
          hobbies?: string[] | null
          id?: string | null
          interests?: string[] | null
          kurdistan_region?: string | null
          languages?: string[] | null
          location?: string | null
          name?: string | null
          occupation?: string | null
          profile_image?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      calculate_compatibility: {
        Args: { user1_uuid: string; user2_uuid: string }
        Returns: number
      }
      can_perform_action:
        | { Args: { action_type: string }; Returns: Record<string, unknown> }
        | {
            Args: { action_type: string; user_uuid: string }
            Returns: Record<string, unknown>
          }
      check_email_exists: { Args: { email_to_check: string }; Returns: boolean }
      cleanup_dead_push_subscriptions: { Args: never; Returns: number }
      cleanup_expired_video_verifications: { Args: never; Returns: number }
      cleanup_old_typing_status: { Args: never; Returns: undefined }
      create_demo_profile: {
        Args: {
          user_age: number
          user_gender: string
          user_id: string
          user_location: string
          user_name: string
          user_occupation: string
          user_profile_image?: string
        }
        Returns: string
      }
      create_dummy_auth_user: {
        Args: { email: string; user_uuid: string }
        Returns: Json
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      enrich_all_profiles_with_kurdish_data: { Args: never; Returns: number }
      enrich_profiles_with_test_data: { Args: never; Returns: number }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      generate_sample_posts: { Args: never; Returns: number }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_notification_counts: {
        Args: { user_uuid: string }
        Returns: {
          new_likes: number
          new_matches: number
          new_views: number
          unread_messages: number
        }[]
      }
      get_or_create_daily_usage: {
        Args: { user_uuid: string }
        Returns: {
          boosts_count: number
          created_at: string
          date: string
          id: string
          likes_count: number
          rewinds_count: number
          super_likes_count: number
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "daily_usage"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_user_trust_score: {
        Args: { target_user_id: string }
        Returns: {
          is_verified: boolean
          is_video_verified: boolean
          severe_flags: number
          total_flags: number
          trust_score: number
        }[]
      }
      gettransactionid: { Args: never; Returns: unknown }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
      increment_usage_count: {
        Args: { action_type: string; user_uuid: string }
        Returns: boolean
      }
      insert_encrypted_payment: {
        Args: {
          p_amount: number
          p_currency: string
          p_description?: string
          p_metadata?: Json
          p_payment_method: string
          p_status: string
          p_stripe_customer_id: string
          p_stripe_payment_intent_id: string
          p_subscription_type?: string
          p_user_id: string
        }
        Returns: string
      }
      is_group_admin: {
        Args: { group_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_group_member: {
        Args: { p_group_id: string; p_user_id: string }
        Returns: boolean
      }
      is_profile_complete: { Args: { profile_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
      is_user_blocked: { Args: { target_user_id: string }; Returns: boolean }
      longtransactionsenabled: { Args: never; Returns: boolean }
      nearby_users: {
        Args: {
          current_lat: number
          current_long: number
          max_results?: number
          radius_km?: number
        }
        Returns: {
          age: number
          distance_km: number
          id: string
          latitude: number
          location: string
          longitude: number
          name: string
          profile_image: string
        }[]
      }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      search_profiles_fts: {
        Args: { search_query: string }
        Returns: {
          age: number
          bio: string
          blur_photos: boolean | null
          body_type: string
          career_ambitions: string | null
          charity_involvement: string | null
          children_status: string | null
          communication_style: string | null
          company: string | null
          created_at: string | null
          creative_pursuits: string[] | null
          dating_profile_visible: boolean | null
          decision_making_style: string | null
          dietary_preferences: string | null
          dream_home: string | null
          dream_vacation: string | null
          drinking: string | null
          education: string
          ethnicity: string
          evening_routine: string | null
          exercise_habits: string
          family_closeness: string | null
          favorite_books: string[] | null
          favorite_foods: string[] | null
          favorite_games: string[] | null
          favorite_memory: string | null
          favorite_movies: string[] | null
          favorite_music: string[] | null
          favorite_podcasts: string[] | null
          favorite_quote: string | null
          favorite_season: string | null
          financial_habits: string | null
          friendship_style: string | null
          gender: string | null
          geo_location: unknown
          growth_goals: string[] | null
          have_pets: string | null
          height: string
          hidden_talents: string[] | null
          hobbies: string[] | null
          id: string
          ideal_date: string | null
          ideal_weather: string | null
          interests: string[] | null
          kurdistan_region: string
          languages: string[] | null
          last_active: string | null
          latitude: number | null
          location: string
          longitude: number | null
          love_language: string | null
          morning_routine: string | null
          music_instruments: string[] | null
          name: string
          notification_preferences: Json | null
          occupation: string
          personality_type: string | null
          pet_peeves: string[] | null
          phone_number: string | null
          phone_verified: boolean | null
          political_views: string | null
          profile_image: string
          relationship_goals: string
          religion: string
          sleep_schedule: string | null
          smoking: string | null
          stress_relievers: string[] | null
          tech_skills: string[] | null
          transportation_preference: string | null
          travel_frequency: string | null
          travel_location: string | null
          travel_mode_active: boolean
          values: string[] | null
          verified: boolean | null
          video_verified: boolean | null
          video_verified_at: string | null
          want_children: string
          weekend_activities: string[] | null
          work_environment: string | null
          work_life_balance: string | null
          zodiac_sign: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
    Enums: {
      app_role: ["super_admin", "admin", "moderator", "user"],
    },
  },
} as const
