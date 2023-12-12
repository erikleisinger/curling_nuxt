export const BADGE_BACKGROUNDS = {
    firstend: 'bg-badge--amber',
    efficiency: 'bg-badge--purple',
    showoff: 'bg-badge--pale-red',
    bandit: 'bg-badge--pale-red',
    bulwark: 'bg-badge--blue',
    minimalist: 'bg-badge--teal',
    survivalist: 'bg-badge--green',
    strategist: 'bg-badge--pink',
    stealdefense: 'bg-badge--blue-grey',
    win_1: 'bg-badge--amber',
    win_5: 'bg-badge--amber',
    win_10: 'bg-badge--amber',
    win_25: 'bg-badge--amber',
    win_50: 'bg-badge--amber',
    win_100: 'bg-badge--amber',
    shutout: 'bg-badge--pale-red',
    handshakes: 'bg-badge--green',
    conversion: 'bg-badge--purple',
    force: 'bg-badge--pink',
    'score_5': 'bg-badge--blue',
    'score_6': 'bg-badge--blue',
    'score_7': 'bg-badge--blue',
    'score_8': 'bg-badge--blue',

}   

export const BADGE_COLORS = {
    firstend: 'amber',
    efficiency: 'purple',
    showoff: 'red',
    bandit: 'red',
    bulwark: 'blue',
    minimalist: 'teal',
    survivalist: 'green',
    strategist: 'pink',
    stealdefense: 'blue-grey',   
}   

export const BADGE_TITLES = {
    efficiency: 'Hammer efficiency',
    firstend: 'Hammer first end',
    showoff: 'Showoffs!',
    bandit: 'Steal efficiency',
    bulwark: 'Force efficiency',
    minimalist: 'Cleaning crew',
    strategist: 'Strategists',
    stealdefense: 'Steal defense'
}



export const BADGE_TITLES_PLAIN = {
    efficiency: 'Hammer efficiency',
    firstend: 'Hammer in first end',
    showoff: 'Big ends',
    bandit: 'Steal efficiency',
    bulwark: 'Force efficiency',
    minimalist: 'Blank ends',
    survivalist: 'Survivalism',
    strategist: 'Hammer in last end',
    stealdefense: 'Steal defense'
}

export const BADGE_TITLE_CONVERT = {
    [BADGE_TITLES_PLAIN.efficiency]: 'efficiency',
    [BADGE_TITLES_PLAIN.firstend]: 'firstend',
    [BADGE_TITLES_PLAIN.showoff]: 'showoff',
    [BADGE_TITLES_PLAIN.bandit]: 'bandit',
    [BADGE_TITLES_PLAIN.bulwark]: 'bulwark',
    [BADGE_TITLES_PLAIN.minimalist]: 'minimalist',
    [BADGE_TITLES_PLAIN.strategist]: 'strategist',
    [BADGE_TITLES_PLAIN.stealdefense]: 'stealdefense'
}

export const BADGE_DESCRIPTIONS_PLAIN = {
    efficiency: 'Score 2+ points with hammer',
    firstend: 'Possess hammer in end #1',
    showoff: 'Score 3+ points',
    bandit: 'Score without hammer',
    bulwark: 'Opposition takes 1 point with hammer',
    minimalist: 'Score 0 points with hammer',
    survivalist: 'Score 1 point with hammer',
    strategist: 'Possess hammer in last end',
    stealdefense: 'Opposition steals'
}

export const BADGE_THRESHOLDS = {
    bandit: 33,
    bulwark: 50,
    efficiency: 66,
    firstend: 66,
    minimalist: 33,
    showoff: 50,
    stealdefense: 20,
    strategist: 50,
    survivalist: 50,
}


export const BADGE_FORMULAS = {
    bandit: (val) => `Without hammer, steals ${val.toFixed()}% of the time.`,
    bulwark: (val) => `Without hammer, opposition takes 1 point ${val.toFixed()}% of the time.`,
    efficiency: (val) => `With hammer, scores 2+ points ${val.toFixed()}% of the time.`,
    firstend: (val) => `Wins hammer first end in ${val.toFixed()}% of games played.`,
    minimalist: (val) => `With hammer, blanks ${val.toFixed()}% of the time.`,
    showoff: (val) =>  `With hammer,scores 2+ points ${val.toFixed()}% of the time.`,
    stealdefense: (val) => `With hammer, opposition steals ${val.toFixed()}% of the time.`,
    strategist: (val) => `Has hammer in last end in ${val.toFixed()}% of games played.`,
    survivalist: (val) => `With hammer,scores 1 point ${val.toFixed()}% of the time.`,
}

export const BADGE_FORMULA_EXPLANATIONS = {
    firstend: `Possess hammer in the first end ${BADGE_THRESHOLDS.firstend}% of the time or more.`,
    efficiency: `With hammer, score 2+ points  ${BADGE_THRESHOLDS.efficiency}% of the time or more.`,
    showoff: `With hammer, more than 2 points  ${BADGE_THRESHOLDS.showoff}% of the time or more.`,
    bandit: `Score points without hammer ${BADGE_THRESHOLDS.bandit}% of the time or more.`,
    bulwark: `Force opposition ${BADGE_THRESHOLDS.bulwark}% of the time or more.`,
    minimalist: `With hammer, blank ${BADGE_THRESHOLDS.minimalist}% of the time or more.`,
    survivalist: `With hammer, score only 1 point ${BADGE_THRESHOLDS.survivalist}% of the time or more.`,
    strategist: `Possess hammer in the last end ${BADGE_THRESHOLDS.strategist}% of the time or more.`,
    stealdefense: `With hammer, give up a steal ${BADGE_THRESHOLDS.stealdefense}% of the time or less.`
}
export const BADGE_NAMES = {
    'win_1': 'Chicken Dinner 1',
    'win_5': 'Chicken Dinner 5',
    'win_10': 'Chicken Dinner 10',
    'win_25': 'Chicken Dinner 25',
    'win_50': 'Chicken Dinner 50',
    'win_100': 'Chicken Dinner 100',
    shutout: 'Shutout',
    handshakes: 'Handshakes',
    conversion: 'Conversion Queens',
    bandit: 'Bandits!',
    force: 'Indomitable',
    score_5: '5-Ender',
    score_6: '6-Ender',
    score_7: '7-Ender',
    score_8: '8-Ender',
}

export const BADGE_DESCRIPTIONS = {
    'win_1': 'Won 1 game (chicken cutlet)',
    'win_5': 'Won 5 games (5 piece chicken nuggies)',
    'win_10': 'Won 10 games (10 piece chicken nuggies)',
    'win_25': 'Won 25 games (1/4 chicken combo + fries)',
    'win_50': 'Won 50 games (chicken potroast)',
    'win_100': 'Won 100 games (full blown honey-basted chicken)',
    shutout: 'Opponent scores no points.',
    handshakes: 'Won a game by handshakes.',
    conversion: 'Score 2+ points every time you have hammer.',
    bandit: 'Steal every end of a game.',
    force: 'Without hammer, stole or forced every end.',
    score_5: 'Score five points in a single end.',
    score_6: 'Score six points in a single end.',
    score_7: 'Score seven points in a single end.',
    score_8: 'Score eight points in a single end.'
}

// export const BADGE_DESCRIPTIONS = {
//     showoff: `"Take two, force to one" is a dated proverb for punks and losers. Here's a better idea: just make that double-runback triple for 5 and be done with it. Bada bing!`,
//     bandit: "You couldn't score your own points, so you had to steal someone else's. What a way to live!",
//     bulwark: `Ebenezer Scrooge was a man of vision, and baby, you're playing that vision out. If your opposition wants a deuce, they'll have to *earn* one. Humbug!`,
//     minimalist: `Why scatter rocks everywhere when it'll just make a mess of things! `,
//     survivalist: `Everybody's good at something: flute-playing, motorcycle repair, petting dogs, dentistry. You're good at only scoring one point with hammer. Is this something to be proud of? No! But to live fully, we must accept all parts of ourselves, even the parts that are bad at scoring two with hammer. And at least they didn't steal, right? Right?`
// }

export const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

export const BADGE_FIELDS = {

    efficiency: {
        numerator: 'hammer_conversion_count',
        denominator: 'hammer_end_count',
    },
    bandit: {
        numerator: 'non_hammer_steal_count',
        denominator: 'non_hammer_end_count',
    },
    bulwark: {
        numerator: 'non_hammer_force_count',
        denominator: 'non_hammer_end_count'
    },
    stealdefense: {
        numerator: 'hammer_steal_count',
        denominator: 'hammer_end_count',
        reverse: true,
    },
    minimalist: {
        numerator: 'hammer_blank_count',
        denominator: 'hammer_end_count'
    },
    survivalist: {
        numerator: 'hammer_force_count',
        denominator: 'hammer_end_count'
    },
    firstend: {
        numerator: 'hammer_first_end_count',
        denominator: 'games_played',
    },
    strategist: {
        numerator: 'hammer_last_end_count',
        denominator: 'games_played'
    },

}