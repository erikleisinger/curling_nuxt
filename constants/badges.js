export const BADGE_BACKGROUNDS = {
    showoff: 'bg-badge--pale-red',
    bandit: 'bg-badge--brown',
    bulwark: 'bg-badge--purple',
    minimalist: 'bg-badge--blue',
    survivalist: 'bg-badge--green'
}   

export const BADGE_TITLES = {
    showoff: 'Show offs',
    bandit: 'Kleptomaniacs',
    bulwark: 'Indomitable',
    minimalist: 'Minimalists',
    survivalist: 'Survivalists  '
}

export const BADGE_FORMULAS = {
    showoff: (val) =>  `With hammer, scores 3+ points ${val.toFixed()}% of the time.`,
    bandit: (val) => `Without hammer, steals ${val.toFixed()}% of the time.`,
    bulwark: (val) => `Without hammer, opposition scores 2+ points only ${val.toFixed()}% of the time.`,
    minimalist: (val) => `With hammer, blanks ${val.toFixed()}% of the time.`,
    survivalist: (val) => `With hammer, scores only 1 point ${val.toFixed()}% of the time.`
}

export const BADGE_DESCRIPTIONS = {
    showoff: `"Take two, force to one" is a dated proverb for punks and losers. Here's a better idea: just make that double-runback triple for 5 and be done with it. Bada bing!`,
    bandit: "You couldn't score your own points, so you had to steal someone else's. What a way to live!",
    bulwark: `If successfully landing on the moon depended on Neil Armstrong's ability to score two against you... Baby, the Russians would have won that race. But Neil was also famously not a curler. He often referred to the sport as 'a game for communists and homosexuals' (citation needed). So what are the chances of him scoring two against anybody?`,
    minimalist: `You went full Marie Kondo on your living room, your desk at work, and your carport toolshed. Why not go all-in and de-clutter your curling life as well? Those pesky points were NOT sparking joy.`,
    survivalist: `Everybody's good at something: flute-playing, motorcycle repair, petting dogs, dentistry. You're good at only scoring one point with hammer. Is this something to be proud of? No! But to live fully, we must accept all parts of ourselves, even the parts that are bad at scoring two with hammer. And at least they didn't steal, right? Right?`
}

export const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."