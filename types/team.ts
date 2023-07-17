import {BasicPlayer} from '@/types/player'
export interface BasicTeam {
  id: number;
  name: string | null;
}
interface Team extends BasicTeam {
  created_at: string | null;
  fifth_player_id: BasicPlayer
  fourth_player_id: BasicPlayer
  lead_player_id: BasicPlayer
  profile_id: string | null;
  second_player_id: BasicPlayer
  seventh_player_id: BasicPlayer
  sixth_player_id: BasicPlayer
  third_player_id: BasicPlayer
}
export default Team
