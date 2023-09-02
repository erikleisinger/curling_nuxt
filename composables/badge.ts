import { BADGE_FIELDS, BADGE_THRESHOLDS } from "@/constants/badges";
import { useUserTeamStore } from "@/store/user-teams";
export const useBadge = () => {
    const store = useUserTeamStore();

    const hasBadge = (teamId: string, badge: string, team: object) => {
        if (!BADGE_THRESHOLDS[badge] || !BADGE_FIELDS[badge]) return false;

    
        if (!team && !teamId) return false;
        if (!team) {
            team = store.userTeams.find(({ id }) => id === teamId);
        }

        if (BADGE_FIELDS[badge].reverse) {
            return (
                (team[BADGE_FIELDS[badge].numerator] /
                    team[BADGE_FIELDS[badge].denominator]) *
                    100 <
                BADGE_THRESHOLDS[badge]
            );
        }

        return (
            (team[BADGE_FIELDS[badge].numerator] /
                team[BADGE_FIELDS[badge].denominator]) *
                100 >
            BADGE_THRESHOLDS[badge]
        );
    };

    return { hasBadge };
};
