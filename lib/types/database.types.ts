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
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
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
      }
    }
  }
}
