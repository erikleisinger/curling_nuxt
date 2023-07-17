export type PlayerId = number | null | undefined

export interface BasicPlayer {
  id?: PlayerId;
  name: string | null;
}

interface Player extends BasicPlayer {
  profile_id?: string | null;
}

export default Player;
