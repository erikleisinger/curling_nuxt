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
      ends: {
        Row: {
          created_at: string | null
          end_number: number
          game_id: number
          id: number
          points_scored: number | null
          scoring_team_id: number | null
        }
        Insert: {
          created_at?: string | null
          end_number?: number
          game_id: number
          id?: number
          points_scored?: number | null
          scoring_team_id?: number | null
        }
        Update: {
          created_at?: string | null
          end_number?: number
          game_id?: number
          id?: number
          points_scored?: number | null
          scoring_team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ends_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ends_scoring_team_id_fkey"
            columns: ["scoring_team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
          profile_id: string | null
          rink_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
          rink_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
          rink_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_rink_id_fkey"
            columns: ["rink_id"]
            referencedRelation: "rinks"
            referencedColumns: ["id"]
          }
        ]
      }
      games: {
        Row: {
          away: number | null
          away_color: string | null
          created_at: string | null
          hammer_first_end: number | null
          home: number | null
          home_color: string | null
          id: number
          name: string | null
          profile_id: string | null
          rink_id: number | null
          sheet_id: number | null
          start_time: string | null
        }
        Insert: {
          away?: number | null
          away_color?: string | null
          created_at?: string | null
          hammer_first_end?: number | null
          home?: number | null
          home_color?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
          rink_id?: number | null
          sheet_id?: number | null
          start_time?: string | null
        }
        Update: {
          away?: number | null
          away_color?: string | null
          created_at?: string | null
          hammer_first_end?: number | null
          home?: number | null
          home_color?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
          rink_id?: number | null
          sheet_id?: number | null
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
            foreignKeyName: "games_hammer_first_end_fkey"
            columns: ["hammer_first_end"]
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
          },
          {
            foreignKeyName: "games_rink_id_fkey"
            columns: ["rink_id"]
            referencedRelation: "rinks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_sheet_id_fkey"
            columns: ["sheet_id"]
            referencedRelation: "sheets"
            referencedColumns: ["id"]
          }
        ]
      }
      players: {
        Row: {
          id: number
          name: string | null
          profile_id: string | null
        }
        Insert: {
          id?: number
          name?: string | null
          profile_id?: string | null
        }
        Update: {
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
          timezone: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          timezone?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          timezone?: string | null
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
      rinks: {
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
            foreignKeyName: "rinks_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      rocks: {
        Row: {
          color: string | null
          created_at: string | null
          id: number
          notes: string | null
          number: number | null
          profile_id: string | null
          sheet_id: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: number
          notes?: string | null
          number?: number | null
          profile_id?: string | null
          sheet_id?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: number
          notes?: string | null
          number?: number | null
          profile_id?: string | null
          sheet_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rocks_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rocks_sheet_id_fkey"
            columns: ["sheet_id"]
            referencedRelation: "sheets"
            referencedColumns: ["id"]
          }
        ]
      }
      sheets: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
          profile_id: string | null
          rink_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
          rink_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
          rink_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sheets_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sheets_rink_id_fkey"
            columns: ["rink_id"]
            referencedRelation: "rinks"
            referencedColumns: ["id"]
          }
        ]
      }
      shots: {
        Row: {
          end_id: number
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
          end_id: number
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
          end_id?: number
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
          is_global: boolean | null
          name: string | null
          profile_id: string | null
          shot_type: Database["public"]["Enums"]["shot_type_enum"] | null
        }
        Insert: {
          id?: number
          is_global?: boolean | null
          name?: string | null
          profile_id?: string | null
          shot_type?: Database["public"]["Enums"]["shot_type_enum"] | null
        }
        Update: {
          id?: number
          is_global?: boolean | null
          name?: string | null
          profile_id?: string | null
          shot_type?: Database["public"]["Enums"]["shot_type_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "shottypes_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
      get_games: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>[]
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
      shot_type_enum: "Draw" | "Hit"
    }
    CompositeTypes: {
      team_info: {
        id: number
        name: string
      }
    }
  }
}
