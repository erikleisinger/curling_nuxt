export const BADGE_BACKGROUNDS = {
    // WIN
    'win_1': 'bg-badge--amber',
    'win_5': 'bg-badge--amber',
    'win_10': 'bg-badge--amber',
    'win_25': 'bg-badge--amber',
    'win_50': 'bg-badge--amber',
    'win_100': 'bg-badge--amber',

    // SCORE
    score_4: 'bg-badge--blue',
    score_5: 'bg-badge--blue',
    score_6: 'bg-badge--blue',
    score_7: 'bg-badge--blue',
    score_8: 'bg-badge--blue',

    // GAME STORY - neither good nor bad
    singlemingle: 'bg-badge--blue',
    singlegame: 'bg-badge--blue',
    minimalist: 'bg-badge--blue',
    ee_win: 'bg-badge--blue',
    handshakes: 'bg-badge--blue',
    barnburner: 'bg-badge--blue',

    // GAME STORY - you did good
    controlfreak: 'bg-badge--purple',
    adrenaline: 'bg-badge--purple',
    comeback: 'bg-badge--purple',
    showoff: 'bg-badge--purple',
    strategist: 'bg-badge--purple',
    stolen_win: 'bg-badge--purple',
    conversion: 'bg-badge--purple',
    bandit: 'bg-badge--purple',
    force: 'bg-badge--purple',
    shutout: 'bg-badge--purple',

    // GAME STORY - you did bad
    blewit: 'bg-badge--brown',

    // OUTSIDE GAME
    first_game: 'bg-badge--blue-grey',
    // have a full team
    // be on 3+ teams
    // record 10+ games

    // BLACK BADGES
    win_streak: 'bg-badge--black',
    lose_streak: 'bg-badge--black',

    // OTHER
    brian_nagle: 'bg-badge--pink'
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
    conversion: 'Converts',
    bandit: 'Bandits!',
    force: 'Indomitable',
    score_4: '4-Ender',
    score_5: '5-Ender',
    score_6: '6-Ender',
    score_7: '7-Ender',
    score_8: '8-Ender',
    ee_win: 'Nailbiter',
    stolen_win: 'Photo finish',
    strategist: 'Masterminds',
    showoff: 'Bigshots',
    win_streak: 'On a Roll',
    lose_streak: 'Hard times',
    singlemingle: 'Ready to mingle',
    singlegame: 'Minimalists',
    minimalist: 'Snoozefest',
    comeback: 'Against all odds',
    blewit: 'Totally blew it',
    controlfreak: 'Never a doubt',
    adrenaline: 'Drama Queens',
    barnburner: 'Barn Burner!',
    first_game: 'On the board!',
    brian_nagle: 'Beat Brian Nagle'
}

export const BADGE_DESCRIPTIONS = {
    'win_1': 'Win 1 game',
    'win_5': 'Win 5 games',
    'win_10': 'Win 10 games',
    'win_25': 'Win 25 games',
    'win_50': 'Win 50 games',
    'win_100': 'Win 100 games',
    score_4: 'Score four points in a single end.',
    score_5: 'Score five points in a single end.',
    score_6: 'Score six points in a single end.',
    score_7: 'Score seven points in a single end.',
    score_8: 'Score eight points in a single end.',
    singlemingle: 'Win a game scoring only single points.',
    singlegame: 'Play a game in which neither team scores 2+ points.',
    minimalist: 'Blank 3 or more ends in a single game.',
    ee_win: 'Win a game in an extra end.',
    handshakes: 'Win a game by handshakes.',
    barnburner: '2+ points are scored in at least half the ends played.',
    controlfreak: 'Be in the lead for an entire game.',
    adrenaline: 'Trail your opponent all game... and win.',
    comeback: 'Win a game after trailing by 4+ points.',
    showoff: 'Score 2+ points three or more times.',
    strategist: 'Have hammer in both the first and last end.',
    stolen_win: 'Win a game by stealing points.',
    conversion: 'Score 2+ points every time you have hammer.',
    bandit: 'Steal every end of a game.',
    force: 'Steal or force in every end without hammer.',
    shutout: 'Opponent scores no points.',
    blewit: 'Lose a game after leading by 4+ points.',
    first_game: 'Record your very first game.',
    win_streak: ({value}) => `Won ${value} games in a row!`,
    lose_streak: ({value}) => `Lost ${value} games in a row.`,
    brian_nagle: 'Beat Brian Nagle 12-2 after he upset you in playdowns.' 
}

export const EPHEMERAL_BADGES = ['win_streak', 'lose_streak'];

export const BADGE_ICON_COLORS = {
    win_1: '#ffc107'
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