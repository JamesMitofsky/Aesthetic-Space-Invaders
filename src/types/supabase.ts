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
      topScores: {
        Row: {
          created_at: string
          id: number
          score: number
          username: string
        }
        Insert: {
          created_at?: string
          id?: number
          score: number
          username: string
        }
        Update: {
          created_at?: string
          id?: number
          score?: number
          username?: string
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
