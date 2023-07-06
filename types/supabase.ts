export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface DatabaseSchema {
  public: {
    Tables: {
      ends: {
        Row: {
          created_at: string | null
          end_number: number | null
          game_id: number | null
          id: number
        }
        Insert: {
          created_at?: string | null
          end_number?: number | null
          game_id?: number | null
          id?: number
        }
        Update: {
          created_at?: string | null
          end_number?: number | null
          game_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ends_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          }
        ]
      }
      games: {
        Row: {
          away: number | null
          created_at: string | null
          home: number | null
          id: number
          name: string | null
          profile_id: string | null
          start_time: string | null
        }
        Insert: {
          away?: number | null
          created_at?: string | null
          home?: number | null
          id?: number
          name?: string | null
          profile_id?: string | null
          start_time?: string | null
        }
        Update: {
          away?: number | null
          created_at?: string | null
          home?: number | null
          id?: number
          name?: string | null
          profile_id?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_away_fkey"
            columns: ["away"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_home_fkey"
            columns: ["home"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      players: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      shots: {
        Row: {
          end_id: number | null
          id: number
          line: number | null
          notes: string | null
          player_id: number | null
          rock_positions: Json
          score: number | null
          shot_no: number | null
          turn: number | null
          type_id: number | null
        }
        Insert: {
          end_id?: number | null
          id?: number
          line?: number | null
          notes?: string | null
          player_id?: number | null
          rock_positions?: Json
          score?: number | null
          shot_no?: number | null
          turn?: number | null
          type_id?: number | null
        }
        Update: {
          end_id?: number | null
          id?: number
          line?: number | null
          notes?: string | null
          player_id?: number | null
          rock_positions?: Json
          score?: number | null
          shot_no?: number | null
          turn?: number | null
          type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shots_end_id_fkey"
            columns: ["end_id"]
            referencedRelation: "ends"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shots_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shots_type_id_fkey"
            columns: ["type_id"]
            referencedRelation: "shottypes"
            referencedColumns: ["id"]
          }
        ]
      }
      shottypes: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string | null
          fifth_player_id: number | null
          fourth_player_id: number | null
          id: number
          lead_player_id: number | null
          name: string | null
          profile_id: string | null
          second_player_id: number | null
          seventh_player_id: number | null
          sixth_player_id: number | null
          third_player_id: number | null
        }
        Insert: {
          created_at?: string | null
          fifth_player_id?: number | null
          fourth_player_id?: number | null
          id?: number
          lead_player_id?: number | null
          name?: string | null
          profile_id?: string | null
          second_player_id?: number | null
          seventh_player_id?: number | null
          sixth_player_id?: number | null
          third_player_id?: number | null
        }
        Update: {
          created_at?: string | null
          fifth_player_id?: number | null
          fourth_player_id?: number | null
          id?: number
          lead_player_id?: number | null
          name?: string | null
          profile_id?: string | null
          second_player_id?: number | null
          seventh_player_id?: number | null
          sixth_player_id?: number | null
          third_player_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_fifth_player_id_fkey"
            columns: ["fifth_player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_fourth_player_id_fkey"
            columns: ["fourth_player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_lead_player_id_fkey"
            columns: ["lead_player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_second_player_id_fkey"
            columns: ["second_player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_seventh_player_id_fkey"
            columns: ["seventh_player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_sixth_player_id_fkey"
            columns: ["sixth_player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_third_player_id_fkey"
            columns: ["third_player_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_columns: {
        Args: {
          tablename: string
        }
        Returns: {
          column_name: string
          data_type: string
        }[]
      }
      get_table_info: {
        Args: {
          tablename: string
        }
        Returns: {
          column_name: string
          data_type: string
          foreign_key: string
        }[]
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
