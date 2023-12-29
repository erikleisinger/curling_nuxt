<template>
    <TeamPlayerChangeListener/>
    <TeamRequestsHandler :teamId="teamId" onlyInvite/>
    <TeamPageHeader
        :teamId="teamId"
        @click="viewing = true"
        style="cursor: pointer"
        @loaded="headerLoaded = true"
    />
    <div
        :class="{ column: $q.screen.xs, 'row no-wrap': !$q.screen.xs }"
        class="team-info"
    >
        <div
            class="team-badges__container"
            :class="$q.screen.xs ? 'col-12' : 'col-6'"
            v-if="team?.badges?.length"
        >
            <div
                class="row items-center"
                :class="{
                    'col-6 justify-around': !$q.screen.xs,
                    'justify-between': $q.screen.xs,
                }"
            >
                <Badge v-if="featuredBadge?.id" :badge="featuredBadge">
                    <template v-slot:underlay> Featured </template>
                </Badge>
                <Badge
                    v-for="(badge, index) in badgesLimited"
                    :key="badge.id"
                    :badge="badge"

                >
                    <template v-slot:underlay>
                        <span v-if="index === 0 && !!team.featured_badge_id">Recent</span>
                    </template>
                </Badge>
            </div>
            <div class="row " :class="canEdit ? 'justify-between' : 'justify-end'">
                <div
                    class="text-sm q-mt-xs text-underline"
                    style="cursor: pointer"
                    @click="beginSelectFeatured"
                    v-if="canEdit"
                >
                    Select featured badge
                </div>
                <div
                    class="text-sm q-mt-xs text-underline"
                    style="cursor: pointer"
                    @click="badgesOpen = true"
                >
                    View all badges
                </div>
            </div>
        </div>


        <TeamPageStatsOverview :teamId="teamId" :class="{ 'col-6 ': !$q.screen.xs }" class="stats__overview" v-if="hasPlayedGames"/>
            <!-- <TeamAttribute title="Games played" color="amber" class="col-5">
                <span>
                    {{ stats.games_played ?? 0 }}
                </span>
            </TeamAttribute>
            <TeamAttribute
                title="Win %"
                color="amber"
                class="col-5"
                :percent="stats.winPercentile"
            >
                <span> {{ stats.winPercent }}% </span>
                <template v-slot:extra>
                    <q-icon
                        :name="getIcon(stats.winPercentile)"
                        :color="getPercentileColor(stats.winPercentile)"
                    />
                    <span
                        :style="{
                            color: getPercentileColor(stats.winPercentile),
                        }"
                        >{{ stats.winPercentile }}%</span
                    >
                </template>
            </TeamAttribute> -->
            <!-- <TeamAttribute
                title="Hammer first end"
                color="amber"
                class="col-5"
                :percent="stats.HFEPercentile"
            >
                <span> {{ stats.HFEPercent }}% </span>
                <template v-slot:extra>
                    <q-icon
                        :name="getIcon(stats.HFEPercentile)"
                        :color="getPercentileColor(stats.HFEPercentile)"
                    />
                    <span
                        :style="{
                            color: getPercentileColor(stats.HFEPercentile),
                        }"
                        >{{ stats.HFEPercentile }}%</span
                    >
                </template>
            </TeamAttribute> -->
            <!-- <TeamAttribute
                title="Hammer last end"
                color="amber"
                class="col-5"
                :percent="stats.HLEPercentile"
            >
                <span> {{ stats.HLEPercent }}% </span>
                <template v-slot:extra>
                    <q-icon
                        :name="getIcon(stats.HLEPercentile)"
                        :color="getPercentileColor(stats.HLEPercentile)"
                    />
                    <span
                        :style="{
                            color: getPercentileColor(stats.HLEPercentile),
                        }"
                        >{{ stats.HLEPercentile }}%</span
                    >
                </template>
            </TeamAttribute> -->
        </div>

   

    <ChartTeamStatsTime
        v-if="hasPlayedGames"
        :teamId="teamId"
        :visibleStats="['Hammer efficiency']"
        class="q-mb-md"
    />
     <section name="leagues" v-if="$q.screen.xs">
    <h3 class="text-md text-bold q-pa-sm q-pl-md">Leagues</h3>
    <q-separator/>
    <TeamLeagueList :teamId="teamId"/>
    </section>
    <div class="row no-wrap">
    <section name="games" :class="$q.screen.xs ? 'col-12' : 'col-6'">
    <GameResultList :teamId="teamId" />

    <div v-if="!hasPlayedGames" class="full-width text-center q-pa-lg">
        <div>{{ team.name }} hasn't played any games!</div>
        <q-btn
            icon="add"
            color="primary"
            rounded
            class="q-mt-md"
            @click="navigateTo('/games/create')"
            >Add game</q-btn
        >
    </div>

    </section>
        <section name="leagues" v-if="!$q.screen.xs" class="col-6">
    <h3 class="text-md text-bold q-pa-sm q-pl-md">Leagues</h3>
    <q-separator/>
    <TeamLeagueList :teamId="teamId"/>
    </section>
    </div>
    <q-dialog
        v-model="badgesOpen"
        v-if="team.badges?.length"
        :full-width="$q.screen.xs"
        :persistent="$q.screen.xs"
    >
        <q-card class="badges-viewer" ref="badgesContainer">
            <h3
                class="text-md text-bold badges-viewer__header justify-between full-width row items-center"
            >
                <span v-if="!selectingFeatured">
                    Badges ({{ team.badges.length }})
                </span>
                <span v-else class="text-sm"> Select featured badge </span>
                <div class="row">
                  <q-btn flat round icon="sort">
           
                <q-menu>
                    <q-item
                        clickable
                        v-ripple
                        @click="onClickSort('Alphabetical')"
                        :active="!!sortAlphabeticalOrder"
                       
                    >
                       
                        <q-item-section no-wrap>
                            Sort Alphabetically
                        </q-item-section>
                         <q-item-section no-wrap avatar>
 <q-icon
                                :name="
                                    sortAlphabeticalOrder === 'desc'
                                        ? 'keyboard_arrow_down'
                                        : 'keyboard_arrow_up'
                                "
                            ></q-icon>
                            </q-item-section>
                    </q-item>
                     <q-item
                        clickable
                        v-ripple
                         @click="onClickSort('Date')"
                         :active="!!sortDateOrder"

                       
                    >
                       
                        <q-item-section no-wrap>
                            Sort By Date Earned
                        </q-item-section>
                         <q-item-section no-wrap avatar>
                             <q-icon
                                 :name="
                                    sortDateOrder === 'desc'
                                        ? 'keyboard_arrow_down'
                                        : 'keyboard_arrow_up'
                                "
                            ></q-icon>
                            </q-item-section>
                    </q-item>

                </q-menu>
            </q-btn>
                <q-btn
                    flat
                    round
                    icon="close"
                    dense
                    @click="badgesOpen = false"
                    style="margin-right: -12px"
                />
                </div>
            </h3>
            <q-separator />
            <div
                class="row items-start badges-view"
                :class="$q.screen.xs ? 'justify-between' : 'justify-start'"
            >
                <Badge
                    v-for="badge in badgesSorted"
                    :key="badge.id"
                    :badge="badge"
                    :width="badgeWidth"
                    :highlight="selectingFeatured && team.featured_badge_id === badge.id"
                    @click="selectFeaturedBadge($event, badge.id)"
                    :canView="!selectingFeatured"
                    showTime
                />
            </div>
        </q-card>
    </q-dialog>
      <q-dialog v-model="viewing" persistent>
        <q-card class="team-details__viewer">
            <TeamPageDetails
                @back="viewing = false"
                v-if="viewing"
                :teamId="teamId"
            />
        </q-card>
    </q-dialog>
</template>
<style lang="scss" scoped>
.outbound-request__prompt {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: white;
    height: 50px;
}
.stats__overview {
    margin: 0px calc(var(--space-md) + var(--space-xs));
   
}
.team-info {
    @include sm {
        margin-top: var(--space-xl);
    }
}
.team-details__viewer,
.badges-viewer {
    width: min(100vw, 500px);
    height: min(100vh, 600px);
}

.badges-viewer {
    padding: var(--space-xs);
    padding-top: 0px;
    .badges-viewer__header {
        padding: var(--space-sm);
    }
    .badges-view {
        margin-top: var(--space-sm);
        gap: 6px 0px;
    }
}

.team-badges__container {
    padding: 0px calc(var(--space-md) + var(--space-xs));
    margin-bottom: var(--space-md);
}
</style>
<script setup lang="ts">
import Team from "@/store/models/team";
import { useTeamRequestStore } from "@/store/team-requests";
import {useDialogStore} from '@/store/dialog'
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { useEventListener } from "@vueuse/core";
import { BADGE_NAMES } from "@/constants/badges";
import { useElementSize, useDebounceFn } from "@vueuse/core";

const queryClient = useQueryClient();
const dialogStore = useDialogStore();

        const {toTimezone} = useTime();

const viewing = ref(false)

const $q = useQuasar();

const route = useRoute();
const teamId = Number(route.params.id)

const hasPlayedGames = computed(() => !!team.value?.games?.length);

const team = computed(() =>
    useRepo(Team).withAll().where("id", teamId).first()
);

const stats = computed(() => team.value?.totalStats ?? {});

const toPercent = (val: number) => {
    return Number.parseInt((val * 100).toFixed(2));
};

const getIcon = (val: number) => {
    return val > 50 ? "arrow_drop_up" : "arrow_drop_down";
};
const getPercentileColor = (val: number) => {
    return val > 50 ? "green" : "red";
};
const badgesOpen = ref(false);

const teamRequests = computed(() =>
    useTeamRequestStore().requests?.filter(
        ({ team_id }) => team_id === teamId ?? []
    )
);

const badgesLoaded = ref(false);
const headerLoaded = ref(false);

const { sortAlphabetically } = useSort();

const featuredBadge = computed(() =>
    [...(team.value?.badges ?? [])].find(({ id }) => id === team.value.featured_badge_id)
);
const badgesLimited = computed(() =>
    [...(team.value?.badges ?? [])]
        .filter(({ id }) => id !== team.value.featured_badge_id)
        .sort((a,b) =>  toTimezone(b.created_at, null, false, true).unix() - toTimezone(a.created_at, null, false, true).unix())
        .splice(0, $q.screen.xs ? (team.value.featured_badge_id ? 1 : 2) : (team.value.featured_badge_id ? 3 : 4))
);

const { setLoading } = useLoading();


const sortDateOrder = ref(null);
const sortAlphabeticalOrder = ref('asc');

const onClickSort = (type) => {
    const typeKey = `sort${type}Order`;
    const sortTypes = {
        sortDateOrder: sortDateOrder,
        sortAlphabeticalOrder: sortAlphabeticalOrder,
    };
    Object.keys(sortTypes)
        .filter((key) => key !== typeKey)
        .forEach((key) => {
            sortTypes[key].value = null;
        });

    const steps = [null, "asc", "desc"];

    if (sortTypes[typeKey].value === "desc") {
        sortTypes[typeKey].value = null;
    } else {
        const index = steps.indexOf(sortTypes[typeKey].value);
        sortTypes[typeKey].value = steps[index + 1];
    }
};


const badgesSorted = computed(() => [...(team.value?.badges ?? [])].sort((a,b) => {
    if (sortAlphabeticalOrder.value) {
        const {sortAlphabetically} = useSort();
        return sortAlphabetically(BADGE_NAMES[a.name].toLowerCase().replaceAll(' ', ''), BADGE_NAMES[b.name].toLowerCase().replaceAll(' ', ''), sortAlphabeticalOrder.value === 'asc')
    }
    if (sortDateOrder.value) {

        if (sortDateOrder.value === 'asc') {
            return toTimezone(b.created_at, null, false, true).unix() - toTimezone(a.created_at, null, false, true).unix();
        }
        return toTimezone(a.created_at, null, false, true).unix() - toTimezone(b.created_at, null, false, true).unix();
    }
    return 1
}))

const pageReady = computed(() => headerLoaded.value);

watch(pageReady, (val) => {
    if (!val) return;
    setTimeout(() => {
        setLoading(false);
    }, 50);
});

useEventListener(window, "popstate", () => {
    if (badgesOpen.value) {
        history.go(1);
        badgesOpen.value = false;
    }
});

const badgesContainer = ref(null);
const { width } = useElementSize(badgesContainer);
const badgeWidth = computed(() => `${width.value / 2 - 3}px`);

const selectingFeatured = ref(false);

const beginSelectFeatured = () => {
    selectingFeatured.value = true;
    badgesOpen.value = true;
};

const selectFeaturedBadge = async (event, featured_badge_id) => {
    if (!selectingFeatured.value) return;
    useRepo(Team).where("id", teamId).update({
        featured_badge_id,
    });
    saveFeaturedBadge(featured_badge_id);
};

const saveFeaturedBadge = useDebounceFn(async (featured_badge_id) => {
    const client = useSupabaseClient();
    await client
        .from("teams")
        .update({
            featured_badge_id,
        })
        .eq("id", teamId);
    queryClient.invalidateQueries({
        queryKey: ["team", "page", teamId],
    });
}, 2000);

watch(badgesOpen, (val) => {
    if (val) return;
    selectingFeatured.value = false;
});

const {isOnTeam} = useTeam()

const canEdit = computed (() => isOnTeam(teamId))
</script>
<script lang="ts">
export default {
    name: "TeamPage",
};
</script>
