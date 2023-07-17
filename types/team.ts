import {BasicPlayer} from '@/types/player'
export interface BasicTeam {
  id?: number;
  name: string | null;
}

export enum TeamPlayers {
  LEAD = "lead_player_id",
  SECOND = "second_player_id",
  THIRD = "third_player_id",
  FOURTH = "fourth_player_id",
  FIFTH = "fifth_player_id",
  SIXTH = "sixth_player_id",
  SEVENTH = "seventh_player_id"

}
interface Team extends BasicTeam {
  created_at?: string | null;
  [TeamPlayers.FIFTH]: BasicPlayer | null
  [TeamPlayers.FOURTH]: BasicPlayer | null
  [TeamPlayers.LEAD]: BasicPlayer | null
  profile_id?: string | null;
  [TeamPlayers.SECOND]: BasicPlayer | null
  [TeamPlayers.SEVENTH]: BasicPlayer | null
  [TeamPlayers.SIXTH]: BasicPlayer | null
  [TeamPlayers.THIRD]: BasicPlayer | null
}
export default Team
