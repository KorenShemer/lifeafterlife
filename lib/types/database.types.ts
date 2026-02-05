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
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          full_name: string | null
          phone: string | null
          date_of_birth: string | null
          bio: string | null
          avatar_url: string | null
          profile_completed: boolean
          onboarding_completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username?: string | null
          full_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          bio?: string | null
          avatar_url?: string | null
          profile_completed?: boolean
          onboarding_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          full_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          bio?: string | null
          avatar_url?: string | null
          profile_completed?: boolean
          onboarding_completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      recipients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipients_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      checkins: {
        Row: {
          id: string
          user_id: string
          checked_in_at: string
          method: string
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          checked_in_at?: string
          method: string
          status?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          checked_in_at?: string
          method?: string
          status?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkins_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      memories: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string | null
          media_url: string | null
          media_type: string | null
          scheduled_release_date: string | null
          is_released: boolean
          released_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: string | null
          media_url?: string | null
          media_type?: string | null
          scheduled_release_date?: string | null
          is_released?: boolean
          released_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string | null
          media_url?: string | null
          media_type?: string | null
          scheduled_release_date?: string | null
          is_released?: boolean
          released_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memories_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      memory_recipients: {
        Row: {
          memory_id: string
          recipient_id: string
          sent_at: string | null
        }
        Insert: {
          memory_id: string
          recipient_id: string
          sent_at?: string | null
        }
        Update: {
          memory_id?: string
          recipient_id?: string
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memory_recipients_memory_id_fkey"
            columns: ["memory_id"]
            referencedRelation: "memories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memory_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          }
        ]
      }
      user_settings: {
        Row: {
          user_id: string
          check_in_frequency: string
          grace_period: string
          notification_preferences: Json
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          check_in_frequency?: string
          grace_period?: string
          notification_preferences?: Json
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          check_in_frequency?: string
          grace_period?: string
          notification_preferences?: Json
          timezone?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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