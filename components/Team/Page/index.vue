<template>
    <div v-if="teamRequests && teamRequests.length">
        <div v-for="request in teamRequests" :key="request.id">
            <TeamRequest :request="request"> </TeamRequest>
        </div>
    </div>
    <TeamPageHeader
        :teamId="Number(route.params.id)"
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
            v-if="badges && badges.length"
        >
            <div
                class="row items-center"
                :class="{
                    'col-6 justify-around': !$q.screen.xs,
                    'justify-between': $q.screen.xs,
                }"
            >
            <Badge v-if="featuredBadge?.id"  :badge="featuredBadge" >
                <template v-slot:underlay>
                    Featured
                </template>
                
            </Badge>
                <Badge
                    v-for="badge in badgesLimited"
                    :key="badge.id"
                    :badge="badge"
                />
            </div>
            <div class="row justify-between">
                  <div
                class="text-sm q-mt-xs text-underline"
                style="cursor: pointer"
                @click="beginSelectFeatured"
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

        <div
            class="row attributes justify-around"
            :class="{ 'col-6 ': !$q.screen.xs }"
            v-if="hasPlayedGames"
        >
            <TeamAttribute title="Games played" color="amber" class="col-5">
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
            </TeamAttribute>
            <TeamAttribute
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
            </TeamAttribute>
            <TeamAttribute
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
            </TeamAttribute>
        </div>
    </div>

    <ChartTeamStatsTime
        v-if="hasPlayedGames"
        :teamId="Number(route.params.id)"
        :visibleStats="['Hammer efficiency']"
        class="q-mb-md"
    />

    <GameResultList :teamId="Number(route.params.id)" />

    <div v-if="!hasPlayedGames" class="full-width text-center q-pa-lg">
        <div>
        {{ team.name }} hasn't played any games!
        </div>
        <q-btn icon="add" color="primary" rounded class="q-mt-md" @click="navigateTo('/games/create')">Add game</q-btn>
    </div>
    <q-dialog v-model="viewing" persistent>
        <q-card class="team-details__viewer">
            <TeamPageDetails
                @back="viewing = false"
                v-if="viewing"
                :teamId="Number(route.params.id)"
            />
        </q-card>
    </q-dialog>
    <q-dialog
        v-model="badgesOpen"
        v-if="badges && badges.length"
        :full-width="$q.screen.xs"
        :persistent="$q.screen.xs"
    >
        <q-card class="badges-viewer" ref="badgesContainer">
            <h3
                class="text-md text-bold badges-viewer__header justify-between full-width row items-center"
            >
            <span v-if="!selectingFeatured">
                Badges ({{ badges.length }})
                
            

            </span>
            <span v-else>
                Select featured badge
            </span>
                <q-btn
                    flat
                    round
                    icon="close"
                    dense
                    @click="badgesOpen = false"
                    style="margin-right: -12px"
                />
            </h3>
            <q-separator />
            <div
                class="row items-start badges-view"
                :class="$q.screen.xs ? 'justify-between' : 'justify-start'"
            >
            
                <Badge
                    v-for="badge in [...badges].sort((a, b) =>
                        sortAlphabetically(
                            BADGE_NAMES[a.name],
                            BADGE_NAMES[b.name]
                        )
                    )"
                    :key="badge.id"
                    :badge="badge"
                    :width="badgeWidth"
                    :highlight="team.featured_badge_id === badge.id"
                    @click="selectFeaturedBadge($event, badge.id)"
                    :canView="!selectingFeatured"
                />
            </div>
        </q-card>
    </q-dialog>
</template>
<style lang="scss" scoped>
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
.attributes {
    margin: 0px var(--space-md);
}
@include sm {
    .attributes {
        margin: unset;
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
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { useEventListener } from "@vueuse/core";
import { BADGE_NAMES } from "@/constants/badges";
import { useElementSize, useDebounceFn } from "@vueuse/core";

const queryClient = useQueryClient()

const $q = useQuasar();

const route = useRoute();

const hasPlayedGames = computed(() => !!team.value?.games?.length);

const team = computed(() =>
    useRepo(Team).withAll().where("id", route.params.id).first()
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
const viewing = ref(false);
const badgesOpen = ref(false);

const teamRequests = computed(() =>
    useTeamRequestStore().requests?.filter(
        ({ team_id }) => team_id === Number(route.params.id) ?? []
    )
);

const badgesLoaded = ref(false);
const headerLoaded = ref(false);

const { sortAlphabetically } = useSort();
const getBadges = async (team_id: number) => {

    const client = useSupabaseClient();
    const { data } = await client
        .from("badges")
        .select("*")
        .eq("team_id", team_id)
        .order("created_at", { ascending: false });
    return data;
};



const featuredBadge = computed(() => [...badges.value].find(({id}) => id === team.value.featured_badge_id));
const badgesLimited = computed(() =>
    [...badges.value].filter(({id}) => id !== team.value.featured_badge_id).splice(0, $q.screen.xs ? 1 : 3)
);

const {setLoading} = useLoading();
const { isLoading, data: badges } = useQuery({
    queryKey: ["team", "badges", Number(route.params.id)],
    queryFn: () => getBadges(Number(route.params.id)),
    select: (val) => {
        badgesLoaded.value =  true;
        return val;
    }
});



const pageReady = computed(() => badgesLoaded.value && headerLoaded.value)

watch(pageReady, (val) => {
    if (!val) return;
    setTimeout(() => {
 setLoading(false)
    }, 50)
   
})

useEventListener(window, "popstate", () => {
    console.log("popstate");
    if (badgesOpen.value) {
        history.go(1);
        badgesOpen.value = false;
    }
    if (viewing.value) {
        history.go(1);
        viewing.value = false;
    }
});

const badgesContainer = ref(null);
const { width } = useElementSize(badgesContainer);
const badgeWidth = computed(() => `${width.value / 2 - 3}px`);

const selectingFeatured = ref(false);

const beginSelectFeatured = () => {
    selectingFeatured.value = true;
    badgesOpen.value = true;
}

const selectFeaturedBadge = async (event, featured_badge_id) => {
    if (!selectingFeatured.value) return;
        useRepo(Team).where('id', Number(route.params.id)).update({
        featured_badge_id
    })
    saveFeaturedBadge(featured_badge_id);

}

const saveFeaturedBadge = useDebounceFn(async (featured_badge_id) => {
    const client = useSupabaseClient();
    await client.from('teams').update({
        featured_badge_id,
    }).eq('id', Number(route.params.id))
    queryClient.invalidateQueries({
        queryKey: ['team', 'page', Number(route.params.id)],
})
}, 2000)
</script>
<script lang="ts">
export default {
    name: "TeamPage",
};
</script>
