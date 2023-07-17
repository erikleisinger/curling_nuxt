import type Player from "@/types/player";
import type Team from "@/types/team";
import type Shot from '@/types/shot'
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