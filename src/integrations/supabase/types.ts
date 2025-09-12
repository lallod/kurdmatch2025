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
            foreignKeyName: "likes_liker_id_fkey"
            columns: ["liker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string | null
          id: string
          read: boolean | null
          recipient_id: string | null
          sender_id: string | null
          text: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
          text: string
        }
        Update: {
          created_at?: string | null
          id?: string
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
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        ]
      }
      profiles: {
        Row: {
          age: number
          bio: string
          body_type: string
          career_ambitions: string | null
          charity_involvement: string | null
          children_status: string | null
          communication_style: string | null
          company: string | null
          created_at: string | null
          creative_pursuits: string[] | null
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
          location: string
          love_language: string | null
          morning_routine: string | null
          music_instruments: string[] | null
          name: string
          occupation: string
          personality_type: string | null
          pet_peeves: string[] | null
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
          values: string[] | null
          verified: boolean | null
          want_children: string
          weekend_activities: string[] | null
          work_environment: string | null
          work_life_balance: string | null
          zodiac_sign: string | null
        }
        Insert: {
          age: number
          bio?: string
          body_type?: string
          career_ambitions?: string | null
          charity_involvement?: string | null
          children_status?: string | null
          communication_style?: string | null
          company?: string | null
          created_at?: string | null
          creative_pursuits?: string[] | null
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
          location: string
          love_language?: string | null
          morning_routine?: string | null
          music_instruments?: string[] | null
          name: string
          occupation?: string
          personality_type?: string | null
          pet_peeves?: string[] | null
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
          values?: string[] | null
          verified?: boolean | null
          want_children?: string
          weekend_activities?: string[] | null
          work_environment?: string | null
          work_life_balance?: string | null
          zodiac_sign?: string | null
        }
        Update: {
          age?: number
          bio?: string
          body_type?: string
          career_ambitions?: string | null
          charity_involvement?: string | null
          children_status?: string | null
          communication_style?: string | null
          company?: string | null
          created_at?: string | null
          creative_pursuits?: string[] | null
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
          location?: string
          love_language?: string | null
          morning_routine?: string | null
          music_instruments?: string[] | null
          name?: string
          occupation?: string
          personality_type?: string | null
          pet_peeves?: string[] | null
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
          values?: string[] | null
          verified?: boolean | null
          want_children?: string
          weekend_activities?: string[] | null
          work_environment?: string | null
          work_life_balance?: string | null
          zodiac_sign?: string | null
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      enrich_all_profiles_with_kurdish_data: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      enrich_profiles_with_test_data: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      is_profile_complete: {
        Args: { profile_id: string }
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
