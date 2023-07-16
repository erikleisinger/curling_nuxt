import {BasicPlayer} from '@/types/player'
interface Team {
  created_at: string | null;
  fifth_player_id: BasicPlayer
  fourth_player_id: BasicPlayer
  id: number;
  lead_player_id: BasicPlayer
  name: string | null;
  profile_id: string | null;
  second_player_id: BasicPlayer
  seventh_player_id: BasicPlayer
  sixth_player_id: BasicPlayer
  third_player_id: BasicPlayer
}
export default Team
