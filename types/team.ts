import { BasicPlayer } from "@/types/player";
export interface BasicTeam {
    id?: number;
    name: string | null;
}
export type TeamPosition =
    | "lead"
    | "second"
    | "third"
    | "fourth"
    | "fifth"
    | "sixth"
    | "seventh";

export type TeamPlayerPosition =
    | "lead_player_id"
    | "second_player_id"
    | "third_player_id"
    | "fourth_player_id"
    | "fifth_player_id"
    | "sixth_player_id"
    | "seventh_player_id";

interface Team extends BasicTeam {
    created_at?: string | null;
    fifth_player_id: BasicPlayer | null;
    fourth_player_id: BasicPlayer | null;
    lead_player_id: BasicPlayer | null;
    profile_id?: string | null;
    second_player_id: BasicPlayer | null;
    seventh_player_id: BasicPlayer | null;
    sixth_player_id: BasicPlayer | null;
    third_player_id: BasicPlayer | null;
    skip: BasicPlayer | null
}
export default Team;
