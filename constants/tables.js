import {useDateFormat} from '@vueuse/core'
import { TURN_TYPES, LINE_TYPES } from './game';

export const TABLE_NAMES = {
    ENDS: 'ends',
    GAMES: 'games',
    PLAYERS: 'players',
    SHOT_TYPES: 'shottypes',
    SHOTS: 'shots',
    TEAMS: 'teams',
};

export const VISIBLE_TABLES = [
    TABLE_NAMES.GAMES,
    TABLE_NAMES.PLAYERS,
    TABLE_NAMES.TEAMS
];

const getNewDate = (displayName) => {
    return {
        visible: true,
        type: 'date',
        displayName,
        format: (val) => {
            if (!val) return 'N/A';
            const formatted = useDateFormat(val, 'YYYY-MM-DD')
            return formatted.value

        }
    }
}

const getNewSchema = (schema) => {
    return {
        id: {
            visible: false, 
            editable: false,
         },
         created_at: {
             visible: false,
             editable: false,
         },
        ...schema,
    }
}

const getUserSelect = (displayName, tableName) => {
    return {
        displayName,
            visible: true,
            editable: true,
            foreignKey: {
                tableName,
                field: 'id',
                displayFields: ['name']
            },
            format: (val) => {
                return val?.name;
            },
            type: 'select'
    }
}; 

const getArrayOfOptions = (options) => {
    return options.map((label, value) => {
        return {value, label}
    })
}



export const TABLE_SCHEMA = {
    [TABLE_NAMES.GAMES]: getNewSchema({
        
        home: getUserSelect('Home', 'teams'),
        away: getUserSelect('Away', 'teams'),
        start_time: getNewDate('Start time'),
        end_time: getNewDate('End time'),
        name: {
            visible: true,
            editable: true,
            type: 'text',
            displayName: 'Name',
        }
    }),
    foreignKey: {
        tableName: 'ends',
        field: 'id',
        displayFields: ['end_number']
    },
    [TABLE_NAMES.SHOTS]: getNewSchema({
        end_id: {
            displayName: 'End #',
            visible: true,
            editable: true,
            foreignKey: {
                tableName: 'ends',
                field: 'id',
                displayFields: ['end_number']
            },
            format: (val) => {
                return val?.end_number
            },
            type: 'select',
        },
        shot_no: {
            displayName: 'Shot #',
            visible: true,
            editable: true,
            options: Array.from({length: 16}, (v, k) => k+1),
            type: 'select',
        },
        player_id: getUserSelect('Player', 'players'),
        turn: {
            displayName: 'Turn',
            visible: true,
            editable: true,
            type: 'select',
            options: getArrayOfOptions(TURN_TYPES),
            
        },
        line: {
            displayName: 'Line',
            visible: true,
            editable: true,
            type: 'select',
            options: getArrayOfOptions(LINE_TYPES),
        },
        type_id: {
            displayName: 'Shot Type',
            visible: true,
            editable: true,
            type: 'select',
            foreignKey: {
                tableName: 'shottypes',
                field: 'id',
                displayFields: ['name']
            },
            format: (val) => {
                return val?.name
            }
        },
        score: {
            displayName: 'Score',
            visible: true,
            editable: true,
            options: Array.from(Array(4).keys()),
            type: 'select',
        },
        notes: {
            displayName: 'Notes',
            visible: true,
            editable: true,
        },
        rock_positions: {
            visible: false,
            editable: false,
        },
    }),
    [TABLE_NAMES.PLAYERS]:getNewSchema({
        name: {
            displayName: 'Name',
            visible: true,
            editable: true,
            type: 'text',

        }
    }),
    [TABLE_NAMES.ENDS]:getNewSchema({
        game_id: {
            displayName: 'Game',
            visible: true,
            editable: true,
            type: 'select',
            foreignKey: {
                tableName: 'games',
                field: 'id',
                displayFields: ['name', 'start_time']
            },
            format: (val) => {
                const time = val.start_time ? useDateFormat(val.start_time, 'YYYY-MM-DD').value : 'Unnamed'
                return `${time} ${val.name ? `"${val.name}"` : ''}`
            }
        },
        end_number: {
            displayName: 'End #',
            visible: true,
            editable: true,
            type: 'select',
            options: Array.from({length: 13}, (v, k) => k+1)
        }
    }),
    [TABLE_NAMES.TEAMS]:getNewSchema({
        name: {
            displayName: 'Name',
            visible: true,
            editable: true,
            type: 'text',

        },
        lead_player_id: getUserSelect('Lead', 'players'),
        second_player_id: getUserSelect('Second', 'players'),
        third_player_id: getUserSelect('Third', 'players'),
        fourth_player_id: getUserSelect('Fourth', 'players'),
        fifth_player_id: getUserSelect('Fifth', 'players'),
        // sixth_player_id: getUserSelect('Sixth', 'players'),
        // seventh_player_id: getUserSelect('Seventh', 'players'),
    }),
    [TABLE_NAMES.SHOT_TYPES]: getNewSchema({
        name: {
            displayName: 'Name',
            visible: true,
            editable: true,
            type: 'text',

        },
    })
}

