<template>
    <div
        class="full-height no-wrap"
        :class="{ column: !oppositionId, row: !!oppositionId }"
    >
        <div
            class="col-12 col-sm-6 row full-width view-more__container"
            v-show="!!viewDetails?.length"
        >
            <LazyChartTeamStatsTime
                :teamId="team.id"
                v-if="!oppositionId && !!viewDetails.length"
                :visibleStats="viewDetails"
                @close="viewDetails = []"
            />
        </div>

        <div
            class="stats__container column no-wrap"
            v-if="$q.screen.gt.xs || !viewDetails?.length"
            :class="{
                'col-12': $q.screen.xs || !viewDetails.length,
                'col-6': viewDetails.length && !$q.screen.xs,
            }"
        >
            <div
                class="column no-wrap"
                v-for="(badge, index) in fields"
                :key="`percentage-${badge}`"
            >
                <div v-if="!!oppositionTeam" class="q-mt-md row no-wrap">
                    <div class="row col-grow justify-start items-center">
                        <div class="team-avatar__container">
                            <TeamAvatar
                                :teamId="team.id"
                                :color="showColors ? team.color : null"
                                :viewable="!!team.id"
                            />
                        </div>
                    </div>
                    <div>
                        <h2 class="text-md q-mr-md text-center">
                            {{ BADGE_TITLES_PLAIN[badge] }}
                        </h2>
                        <h3 class="text-sm text-center">
                            {{ BADGE_DESCRIPTIONS_PLAIN[badge] }}
                        </h3>
                    </div>
                    <div class="row col-grow justify-end items-center">
                        <div class="team-avatar__container">
                            <TeamAvatar
                                :teamId="oppositionId"
                                :color="
                                    showColors ? oppositionTeam?.color : null
                                "
                                :viewable="!!oppositionId"
                            />
                        </div>
                    </div>
                </div>

                <div class="row no-wrap" v-if="stats?.team">
                    <div
                        :class="!!oppositionTeam ? 'col-6 q-pr-md' : 'col-12'"
                        v-if="!reloading"
                    >
                        <LazyTeamStatsViewPercentage
                            class="full-width"
                            :badge="badge"
                            :teamId="Number.parseInt(teamId)"
                            :numerator="
                                stats.team[BADGE_FIELDS[badge].numerator]
                            "
                            :denominator="
                                stats.team[BADGE_FIELDS[badge].denominator]
                            "
                            @showMore="viewMore(BADGE_TITLES_PLAIN[badge])"
                            :visible="
                                viewDetails.includes(BADGE_TITLES_PLAIN[badge])
                            "
                            dense
                            prependPercent
                        />
                    </div>
                    <div
                        class="col-6 q-pl-md"
                        v-if="!reloading && (oppositionId || oppositionTeam)"
                    >
                        <LazyTeamStatsViewPercentage
                            class="full-width"
                            :badge="badge"
                            :teamId="Number.parseInt(oppositionId)"
                            :numerator="
                                stats.opposition[BADGE_FIELDS[badge].numerator]
                            "
                            :denominator="
                                stats.opposition[
                                    BADGE_FIELDS[badge].denominator
                                ]
                            "
                            @showMore="viewMore(BADGE_TITLES_PLAIN[badge])"
                            :visible="
                                viewDetails.includes(BADGE_TITLES_PLAIN[badge])
                            "
                            dense
                            reverse
                        />
                    </div>
                </div>
                <q-separator v-if="index !== fields.length - 1" />
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.team-avatar__container {
    height: 3em;
    width: 3em;
}
.stats__container {
    padding: 0px var(--space-md);
    border-radius: 8px;
    .toolbar {
        padding: var(--space-sm);
    }
}
.view-more__container {
    overflow: auto;
    position: fixed;
    top: 65px;
    width: 100vw;
    height: calc(100 * var(--vh, 1vh) - 60px);
    background-color: white;
    height: v-bind(viewerHeight);
    z-index: $z-tooltip;
    @include sm {
        border-top: 1px solid $grey-5;
        position: relative;
    }
}
</style>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import {
    BADGE_FIELDS,
    BADGE_THRESHOLDS,
    BADGE_TITLES_PLAIN,
    BADGE_DESCRIPTIONS_PLAIN,
} from "@/constants/badges";
import Team from "@/store/models/team";
import Game from "@/store/models/game";
import TeamStats from "@/store/models/team-stats";


const props = defineProps({
    exclude: {
        type: Array,
        default: [],
    },
    h2h: Boolean,
    gameId: Number,
    oppositionId: Number,
    oppositionName: String,
    // Requires 'color' to be included in team/oppositionTeam props
    showColors: Boolean,
    teamId: Number,
    teamName: {
        type: String,
        default: "<TEAM>",
    },
    viewerHeight: String,
});

const team = computed(() => {
    const t =
        useRepo(Team).with("stats").where("id", props.teamId).first() ?? {};
    return {
        ...t,
        ...t.totalStats,
    };
});

const getCumulativeStats = (statsArray) => {
    return statsArray.reduce((all, current) => {
        const allCopy = { ...all };
        Object.keys(current).forEach((key) => {
            allCopy[key] = (typeof allCopy[key] === 'number' ? allCopy[key] : 0) + current[key];
        });
        return allCopy;
    }, {});
};

const stats = computed(() => {
    // let games;
    // if (!props.h2h) {
    //     games =
    //         (useRepo(Game)
    //             .query()
    //             .with("teams")

    //             .whereHas("teams", (q) => {
    //                 return q.whereIn("team_id", [props.teamId]);
    //             })

    //             .get() ?? []).map(({id}) => id);
    // } else {
    //     games =
    //         (useRepo(Game)
    //             .query()
    //             .with("teams")

    //             .whereHas("teams", (q) => {
    //                 return q.whereIn("team_id", [props.teamId]);
    //             })
    //             .whereHas("teams", (q) => {
    //                 return q.whereIn("team_id", [props.oppositionId]);
    //             })

    //             .get() ?? []).map(({id}) => id);
    // }
    if (!props.h2h) {
        return {
            team: useRepo(TeamStats)
                .where("team_id", props.teamId)
                .where("game_id", 0)
                .first(),
            opposition: useRepo(TeamStats)
                .where("team_id", props.oppositionId)
                .where("game_id", 0)
                .first(),
        };
    } else {
        return {
            team: props.gameId ? getCumulativeStats(
                useRepo(TeamStats)
                    .where("team_id", props.teamId)
                    .whereIn("game_id", props.gameId)
                    .get()) : getCumulativeStats(
                useRepo(TeamStats)
                    .where("team_id", props.teamId)
                    .get()),
            opposition: props.game_id ? getCumulativeStats(
                useRepo(TeamStats)
                    .where("team_id", props.oppositionId)
                    .whereIn("game_id", props.gameId)
                    .get()) :
                     props.oppositionId ? 
                    getCumulativeStats(
                useRepo(TeamStats)
                    .where("team_id", props.oppositionId)
                    .get()) : 
                getCumulativeStats(useRepo(Team).withAll().where('name', (val) => {
                    return val.toLowerCase().replaceAll(' ', '') === props.oppositionName.toLowerCase().replaceAll(' ', '')
                }).get().map(({stats}) => stats[0]))
        };
    }
});
const oppositionTeam = computed(() => {
    if (!props.oppositionId && !props.oppositionName) return null;
    if (props.oppositionId) {
 const t =
        useRepo(Team)
            .with("stats")
            .with("games")
            .where("id", props.oppositionId)
            .first() ?? {};
    return {
        ...t,
        ...t.totalStats,
    };
    } else {
         const t =
        useRepo(Team)
            .with("stats")
            .with("games")
            .where('name', (val) => {
                    return val.toLowerCase().replaceAll(' ', '') === props.oppositionName.toLowerCase().replaceAll(' ', '')
                })
            .first() ?? {};
    return {
        ...t,
        ...t.totalStats,
    };
    }
   
});

const EXCLUDE_FIELDS = ["survivalist", ...props.exclude];
const fields = Object.keys(BADGE_FIELDS).filter(
    (f) => !EXCLUDE_FIELDS.includes(f)
);

const $q = useQuasar();

const viewDetails = ref([]);
const detailsType = ref(null);

const viewMore = (str) => {
    if (viewDetails.value.includes(str)) {
        const index = viewDetails.value.indexOf(str);
        viewDetails.value.splice(index, 1);
    } else {
        viewDetails.value.push(str);
    }
};

const reloading = ref(false);
</script>
<script>
export default {
    name: "TeamStatsView",
};
</script>
