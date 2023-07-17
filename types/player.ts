export interface BasicPlayer {
  id?: number | null;
  name: string | null;
}

interface Player extends BasicPlayer {
  profile_id?: string | null;
}

export default Player;
