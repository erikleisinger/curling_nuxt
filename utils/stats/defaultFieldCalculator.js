import { getCumulativeStat } from "@/utils/stats/getCumulativeStat"
export const defaultFieldCalculator = (statField) => ({stats, statType}) => {
    return getCumulativeStat(
        stats,
        statType,
        statField
    )
}