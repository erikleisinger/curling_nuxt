export default `
    id,
    name,
    created_at,
    owner:profile_id (
        id,
        username
    ),
    lead:lead_player_id (
        id,
        name,
        avatar
    ),
    second:second_player_id (
        id,
        name,
        avatar
    ),
    third:third_player_id (
        id,
        name,
        avatar
    ),
    fourth:fourth_player_id (
        id,
        name,
        avatar
    ),
    fifth:fifth_player_id (
        id,
        name,
        avatar
    ),
    sixth:sixth_player_id (
        id,
        name,
        avatar
    ),
    seventh:seventh_player_id (
        id,
        name,
        avatar
    )
`;

