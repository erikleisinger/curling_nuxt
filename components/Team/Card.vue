<template>
    <div
        class="team-card__container column"
        :style="`background-image: url(${avatar})`"
    >
        <div class="underlay" />
        <div class="overlay" ref="overlay">
            <div class="row no-wrap justify-between full-width stretch-height">
                <div class="column justify-between no-wrap">
                    <div class="name">
                        <h2 class="text-uppercase text-xl text-bold">
                            {{ team?.name }}
                        </h2>

                        <h3 class="text-xs">{{ rink?.name }}</h3>
                    </div>
                    <div class="row badges" v-if="isLoadingTeam">
                        <q-skeleton height="2em" width="2em" type="circle"></q-skeleton>
                         <q-skeleton height="2em" width="2em" type="circle"></q-skeleton>
                          <q-skeleton height="2em" width="2em" type="circle"></q-skeleton>
                    </div>
                    <div class="row badges" v-else>
                        <Badge
                            v-for="badge in team.badges"
                            :key="badge.id"
                            :badge="badge"
                            height="2em"
                            iconOnly
                            @click.stop
                        />
                    </div>
                </div>
                <div class="win-container column items-end">
   
                        <q-skeleton height="2em" width="75px" v-if="isLoadingTeam"/>
                        <div class="text-xl text-bold wins text-right" v-else>
                            <span v-if="team?.totalStats?.wins_average">
                                {{ team?.totalStats?.wins_average * 100 }}%
                            </span>
                            <span v-else>0</span>
                        </div>
                         <q-skeleton height="1em" width="40px" v-if="isLoadingTeam"/>
                        <div
                        v-else
                            class="text-sm text-right"
                            style="margin-top: -8px"
                        >
                            <span v-if="team?.totalStats?.wins_average"
                                >wins</span
                            >
                            <span v-else>games</span>
                        </div>
                  
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.team-card__container {
    color: white;

    min-height: 120px;
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
        min-height: inherit;
        margin: var(--space-sm) 0px;
        display: flex;
        flex-direction: column;
    }
    .badges {
        padding: 0px var(--space-xs);
        gap: var(--space-xs);
    }
    .stretch-height {
        min-height: v-bind(cardHeightPx);
    }
}
</style>
<script setup>
import Team from "@/store/models/team";
import Rink from "@/store/models/rink";
import { useQuery } from "@tanstack/vue-query";
import GET_TEAM_WITH_STATS from "@/queries/get_team_with_stats";
import { useElementBounding } from "@vueuse/core";

const props = defineProps({
    teamId: Number,
});

const { getTeamAvatar } = useAvatar();

const { getBadgesForTeam } = useBadge();

const { getFullTeam } = useTeam();

const { isLoading: isLoadingTeam } = useQuery({
    queryKey: ["team", "page", props.teamId],
    queryFn: () => getFullTeam({ id: props.teamId }),
});

const team = computed(() =>
    useRepo(Team)
        .with("badges")
        .with("totalStats")
        .where("id", props.teamId)
        .first()
);

const rink = computed(() =>
    useRepo(Rink).where("id", team.value.rink_id).first()
);

const { isLoading, data: avatar } = getTeamAvatar(team.value?.id, {
    enabled: !!team.value?.id,
});
const overlay = ref(null);
const { height: cardHeight } = useElementBounding(overlay);

const cardHeightPx = computed(() => `${cardHeight.value}px`);
</script>
<script>
export default {
    name: "TeamCard",
};
</script>
