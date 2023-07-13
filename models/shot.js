export const newShot = (shot = {}) => {
    const defaultShot = {
        end_id: null,
        player_id: null,
        shot_no: null,
        turn: null,
        line: null,
        score: null,
        type_id: null,
        notes: null,
        rock_positions: {}
    } 
    return Object.assign(defaultShot, shot)
}