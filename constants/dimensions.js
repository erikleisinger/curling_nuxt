export const PLAYING_AREA_DIMENSIONS = {x: 180, y: 324};

export const RINK_ASPECT_RATIO = `${PLAYING_AREA_DIMENSIONS.x}/${PLAYING_AREA_DIMENSIONS.y}`

// Calculate rings dimensions & location from top of total rink
export const RINGS_HEIGHT_PERCENT = (144 / PLAYING_AREA_DIMENSIONS.y) * 100;
export const RINGS_WIDTH_PERCENT = (144 / PLAYING_AREA_DIMENSIONS.x) * 100

// Calculate tee-line location relative to top of rink
const TEE_LINE_LOCATION_FROM_TOP_INCHES = 72;
export const TEE_LINE_PERCENT_FROM_TOP = (TEE_LINE_LOCATION_FROM_TOP_INCHES / PLAYING_AREA_DIMENSIONS.y) * 100

export const ROCK_DIAMETER_PERCENT = 3.28