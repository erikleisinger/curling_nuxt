import { BADGE_FIELDS, BADGE_THRESHOLDS } from "@/constants/badges";
import { useUserTeamStore } from "@/store/user-teams";
export const useBadge = () => {
    const store = useUserTeamStore();

    const hasBadge = (teamId: string, badge: string) => {
        if (!BADGE_THRESHOLDS[badge] || !BADGE_FIELDS[badge]) return false;

        const team = store.userTeams.find(({ id }) => id === teamId);
        if (!team) return false;

        if (BADGE_FIELDS[badge].reverse) {
            console.log('REVERSE')
            console.log((team[BADGE_FIELDS[badge].numerator] /
            team[BADGE_FIELDS[badge].denominator]) *
            100)
            console.log(BADGE_THRESHOLDS[badge])
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
