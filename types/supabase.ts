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
          hammer_team_id: number | null
          id: number
          points_scored: number | null
          scoring_team_id: number | null
        }
        Insert: {
          created_at?: string | null
          end_number?: number
          game_id: number
          hammer_team_id?: number | null
          id?: number
          points_scored?: number | null
          scoring_team_id?: number | null
        }
        Update: {
          created_at?: string | null
          end_number?: number
          game_id?: number
          hammer_team_id?: number | null
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
            foreignKeyName: "ends_hammer_team_id_fkey"
            columns: ["hammer_team_id"]
            referencedRelation: "teams"
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
      friends: {
        Row: {
          created_at: string | null
          id: number
          profile_id_1: string | null
          profile_id_2: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          profile_id_1?: string | null
          profile_id_2?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          profile_id_1?: string | null
          profile_id_2?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friends_profile_id_1_fkey"
            columns: ["profile_id_1"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_profile_id_2_fkey"
            columns: ["profile_id_2"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      games: {
        Row: {
          away: number | null
          away_color: string | null
          completed: boolean | null
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
          completed?: boolean | null
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
          completed?: boolean | null
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
      player_game_junction: {
        Row: {
          away_fourth_id: number | null
          away_lead_id: number | null
          away_second_id: number | null
          away_skip_id: number | null
          away_third_id: number | null
          created_at: string | null
          game_id: number | null
          home_fourth_id: number | null
          home_lead_id: number | null
          home_second_id: number | null
          home_skip_id: number | null
          home_third_id: number | null
          id: number
        }
        Insert: {
          away_fourth_id?: number | null
          away_lead_id?: number | null
          away_second_id?: number | null
          away_skip_id?: number | null
          away_third_id?: number | null
          created_at?: string | null
          game_id?: number | null
          home_fourth_id?: number | null
          home_lead_id?: number | null
          home_second_id?: number | null
          home_skip_id?: number | null
          home_third_id?: number | null
          id?: number
        }
        Update: {
          away_fourth_id?: number | null
          away_lead_id?: number | null
          away_second_id?: number | null
          away_skip_id?: number | null
          away_third_id?: number | null
          created_at?: string | null
          game_id?: number | null
          home_fourth_id?: number | null
          home_lead_id?: number | null
          home_second_id?: number | null
          home_skip_id?: number | null
          home_third_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_game_junction_away_fourth_id_fkey"
            columns: ["away_fourth_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_game_junction_away_lead_id_fkey"
            columns: ["away_lead_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_game_junction_away_second_id_fkey"
            columns: ["away_second_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_game_junction_away_skip_id_fkey"
            columns: ["away_skip_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_game_junction_away_third_id_fkey"
            columns: ["away_third_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_game_junction_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_game_junction_home_fourth_id_fkey"
            columns: ["home_fourth_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_game_junction_home_lead_id_fkey"
            columns: ["home_lead_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_game_junction_home_second_id_fkey"
            columns: ["home_second_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_game_junction_home_skip_id_fkey"
            columns: ["home_skip_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_game_junction_home_third_id_fkey"
            columns: ["home_third_id"]
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
      players: {
        Row: {
          avatar: Json | null
          created_at: string | null
          id: number
          name: string | null
          profile_id: string | null
          profile_id_for_player: string | null
        }
        Insert: {
          avatar?: Json | null
          created_at?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
          profile_id_for_player?: string | null
        }
        Update: {
          avatar?: Json | null
          created_at?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
          profile_id_for_player?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_profile_id_for_player_fkey"
            columns: ["profile_id_for_player"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          friend_id: string | null
          id: string
          last_name: string | null
          player_id: number | null
          timezone: string | null
          username: string
          profile_search: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          friend_id?: string | null
          id: string
          last_name?: string | null
          player_id?: number | null
          timezone?: string | null
          username?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          friend_id?: string | null
          id?: string
          last_name?: string | null
          player_id?: number | null
          timezone?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "players"
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
          created_at: string | null
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
          created_at?: string | null
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
          created_at?: string | null
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
          Code: string | null
          id: number
          is_global: boolean | null
          name: string | null
          profile_id: string | null
          shot_type: Database["public"]["Enums"]["shot_type_enum"] | null
        }
        Insert: {
          Code?: string | null
          id?: number
          is_global?: boolean | null
          name?: string | null
          profile_id?: string | null
          shot_type?: Database["public"]["Enums"]["shot_type_enum"] | null
        }
        Update: {
          Code?: string | null
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
      team_profile_junction: {
        Row: {
          created_at: string | null
          id: number
          profile_id: string
          team_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          profile_id: string
          team_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          profile_id?: string
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_profile_junction_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_profile_junction_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      team_requests: {
        Row: {
          created_at: string | null
          id: number
          requestee_profile_id: string | null
          requester_profile_id: string | null
          status: string | null
          team_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          requestee_profile_id?: string | null
          requester_profile_id?: string | null
          status?: string | null
          team_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          requestee_profile_id?: string | null
          requester_profile_id?: string | null
          status?: string | null
          team_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_requests_requestee_profile_id_fkey"
            columns: ["requestee_profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_requests_requester_profile_id_fkey"
            columns: ["requester_profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_requests_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
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
          skip_id: number | null
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
          skip_id?: number | null
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
          skip_id?: number | null
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
            foreignKeyName: "teams_skip_id_fkey"
            columns: ["skip_id"]
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
      calculate_averages: {
        Args: {
          player_id_param: number
        }
        Returns: {
          avg_score: number
          avg_inturn: number
          avg_outturn: number
          avg_draw: number
          avg_hit: number
        }[]
      }
      delete_avatar: {
        Args: {
          avatar_url: string
        }
        Returns: Record<string, unknown>
      }
      delete_storage_object: {
        Args: {
          bucket: string
          object: string
        }
        Returns: Record<string, unknown>
      }
      gen_random_text: {
        Args: {
          length: number
        }
        Returns: string
      }
      get_columns: {
        Args: {
          tablename: string
        }
        Returns: {
          column_name: string
          data_type: string
        }[]
      }
      get_game_stats: {
        Args: {
          game_id_param: number
        }
        Returns: Record<string, unknown>[]
      }
      get_games: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>[]
      }
      get_profile:
        | {
            Args: Record<PropertyKey, never>
            Returns: Record<string, unknown>
          }
        | {
            Args: {
              profile_id_param: string
            }
            Returns: Record<string, unknown>
          }
      get_shot_averages_player: {
        Args: {
          player_id_param: number
        }
        Returns: {
          avg_score: number
          avg_inturn: number
          avg_outturn: number
          avg_draw: number
          avg_hit: number
          avg_inside: number
          avg_onbroom: number
          avg_outside: number
          avg_inside_inturn: number
          avg_onbroom_inturn: number
          avg_outside_inturn: number
          avg_inside_outturn: number
          avg_onbroom_outturn: number
          avg_outside_outturn: number
          avg_inside_draw: number
          avg_onbroom_draw: number
          avg_outside_draw: number
          avg_inside_hit: number
          avg_onbroom_hit: number
          avg_outside_hit: number
        }[]
      }
      get_shot_averages_player_for_game: {
        Args: {
          team_id_param: number
          game_id_param: number
        }
        Returns: {
          avg_score: number
          avg_inturn: number
          avg_outturn: number
          avg_draw: number
          avg_hit: number
          avg_inside: number
          avg_onbroom: number
          avg_outside: number
          avg_inside_inturn: number
          avg_onbroom_inturn: number
          avg_outside_inturn: number
          avg_inside_outturn: number
          avg_onbroom_outturn: number
          avg_outside_outturn: number
          avg_inside_draw: number
          avg_onbroom_draw: number
          avg_outside_draw: number
          avg_inside_hit: number
          avg_onbroom_hit: number
          avg_outside_hit: number
        }[]
      }
      get_shot_averages_team: {
        Args: {
          team_id_param: number
        }
        Returns: {
          avg_score: number
          avg_inturn: number
          avg_outturn: number
          avg_draw: number
          avg_hit: number
          avg_inside: number
          avg_onbroom: number
          avg_outside: number
          avg_inside_inturn: number
          avg_onbroom_inturn: number
          avg_outside_inturn: number
          avg_inside_outturn: number
          avg_onbroom_outturn: number
          avg_outside_outturn: number
          avg_inside_draw: number
          avg_onbroom_draw: number
          avg_outside_draw: number
          avg_inside_hit: number
          avg_onbroom_hit: number
          avg_outside_hit: number
        }[]
      }
      get_shot_averages_team_for_game: {
        Args: {
          team_id_param: number
          game_id_param: number
        }
        Returns: {
          avg_score: number
          avg_inturn: number
          avg_outturn: number
          avg_draw: number
          avg_hit: number
          avg_inside: number
          avg_onbroom: number
          avg_outside: number
          avg_inside_inturn: number
          avg_onbroom_inturn: number
          avg_outside_inturn: number
          avg_inside_outturn: number
          avg_onbroom_outturn: number
          avg_outside_outturn: number
          avg_inside_draw: number
          avg_onbroom_draw: number
          avg_outside_draw: number
          avg_inside_hit: number
          avg_onbroom_hit: number
          avg_outside_hit: number
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
      get_team_averages: {
        Args: {
          team_id_param: number
        }
        Returns: {
          average_score: number
          average_score_inturn: number
          average_score_outturn: number
          average_score_draw: number
          average_score_hit: number
        }[]
      }
      get_team_detailed: {
        Args: {
          team_id_param: number
        }
        Returns: {
          id: number
          name: string
          profile_id: string
          wins: number
          losses: number
          ties: number
          total_points: number
          total_ends_played: number
          hammer_ends_count: number
          hammer_steal_count: number
          hammer_blank_count: number
          hammer_1_point_count: number
          hammer_2_point_count: number
          hammer_3_point_count: number
          hammer_4_point_count: number
          hammer_5_point_count: number
          hammer_6_point_count: number
          hammer_7_point_count: number
          hammer_8_point_count: number
          stolen_end_count: number
          forced_end_count: number
          avg_points_conceded: number
          lead_player_id: number
          lead_player_name: string
          lead_player_avatar: Json
          second_player_id: number
          second_player_name: string
          second_player_avatar: Json
          third_player_id: number
          third_player_name: string
          third_player_avatar: Json
          fourth_player_id: number
          fourth_player_name: string
          fourth_player_avatar: Json
          fifth_player_id: number
          fifth_player_name: string
          fifth_player_avatar: Json
          sixth_player_id: number
          sixth_player_name: string
          sixth_player_avatar: Json
          seventh_player_id: number
          seventh_player_name: string
          seventh_player_avatar: Json
          team_avg: number
        }[]
      }
      get_team_request_count_to_respond: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_team_requests: {
        Args: Record<PropertyKey, never>
        Returns: {
          team_name: string
          status: string
          created_at: string
          role: string
          requestee_username: string
          requestee_avatar: Json
          requester_username: string
          requester_avatar: Json
        }[]
      }
      get_team_stats: {
        Args: {
          team_id_param: number
        }
        Returns: Record<string, unknown>[]
      }
      get_team_wins: {
        Args: {
          team_id_param: number
        }
        Returns: Record<string, unknown>
      }
      get_teams_basic: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          created_at: string
          profile_id: string
          skip_id: number
          name: string
          lead_player_id: Json
          second_player_id: Json
          third_player_id: Json
          fourth_player_id: Json
          fifth_player_id: Json
          sixth_player_id: Json
          seventh_player_id: Json
          status: string
          subject: string
          requester_id: string
        }[]
      }
      get_teams_detailed: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          name: string
          profile_id: string
          wins: number
          losses: number
          ties: number
          total_points: number
          total_ends_played: number
          hammer_ends_count: number
          hammer_steal_count: number
          hammer_blank_count: number
          hammer_1_point_count: number
          hammer_2_point_count: number
          hammer_3_point_count: number
          hammer_4_point_count: number
          hammer_5_point_count: number
          hammer_6_point_count: number
          hammer_7_point_count: number
          hammer_8_point_count: number
          stolen_end_count: number
          forced_end_count: number
          avg_points_conceded: number
          lead_player_id: number
          lead_player_name: string
          lead_player_avatar: Json
          second_player_id: number
          second_player_name: string
          second_player_avatar: Json
          third_player_id: number
          third_player_name: string
          third_player_avatar: Json
          fourth_player_id: number
          fourth_player_name: string
          fourth_player_avatar: Json
          fifth_player_id: number
          fifth_player_name: string
          fifth_player_avatar: Json
          sixth_player_id: number
          sixth_player_name: string
          sixth_player_avatar: Json
          seventh_player_id: number
          seventh_player_name: string
          seventh_player_avatar: Json
          team_avg: number
        }[]
      }
      get_teams_details: {
        Args: Record<PropertyKey, never>
        Returns: {
          team_id: number
          name: string
          wins: number
          losses: number
          ties: number
          total_points: number
          total_ends_played: number
          hammer_ends_count: number
          hammer_steal_count: number
          hammer_blank_count: number
          hammer_1_point_count: number
          hammer_2_point_count: number
          hammer_3_point_count: number
          hammer_4_point_count: number
          hammer_5_point_count: number
          hammer_6_point_count: number
          hammer_7_point_count: number
          hammer_8_point_count: number
          stolen_end_count: number
          forced_end_count: number
          avg_points_conceded: number
        }[]
      }
      has_access_to_resource: {
        Args: {
          current_profile_id: string
          player_profile_id: string
        }
        Returns: boolean
      }
      profile_search: {
        Args: {
          "": unknown
        }
        Returns: string
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
