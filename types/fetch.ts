import type Player from "@/types/player";
import type Team from "@/types/team";
import type Shot from '@/types/shot'
import type Game from '@/types/game'
import type Rink from '@/types/rink'
import type Sheet from '@/types/sheet'
import type Rock from '@/types/rock'
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
export interface SupabaseRinkReturn extends SupabaseReturn {
    data: Rink[] | null;
  }
  export interface SupabaseSheetReturn extends SupabaseReturn {
    data: Sheet[] | null;
  }
  export interface SupabaseRockReturn extends SupabaseReturn {
    data: Rock[] | null;
  }