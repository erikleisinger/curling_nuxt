enum BaseShotTypes {
    DRAW = "Draw",
    HIT = "Hit"
}

interface ShotType {
    id: number | null,
    name: String | null,
    shot_type: BaseShotTypes,
}