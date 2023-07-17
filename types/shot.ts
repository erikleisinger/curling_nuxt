import Json from "./json";
interface Shot {
  end_id: number | null
  id?: number | null;
  line: number | null;
  notes: string | null;
  player_id: number | null;
  rock_positions: Json | object;
  score: number | null;
  shot_no: number | null;
  turn: number | null;
  type_id: number | null;
}

export default Shot