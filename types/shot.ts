import Json from "./json";
import Line from './line'
interface ShotSchema {
  end_id: number | null;
  id?: number | null;
  line: number | null;
  notes: string | null;
  player_id: number | null;
  rock_positions: Json;
  score: number | null;
  shot_no: number | null;
  turn: number | null;
  type_id: number | null;
}

class Shot implements ShotSchema {
  public constructor(
    public end_id: number | null = null,
    public id: number | null = null,
    public line: Line | null = null,
    public notes: string | null = null,
    public player_id: number | null = null,
    public rock_positions: Json = "{}",
    public score: number | null = null,
    public shot_no: number | null = null,
    public turn: number | null = null,
    public type_id: number | null = null
  ) {}
  public formattedForInsert() {
    const {
      end_id,
      id,
      line,
      notes,
      player_id,
      rock_positions,
      score,
      shot_no,
      turn,
      type_id,
    } = this;
    const obj = {
      end_id,
      id,
      line,
      notes,
      player_id,
      rock_positions,
      score,
      shot_no,
      turn,
      type_id,
    };
    if (!id) delete obj.id
    return obj;
  }
}

export default Shot;
