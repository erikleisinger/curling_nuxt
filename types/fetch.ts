import type Player from "@/types/player";
import type Team from "@/types/team";
import type Shot from '@/types/shot'
import type Game from '@/types/game'
interface SupabaseReturn {
  error: any;
}
export interface SupabasePlayerReturn extends SupabaseReturn {
  data: Player[] | null;
}
export interface SupabaseTeamReturn extends SupabaseReturn {
  data: Team[] | null;
}

export interface SupabaseShotReturn extends SupabaseReturn {
  data: Shot[] | null;
}
export interface SupabaseGameReturn extends SupabaseReturn {
  data: Game[] | null;
}
export interface SupabaseShotTypeReturn extends SupabaseReturn {
  data: ShotType[] | null;
}