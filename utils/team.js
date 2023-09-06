export const isPlaceholder = (team_id, game_id) => {
    return game_id + 100000000 === team_id;
}