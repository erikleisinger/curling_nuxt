<template>
    <div
        class="team-card__container"
        :style="`background-image: url(${avatar})`"
    >
        <div class="underlay" />
        <div class="overlay full-height">
            <div class="row no-wrap justify-between full-width">
                <div class="column justify-between no-wrap">
                    <div class="name">
                        <h2 class="text-uppercase text-xl text-bold">
                            {{ team?.name }}
                        </h2>
                        <h3 class="text-xs">Home rink</h3>
                    </div>
                    <div class="row badges">
                        <BadgeIcon
                            v-for="badge in badges"
                            :key="badge.id"
                            :badge="badge.name"
                            height="2em"
                        />
                    </div>
                </div>
                <div class="win-container row ">
                    <div v-if="team?.totalStats?.wins_average">
                        <div class="text-xl text-bold wins">{{team?.totalStats?.wins_average * 100}}%</div>
                        <div
                            class="text-sm text-right"
                            style="margin-top: -8px"
                        >
                            wins
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.team-card__container {
    color: white;
    padding: var(--space-sm)  0px;
    .name {
        letter-spacing: 0.001em;

        width: auto;
        padding: 8px;
        overflow: hidden;
        margin-top: calc(-1 * var(--space-sm));
        h2 {
            width: fit-content;
            height: fit-content;
        }
        h3 {
            margin-top: -4px;
        }
    }
    border-radius: 8px;
    margin: var(--space-sm);
    box-shadow: $pretty-shadow;
    background-size: cover;
    background-position-y: center;
    position: relative;
    .win-container {
        font-family: $font-family-main;
        padding: 0px 8px;
      

        width: min-content;
        font-size: var(--text-lg);
        .wins {
            // margin-top: calc( -1 * var(--space-xxxs));
            // margin-top: -2px;
            line-height: 1em;
        }
    }
    .underlay {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: inherit;
        z-index: 0;
    }

    .overlay {
        position: relative;
        z-index: 1;
    }
    .badges {
        padding: 0px var(--space-xs);
        gap: var(--space-xs);
    }
}
</style>
<script setup>
import Team from "@/store/models/team";
import { useQuery } from "@tanstack/vue-query";
import GET_TEAM_WITH_STATS from '@/queries/get_team_with_stats'

const props = defineProps({
    teamId: Number,
});


const { getTeamAvatar } = useAvatar();



const { getBadgesForTeam } = useBadge();

const { isLoading: badgesLoading, data: badges } = useQuery({
    queryKey: ["team", "badges", props.teamId],
    queryFn: () => getBadgesForTeam(props.teamId),
});

const {isLoading: isLoadingTeam, data: team} = useQuery({
    queryKey: ['team', 'page', props.teamId],
    queryFn: () => GET_TEAM_WITH_STATS(props.teamId)
})

const { isLoading, data: avatar } = getTeamAvatar(team.value?.id, {
    enabled: !!team
});
</script>
<script>
export default {
    name: "TeamCard",
};
</script>
