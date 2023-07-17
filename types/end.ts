import type Shot from './shot'
interface End {
  id?: number
  game_id?: number
  end_number: number
  scoring_team_id?:number | null
  points_scored?:number | null
  shots?: Shot[]
}
export default End
