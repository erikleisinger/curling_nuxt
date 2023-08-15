export const BADGE_BACKGROUNDS = {
    showoff: 'bg-badge--pale-red',
    bandit: 'bg-badge--brown',
    bulwark: 'bg-badge--purple',
    minimalist: 'bg-badge--blue',
    survivalist: 'bg-badge--green',
    strategist: 'bg-badge--pink'
}   

export const BADGE_TITLES = {
    showoff: 'Showoffs!',
    bandit: 'Bandits',
    bulwark: 'Indomitable',
    minimalist: 'Cleaning crew',
    survivalist: 'Survivalists',
    strategist: 'Strategists',
}


export const BADGE_FORMULAS = {
    showoff: (val) =>  `With hammer, scores 2+ points ${val.toFixed()}% of the time.`,
    bandit: (val) => `Without hammer, steals ${val.toFixed()}% of the time.`,
    bulwark: (val) => `Opposition scores 2+ points only ${val.toFixed()}% of the time with hammer.`,
    minimalist: (val) => `With hammer, blanks ${val.toFixed()}% of the time.`,
    survivalist: (val) => `With hammer, scores 1 point ${val.toFixed()}% of the time.`,
    strategist: (val) => `Has hammer in last end ${val.toFixed()}% of the time.`
}

export const BADGE_DESCRIPTIONS = {
    showoff: `"Take two, force to one" is a dated proverb for punks and losers. Here's a better idea: just make that double-runback triple for 5 and be done with it. Bada bing!`,
    bandit: "You couldn't score your own points, so you had to steal someone else's. What a way to live!",
    bulwark: `Ebenezer Scrooge was a man of vision, and baby, you're playing that vision out. If your opposition wants a deuce, they'll have to *earn* one. Humbug!`,
    minimalist: `Why scatter rocks everywhere when it'll just make a mess of things! `,
    survivalist: `Everybody's good at something: flute-playing, motorcycle repair, petting dogs, dentistry. You're good at only scoring one point with hammer. Is this something to be proud of? No! But to live fully, we must accept all parts of ourselves, even the parts that are bad at scoring two with hammer. And at least they didn't steal, right? Right?`
}

export const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."