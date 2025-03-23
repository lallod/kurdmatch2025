export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          change_percentage: number | null
          created_at: string | null
          icon: string | null
          id: number
          stat_name: string
          stat_value: number
          trend: string | null
          updated_at: string | null
        }
        Insert: {
          change_percentage?: number | null
          created_at?: string | null
          icon?: string | null
          id?: number
          stat_name: string
          stat_value: number
          trend?: string | null
          updated_at?: string | null
        }
        Update: {
          change_percentage?: number | null
          created_at?: string | null
          icon?: string | null
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
          bio: string | null
          body_type: string | null
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
          education: string | null
          ethnicity: string | null
          evening_routine: string | null
          exercise_habits: string | null
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
          growth_goals: string[] | null
          have_pets: string | null
          height: string | null
          hidden_talents: string[] | null
          hobbies: string[] | null
          id: string
          ideal_date: string | null
          ideal_weather: string | null
          interests: string[] | null
          kurdistan_region: string | null
          languages: string[] | null
          last_active: string | null
          location: string
          love_language: string | null
          morning_routine: string | null
          music_instruments: string[] | null
          name: string
          occupation: string | null
          personality_type: string | null
          pet_peeves: string[] | null
          political_views: string | null
          profile_image: string | null
          relationship_goals: string | null
          religion: string | null
          sleep_schedule: string | null
          smoking: string | null
          stress_relievers: string[] | null
          tech_skills: string[] | null
          transportation_preference: string | null
          travel_frequency: string | null
          values: string[] | null
          verified: boolean | null
          want_children: string | null
          weekend_activities: string[] | null
          work_environment: string | null
          work_life_balance: string | null
          zodiac_sign: string | null
        }
        Insert: {
          age: number
          bio?: string | null
          body_type?: string | null
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
          education?: string | null
          ethnicity?: string | null
          evening_routine?: string | null
          exercise_habits?: string | null
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
          growth_goals?: string[] | null
          have_pets?: string | null
          height?: string | null
          hidden_talents?: string[] | null
          hobbies?: string[] | null
          id: string
          ideal_date?: string | null
          ideal_weather?: string | null
          interests?: string[] | null
          kurdistan_region?: string | null
          languages?: string[] | null
          last_active?: string | null
          location: string
          love_language?: string | null
          morning_routine?: string | null
          music_instruments?: string[] | null
          name: string
          occupation?: string | null
          personality_type?: string | null
          pet_peeves?: string[] | null
          political_views?: string | null
          profile_image?: string | null
          relationship_goals?: string | null
          religion?: string | null
          sleep_schedule?: string | null
          smoking?: string | null
          stress_relievers?: string[] | null
          tech_skills?: string[] | null
          transportation_preference?: string | null
          travel_frequency?: string | null
          values?: string[] | null
          verified?: boolean | null
          want_children?: string | null
          weekend_activities?: string[] | null
          work_environment?: string | null
          work_life_balance?: string | null
          zodiac_sign?: string | null
        }
        Update: {
          age?: number
          bio?: string | null
          body_type?: string | null
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
          education?: string | null
          ethnicity?: string | null
          evening_routine?: string | null
          exercise_habits?: string | null
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
          growth_goals?: string[] | null
          have_pets?: string | null
          height?: string | null
          hidden_talents?: string[] | null
          hobbies?: string[] | null
          id?: string
          ideal_date?: string | null
          ideal_weather?: string | null
          interests?: string[] | null
          kurdistan_region?: string | null
          languages?: string[] | null
          last_active?: string | null
          location?: string
          love_language?: string | null
          morning_routine?: string | null
          music_instruments?: string[] | null
          name?: string
          occupation?: string | null
          personality_type?: string | null
          pet_peeves?: string[] | null
          political_views?: string | null
          profile_image?: string | null
          relationship_goals?: string | null
          religion?: string | null
          sleep_schedule?: string | null
          smoking?: string | null
          stress_relievers?: string[] | null
          tech_skills?: string[] | null
          transportation_preference?: string | null
          travel_frequency?: string | null
          values?: string[] | null
          verified?: boolean | null
          want_children?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
