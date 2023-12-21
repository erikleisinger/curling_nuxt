import { BADGE_FIELDS, BADGE_THRESHOLDS, BADGE_DESCRIPTIONS, EPHEMERAL_BADGES } from "@/constants/badges";
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

    const getBadgesForTeam = async (teamId: number) => {
    const client = useSupabaseClient();
        const { data } = await client
            .from("badges")
            .select("*")
            .eq("team_id", teamId)
            .eq('earned', true);

       return data?.reduce((all, current) => {
            if (all.some(({ name }) => name === current.name)) return all;
            return [...all, current];
        }, []);
    
    };
    
    const getBadgesForGame = async (gameId: number) => {
        const client = useSupabaseClient();
        const { data } = await client
            .from("badges")
            .select("*")
            .eq("game_id", gameId)
            .eq('earned', true);
        
            const returnVal = {};
            data?.forEach((badge) => {  
                const {team_id} = badge;
                if (!team_id) return;
                if (!returnVal[team_id]) returnVal[team_id] = [];
                returnVal[team_id].push(badge)
            })
            return returnVal;
    }

    const getBadgeDescription = (badge) => {
        const description = BADGE_DESCRIPTIONS[badge.name]
        if (typeof description === 'function') {
            return description(badge.info)
        }
        return description;
    }

    const sortBadges = ((a,b) => {
        return a.isBlackBadge || EPHEMERAL_BADGES.includes(a.name) ? -1 : 1
    })
    

    return { hasBadge, getBadgesForTeam, getBadgesForGame, getBadgeDescription, sortBadges };
};
