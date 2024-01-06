export const ACHIEVEMENT_TYPES = {
        BADGE_EARNED: 'badge_earned',
        BADGE_LOST: 'badge_lost',
        BADGE_UPDATED: 'badge_updated',
        GAME_RESULT: 'game_result',
        GAME_REQUEST: 'game_request',
        SCHEDULE_REQUEST: 'schedule_request',
        TEAM_CHANGE: 'team_roster_change',
        TEAM_INVITATION: 'team_invitation',
        TEAM_REQUEST: 'team_request',
}

export const ACHIEVEMENT_TITLES = {
    [ACHIEVEMENT_TYPES.BADGE_EARNED]: 'Badge earned',
    [ACHIEVEMENT_TYPES.BADGE_UPDATED]: (name) => {
        return name === 'win_streak' ? 'Win streak' : ''
    },
    [ACHIEVEMENT_TYPES.BADGE_LOST]: 'Badge lost',
        [ACHIEVEMENT_TYPES.SCHEDULE_REQUEST]: 'Event scheduled',
        [ACHIEVEMENT_TYPES.GAME_RESULT]: 'Game result',
        [ACHIEVEMENT_TYPES.BADGE_UPDATED]: 'Badge updated',
        [ACHIEVEMENT_TYPES.TEAM_REQUEST]: 'Incoming request',
        [ACHIEVEMENT_TYPES.TEAM_INVITATION]: 'Team invitation',
        [ACHIEVEMENT_TYPES.TEAM_CHANGE]: 'Roster change',
        
}