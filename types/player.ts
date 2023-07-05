export interface PlayerSchema {
  id: number | null;
  name: string | null;
  created_at: string | null;
  profile_id: string | null;
}
class Player implements PlayerSchema {
  public constructor(
    public id: number | null = null,
    public name: string | null = null,
    public created_at: string | null = null,
    public profile_id: string | null = null
  ) {}
  
}

export default Player;
