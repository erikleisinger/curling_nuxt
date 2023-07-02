export const TABLE_NAMES = {
    ENDS: 'ends',
    GAMES: 'games',
    PLAYERS: 'players',
    SHOT_TYPES: 'shottypes',
    SHOTS: 'shots',
    TEAMS: 'teams',
};

export const VISIBLE_TABLES = [
    TABLE_NAMES.ENDS,
    TABLE_NAMES.GAMES,
    TABLE_NAMES.PLAYERS,
    TABLE_NAMES.SHOT_TYPES,
    TABLE_NAMES.SHOTS,
    TABLE_NAMES.TEAMS
];

export const TABLE_SCHEMA = {
    [TABLE_NAMES.GAMES]: {
        id: {
           visible: false, 
        },
        created_at: {
            visible: false,
        },
        home: {
            visible: true,
            type: 'select',
            foreignKey: {
                tableName: 'teams',
                field: 'id',
                displayField: 'name'
            },
            format: (data) => data.name,
        },
        away: {
            visible: true,
            type: 'select',
            foreignKey: {
                tableName: 'teams',
                field: 'id',
                displayField: 'name'
            },
            format: (data) => data.name,
        },
        start_time: {
            visible: true,
            type: 'date',
        },
        end_time: {
            visible: true,
            type: 'date',
        },
        name: {
            visible: true,
            type: 'text',
        }
    },
}

