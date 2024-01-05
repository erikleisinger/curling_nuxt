<template>
    <TeamPlayerChangeListener />
    <div :class="{ 'q-mt-lg': route.query.request }">
        <TeamRequestsHandler
            :teamId="teamId"
            :onlyInvite="!route.query.request"
        />
    </div>
    <TeamPageHeader2
        :teamId="teamId"
        @click="viewing = true"
        style="cursor: pointer"
        @loaded="headerLoaded = true"
        ref="header"
    />
    <q-tabs
        class="team-page__tabs"
        ref="tabs"
        :class="{ dark: darkTabs }"
        v-model="currentIndex"
        outside-arrows
        shrink
        @update:modelValue="onTabChange"
    >
        <q-tab label="Overview" :name="0" :ripple="false" />

        <q-tab label="Badges" :name="1" :ripple="false" />
        <q-tab label="Stats" :name="2" :ripple="false" />
        <q-tab label="Leagues" :name="3" :ripple="false" />
        <q-tab label="Game history" :name="4" :ripple="false" />
    </q-tabs>

    <TeamPageStatsOverview
        :teamId="teamId"
        class="stats__overview"
    />

    <LayoutSection title="Badges" ref="sectionBadges" style="padding-left: unset; padding-right: unset">
        <div
            class="team-badges__container"
            v-if="team?.badges?.length"
        >
      
                <Badge
                    v-if="featuredBadge"
                    :badge="featuredBadge"
                    style="margin: auto"
                >
                    <template v-slot:underlay> Featured </template>
                </Badge>
         
       
            <Badge
                v-for="(badge, index) in badgesLimited" :key="badge.id"
                :badge="badge"
                style="margin: auto"
            >
                <template v-slot:underlay>
                    <span v-if="index === 0 && !!team.featured_badge_id"
                        >Recent</span
                    >
                </template>
            </Badge>
     
            <!-- <div
                class="text-sm q-mt-xs text-underline"
                style="cursor: pointer"
                @click="beginSelectFeatured"
                v-if="canEdit"
            >
                Select featured badge
            </div> -->
          
        </div>
        <div class="full-width row justify-center q-mt-md">
            <q-btn rounded class="view-badge-btn">View all badges</q-btn>
        </div>
    </LayoutSection>

    <LayoutSection title="stats" ref="sectionStats">
        <ChartTeamStatsTime
            v-if="hasPlayedGames"
            :teamId="teamId"
            :visibleStats="['Hammer efficiency']"
            class="q-mb-md stats"
        />
    </LayoutSection>
    <LayoutSection title="Leagues" ref="sectionLeagues">
        <TeamLeagueList
            :teamId="teamId"
            style="margin-top: calc(-1 * var(--space-md); margin-bottom: calc(-1 * var(--space-md)"
        />
    </LayoutSection>
  
        <LayoutSection title="game history" ref="sectionGames">
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
        </LayoutSection>

    
 
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
            >
                <Badge
                    v-for="badge in badgesSorted"
                    :key="badge.id"
                    :badge="badge"
                    :width="badgeWidth"
                    :highlight="
                        selectingFeatured && team.featured_badge_id === badge.id
                    "
                    @click="selectFeaturedBadge($event, badge.id)"
                    :canView="!selectingFeatured"
                    showTime
                />
            </div>
        </q-card>
    </q-dialog>
    <DialogPopup :open="viewing" @hide="viewing = false" max-width="500px">
        <!-- <q-card class="team-details__viewer"> -->
        <TeamPageDetails
            @back="viewing = false"
            v-if="viewing"
            :teamId="teamId"
        />
        <!-- </q-card> -->
    </DialogPopup>
</template>
<style lang="scss" scoped>
.view-badge-btn {
    background-color: $app-yellow;
    color: white;
    font-family: $font-family-header;
    font-size: 20px;
    line-height: 20px;
    min-height: unset;
    padding: 12px;
}
.team-badges__container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 50%);
    .badge-type {
        position: absolute;
        top: -1em;
        &.right {
            right: 0;
        }
    }
}
.team-page__tabs {
    position: sticky;
    top: 0;
    background-color: transparent;
    transition: all 0.2s;
    font-family: $font-family-header;

    :deep(.q-tab__label) {
        font-size: 18px !important;
    }
    .tab__label {
        font-size: 18px !important;
    }

    :deep(.q-tab__indicator) {
        bottom: 12px;
        background-color: $app-yellow;
    }
    :deep(.q-focus-helper) {
        display: none;
    }
    :deep(.q-tab) {
        padding: unset;
        margin: 0px var(--space-xs);
    }
    &.dark {
        @include bg-slate-texture;
        color: white;
    }
}
.stats {
    margin-left: -16px;
    margin-right: -16px;
    margin-top: calc(-1 * var(--space-lg));
}
.outbound-request__prompt {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: white;
    height: 50px;
}
.stats__overview {
    margin: 0px calc(var(--space-md) + var(--space-xs));
    margin-top: var(--space-md);
    margin-bottom: var(--space-md);
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
</style>
<script setup lang="ts">
import Team from "@/store/models/team";
import { useTeamRequestStore } from "@/store/team-requests";
import { useDialogStore } from "@/store/dialog";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { BADGE_NAMES } from "@/constants/badges";
import {
    useDebounceFn,
    useElementBounding,
    useElementSize,
    useEventListener,
    useIntersectionObserver,
    useScroll,
} from "@vueuse/core";

const queryClient = useQueryClient();
const dialogStore = useDialogStore();

const currentIndex = ref(0);

const { toTimezone } = useTime();

const viewing = ref(false);

const $q = useQuasar();

const route = useRoute();

const teamId = Number(route.params.id);

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
    [...(team.value?.badges ?? [])].find(
        ({ id }) => id === team.value.featured_badge_id
    )
);
const badgesLimited = computed(() =>
    [...(team.value?.badges ?? [])]
        .filter(({ id }) => id !== team.value.featured_badge_id)
        .sort(
            (a, b) =>
                toTimezone(b.created_at, null, false, true).unix() -
                toTimezone(a.created_at, null, false, true).unix()
        )
        .splice(
            0,
            $q.screen.xs
                ? team.value.featured_badge_id
                    ? 1
                    : 2
                : team.value.featured_badge_id
                ? 3
                : 4
        )
);

const { setLoading } = useLoading();

const sortDateOrder = ref(null);
const sortAlphabeticalOrder = ref("asc");

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

const badgesSorted = computed(() =>
    [...(team.value?.badges ?? [])].sort((a, b) => {
        if (sortAlphabeticalOrder.value) {
            const { sortAlphabetically } = useSort();
            return sortAlphabetically(
                BADGE_NAMES[a.name].toLowerCase().replaceAll(" ", ""),
                BADGE_NAMES[b.name].toLowerCase().replaceAll(" ", ""),
                sortAlphabeticalOrder.value === "asc"
            );
        }
        if (sortDateOrder.value) {
            if (sortDateOrder.value === "asc") {
                return (
                    toTimezone(b.created_at, null, false, true).unix() -
                    toTimezone(a.created_at, null, false, true).unix()
                );
            }
            return (
                toTimezone(a.created_at, null, false, true).unix() -
                toTimezone(b.created_at, null, false, true).unix()
            );
        }
        return 1;
    })
);

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

const { isOnTeam } = useTeam();

const canEdit = computed(() => isOnTeam(teamId));

const tabs = ref(null);
const { y } = useElementBounding(tabs);
const darkTabs = ref(false);
watch(y, (val) => {
    darkTabs.value = val <= ($q.screen.xs ? 64 : 80);
});

const header = ref(null);
const sectionBadges = ref(null);
const sectionStats = ref(null);
const sectionLeagues = ref(null);
const sectionGames = ref(null);
const statsY = ref(0);
const badgesY = ref(0);
const leaguesY = ref(0);
const gamesY = ref(0);
const preventIntersection = ref(true);

const changeTab = (newTab) => {
    currentIndex.value = newTab;
};

useIntersectionObserver(
    header,
    ([{ isIntersecting }]) => {
        if (!isIntersecting || preventIntersection.value) return;
        changeTab(0);
    },
    { threshold: 0.5 }
);

useIntersectionObserver(
    sectionBadges,
    ([{ isIntersecting }]) => {
        if (!isIntersecting || preventIntersection.value) return;
        changeTab(1);
    },
    { threshold: 1 }
);
useIntersectionObserver(
    sectionStats,
    ([{ isIntersecting }]) => {
        if (!isIntersecting || preventIntersection.value) return;
        changeTab(2);
    },
    { threshold: 1 }
);
useIntersectionObserver(
    sectionLeagues,
    ([{ isIntersecting }]) => {
        if (!isIntersecting || preventIntersection.value) return;
        changeTab(3);
    },
    { threshold: 1 }
);
useIntersectionObserver(
    sectionGames,
    ([{ isIntersecting }]) => {
        if (!isIntersecting || preventIntersection.value) return;
        changeTab(4);
    },
    { threshold: 0.7 }
);

onMounted(() => {
    setTimeout(() => {
        const { y: bY } = useElementBounding(sectionBadges);
        badgesY.value = bY.value;
        const { y: stY } = useElementBounding(sectionStats);
        statsY.value = stY.value;
        const { y: lY } = useElementBounding(sectionLeagues);
        leaguesY.value = lY.value;
        const { y: gY } = useElementBounding(sectionGames);
        gamesY.value = gY.value;
        preventIntersection.value = false;
    }, 1000);
});

const yModifier = computed(() => ($q.screen.xs ? -115 : -126));

const onTabChange = (val) => {
    const scroller = document.querySelector("#global-container");
    preventIntersection.value = true;
    if (val === 0) {
        scroller.scrollTop = 0;
    }
    if (val === 1) {
        scroller.scrollTop = badgesY.value + yModifier.value;
    }
    if (val === 2) {
        scroller.scrollTop = statsY.value + yModifier.value;
    }
    if (val === 3) {
        scroller.scrollTop = leaguesY.value + yModifier.value;
    }
    if (val === 4) {
        scroller.scrollTop = gamesY.value + yModifier.value;
    }
};

const { isScrolling } = useScroll(document.querySelector("#global-container"));
watch(isScrolling, (val) => {
    if (!val) preventIntersection.value = false;
});
</script>
<script lang="ts">
export default {
    name: "TeamPage",
};
</script>
