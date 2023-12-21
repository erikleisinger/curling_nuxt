<template>
    <div
        class="team-card__container column"
        ref="container"
        :class="{dense}"
        :style="`background-image: url(${avatar})`"
    >
        <div class="underlay" />
        <div class="overlay" ref="overlay">
            <div class="row no-wrap justify-between full-width " :class="{'stretch-height': !dense}">
                <div class="column justify-between ">
                    <div class="name"  :class="{dense}">
                        <h2 class="text-uppercase text-bold">
                            {{ team?.name }}
                        </h2>

                        <h3 class="text-xs" v-if="!dense">{{ rink?.name }}</h3>
                    </div>
                    <div class="row badges" v-if="isLoadingTeam">
                        <q-skeleton
                            height="2em"
                            width="2em"
                            type="circle"
                        ></q-skeleton>
                        <q-skeleton
                            height="2em"
                            width="2em"
                            type="circle"
                        ></q-skeleton>
                        <q-skeleton
                            height="2em"
                            width="2em"
                            type="circle"
                        ></q-skeleton>
                    </div>
                    <div
                        class="row badges items-center"
                        :class="{'no-wrap': dense}"
                        v-if="!isLoadingTeam && team && team?.badges"
                        ref="badges"
                    >
                        <Badge
                            v-for="badge in badges"
                            :key="badge.id"
                            :badge="badge"
                            height="2em"
                            iconOnly
                            @click.stop
                        />
                        <div v-if="dense && badges?.length !== team.badges?.length">
                            +{{(team.badges?.length ?? 0) - (badges?.length ?? 0) }}
                        </div>
                    </div>
                </div>
                <div class="win-container column items-end" :class="{dense}">
                    <q-skeleton
                        height="2em"
                        width="75px"
                        v-if="isLoadingTeam"
                    />
                    <div class="text-xl text-bold wins text-right" v-else>
                        <span v-if="team?.totalStats?.wins_average">
                            {{ (team?.totalStats?.wins_average * 100).toFixed() }}%
                        </span>
                        <span v-else>0</span>
                    </div>
                    <q-skeleton
                        height="1em"
                        width="40px"
                        v-if="isLoadingTeam"
                    />
                    <div
                        v-else
                        class="text-sm text-right"
                        style="margin-top: -8px"
                    >
                        <span v-if="team?.totalStats?.wins_average">wins</span>
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
    &.dense {
        min-height: unset;
        max-height: 100px;
    }
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
        &.dense {
            max-width: min(60vw, 400px);
            white-space: nowrap;
            
            h2 {
                font-size: var(--text-lg);
                text-overflow: ellipsis;
            min-width: 0;
            overflow: hidden;
            width: 100%;
            }
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
        &.dense {
            font-size: var(--text-md)
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
import { useElementBounding } from "@vueuse/core";

const props = defineProps({

    dense: Boolean,
    teamId: Number,
});

const {sortBadges} = useBadge();
const { getTeamAvatar } = useAvatar();

const { getFullTeam } = useTeam();

const { isLoading: isLoadingTeam } = useQuery({
    queryKey: ["team", "page", props.teamId],
    queryFn: () => getFullTeam({ id: props.teamId }),
    refetchOnWindowFocus: false,
});

const team = computed(() =>
    useRepo(Team)
        .with("badges")
        .with("totalStats")
        .where("id", props.teamId)
        .first()
);


const rink = computed(() =>
    useRepo(Rink).where("id", team.value?.rink_id).first()
);

const { isLoading, data: avatar } = getTeamAvatar(team.value?.id, {
    enabled: !!team.value?.id,
});
const overlay = ref(null);
const { height: cardHeight } = useElementBounding(overlay);

const cardHeightPx = computed(() => `${cardHeight.value}px`);

const container = ref(null)
const {width} = useElementBounding(container);

const maxBadges = computed(() => Math.floor((Math.min(width.value, 960) / 2) / 32))

const badges = computed(() => {
    const b = props.dense ? [...team.value.badges].splice(0, maxBadges.value) : team.badges;

    return b.sort(sortBadges)
})


</script>
<script>
export default {
    name: "TeamCard",
};
</script>
