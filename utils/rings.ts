import {
    ROCK_DIAMETER_PERCENT_Y,
    RINGS_HEIGHT_PERCENT,
    ROCK_DIAMETER_PERCENT_X,
} from "@/constants/dimensions";

export const isRockInRings = (
    positionXPercent:number,
    positionYPercent:number,
    parentHeight:number,
    parentWidth:number
) => {
    // Given dimensions and positions in percentages
    const rockRadiusPercent = ROCK_DIAMETER_PERCENT_Y / 2;
    const ringsRadiusPercent = RINGS_HEIGHT_PERCENT / 2;

    // Convert percentage dimensions to actual pixel dimensions
    const rockRadius = (rockRadiusPercent / 100) * parentHeight;
    const ringsRadius = (ringsRadiusPercent / 100) * parentHeight;

    // Convert percentage positions to actual pixel positions
    const rockX = (positionXPercent / 100) * parentWidth;
    const rockY = (positionYPercent / 100) * parentHeight;

    // Rings are positioned at the top center of the container
    const ringsX = (parentWidth - ringsRadius * 2) / 2;
    const ringsY = 0;

    // Calculate the distance between the centers of the rock and the rings
    const dx = Math.abs(rockX + rockRadius - (ringsX + ringsRadius));
    const dy = Math.abs(rockY + rockRadius - (ringsY + ringsRadius));
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if the rock is inside the rings based on the distance check
    if (distance <= ringsRadius + rockRadius) {
        return true; // Rock is inside the rings
    } else {

        return false;// Rock is outside the rings
    }
};

export function calculateDistanceToCenter(
    rock1XPercent:number,
    rock1YPercent:number,
    elementHeight:number,
    elementWidth:number
) {
    // Given dimensions and positions in percentages
    const ringsRadiusPercent = RINGS_HEIGHT_PERCENT / 2;
    // Convert percentage dimensions to actual pixel dimensions
    const ringsRadius = (ringsRadiusPercent / 100) * elementHeight;
    // Convert percentage positions to actual pixel positions
    const rockRadiusY = (ROCK_DIAMETER_PERCENT_Y / 2 / 100) * elementHeight;
    const ringsCenterX = elementWidth - 79.7 * 2;
    const ringsCenterY = ringsRadius - rockRadiusY; // Assume the center of the rings is at the top center of the container
    // Convert percentage positions of rocks to actual pixel positions
    const rock1X = (rock1XPercent / 100) * elementWidth;
    const rock1Y = (rock1YPercent / 100) * elementHeight;

    const distanceToRock = Math.sqrt(
        Math.pow(rock1X - ringsCenterX, 2) + Math.pow(rock1Y - ringsCenterY, 2)
    );

    // Return the distance
    return distanceToRock;
}
