import type Player from "@/types/player";
import type Team from "@/types/team";
interface SupabaseReturn {
  error: any;
}
export interface SupabasePlayerReturn extends SupabaseReturn {
  data: Player[] | null;
}
export interface SupabaseTeamReturn extends SupabaseReturn {
  data: Team[] | null;
}
