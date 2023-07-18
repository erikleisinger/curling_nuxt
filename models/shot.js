const defaultShot =  () => ({
    id: null,
    end_id: null,
    player_id: null,
    shot_no: null,
    turn: null,
    line: null,
    score: null,
    type_id: null,
    notes: null,
    rock_positions: {}
}) 

export const newShot = (shot = {}) => {
    
    return Object.assign(defaultShot(), shot)
}

export const shotEdited = (shot = defaultShot()) => {
    const {end_id, player_id, type_id } = shot;
    return {
        ...shot,
        end_id: end_id?.id ?? end_id,
        player_id: player_id?.id ?? player_id,
        type_id: type_id?.id ?? type_id,
    }
}