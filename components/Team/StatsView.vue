<template>
    <div
        class="full-height no-wrap"
        :class="{ column: !showTeamComparison, row: !!showTeamComparison }"
    >
        <q-inner-loading :showing="loadingComparison" color="primary" />
          <div
                        class="col-12 col-sm-6 row full-width view-more__container"
                        v-show="!!viewDetails?.length"
                    >
                        <ChartTeamHammerEfficiencyTime
                            :teamId="team.id"
                            v-if="!showTeamComparison && !!viewDetails.length"
                            :visibleStats="viewDetails"
                            @close="viewDetails = []"
                        />
                    </div>
        <div
            class="stats__container column no-wrap"
            v-if="
                !loadingComparison && ($q.screen.gt.xs || !viewDetails?.length)
            "
            :class="{
                'col-12': $q.screen.xs || !viewDetails.length,
                'col-6': viewDetails.length && !$q.screen.xs,
            }"
        >
            <!-- <div class="toolbar">
                <q-btn flat round icon="edit" />
            </div> -->
          
                  
            
            <div
                class="column no-wrap"
                v-for="badge in fields"
                :key="`percentage-${badge}`"
            >
               
                <div
                    v-if="showTeamComparison && !!oppositionTeam"
                    class="q-mt-md row no-wrap"
                >
                    <div class="row col-grow justify-start items-center">
                        <div class="team-avatar__container">
                            <TeamAvatar
                                :team="team"
                                style="height: inherit; width: inherit"
                                :style="{
                                    'margin-top':
                                        team.avatar_type === 'avataar'
                                            ? '20%'
                                            : '',
                                }"
                            />
                            <q-tooltip>
                                {{ team.name }}
                            </q-tooltip>
                        </div>
                    </div>
                    <div>
                        <h2 class="text-md q-mr-md text-bold text-center">
                            {{ BADGE_TITLES_PLAIN[badge] }}
                        </h2>
                        <h3 class="text-sm text-center">
                            {{ BADGE_DESCRIPTIONS_PLAIN[badge] }}
                        </h3>
                    </div>
                    <div class="row col-grow justify-end items-center">
                        <div class="team-avatar__container">
                            <TeamAvatar
                                :team="oppositionTeam"
                                style="height: inherit; width: inherit"
                            />
                            <q-tooltip>
                                {{ oppositionTeam.name }}
                            </q-tooltip>
                        </div>
                    </div>
                </div>
                <div class="row col-12 no-wrap">
                    <div
                        :class="
                            showTeamComparison && !!oppositionTeam
                                ? 'col-6 q-pr-md'
                                : 'col-12'
                        "
                    >
                        <TeamStatsViewPercentage
                            class="full-width"
                            :badge="badge"
                            :teamId="team.id"
                            :numerator="team[BADGE_FIELDS[badge].numerator]"
                            :denominator="team[BADGE_FIELDS[badge].denominator]"
                            @showMore="viewMore(BADGE_TITLES_PLAIN[badge])"
                            :visible="
                                viewDetails.includes(BADGE_TITLES_PLAIN[badge])
                            "
                            :dense="showTeamComparison && !!oppositionTeam"
                            :prependPercent="
                                showTeamComparison && !!oppositionTeam
                            "
                        />
                    </div>
                    <div
                        class="col-6 q-pl-md"
                        v-if="showTeamComparison && oppositionTeam"
                    >
                        <TeamStatsViewPercentage
                            class="full-width"
                            :badge="badge"
                            :teamId="oppositionTeam.id"
                            :numerator="
                                oppositionTeam[BADGE_FIELDS[badge].numerator]
                            "
                            :denominator="
                                oppositionTeam[BADGE_FIELDS[badge].denominator]
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
            </div>
            <!-- <div
                class="row justify-between items-center full-width no-wrap stats__container--pie"
            >
                <div>
                    <div class="row">
                        <h2 class="text-md q-mr-md text-bold clickable">
                            Points for per game
                        </h2>
                    </div>
                    <h3 class="text-sm clickable">
                        Average points scored vs. average points conceded
                    </h3>
                </div>
                <div style="margin-right: -8px">
                    <ChartTeamPointsPerGame
                        :for="team.points_for / team.games_played"
                        :against="team.points_against / team.games_played"
                        :teamId="team.id"
                        :height="90"
                    />
                </div>
            </div>
            <div
                class="row justify-between items-center full-width no-wrap stats__container--pie"
            >
                <div>
                    <div class="row">
                        <h2 class="text-md q-mr-md text-bold clickable">
                            Ends per game
                        </h2>
                    </div>
                    <h3 class="text-sm clickable">
                        Average ends won vs. average ends lost
                    </h3>
                </div>
                <div style="margin-right: -8px">
                    <ChartTeamPointsPerGame
                        :for="team.ends_for / team.games_played"
                        :against="team.ends_against / team.games_played"
                        :teamId="team.id"
                        :height="90"
                    />
                </div>
            </div> -->
        </div>

        <div
            class="stats__container row col-6"
            v-if="showTeamComparison && oppositionTeam"
        >
            <!-- <q-btn @click="toggleTeamComparison">Hi</q-btn> -->
            <TeamStatsViewPercentage
                v-for="badge in fields"
                :key="`percentage-opp-team-${badge}`"
                class="col-12"
                :badge="badge"
                :teamId="oppositionTeam.id"
                :numerator="oppositionTeam[BADGE_FIELDS[badge].numerator]"
                :denominator="oppositionTeam[BADGE_FIELDS[badge].denominator]"
                @showMore="viewMore(BADGE_TITLES_PLAIN[badge])"
                :visible="viewDetails.includes(BADGE_TITLES_PLAIN[badge])"
                dense
                reverse
            />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.team-avatar__container {
    height: 3em;
    width: 3em;
}
.stats__container--pie {
    padding: var(--space-md) 0px;
    border-bottom: 1px solid $grey-4;
}
.stats__container {
    padding: 0px var(--space-md);
    border-radius: 8px;
    overflow: auto;
    // overflow-x: hidden;
    .toolbar {
        padding: var(--space-sm);
    }
}
.view-more__container {
    overflow: auto;
    position: relative;
    height: v-bind(viewerHeight);
    .view-details-back__container {
        position: absolute;
        padding: var(--space-xs);
        right: 0;
    }
    @include sm {
        border-top: 1px solid $grey-5;
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

const props = defineProps({
    teamId: Number,
    teamName: {
        type: String,
        default: "<TEAM>",
    },
    viewerHeight: String,
});

const EXCLUDE_FIELDS = ["survivalist"];
const fields = Object.keys(BADGE_FIELDS).filter(
    (f) => !EXCLUDE_FIELDS.includes(f)
);

const $q = useQuasar();

const viewDetails = ref([]);
const detailsType = ref(null);

const viewMore = (str) => {
    console.log('VIEW MORE')
    if (viewDetails.value.includes(str)) {
        console.log('IF')
        const index = viewDetails.value.indexOf(str);
        viewDetails.value.splice(index, 1);
  
    } else {
        console.log('ELSE')
        viewDetails.value.push(str);

    }
          console.log(viewDetails.value)
};

const team = ref(
    useUserTeamStore().userTeams.find((t) => t.id === props.teamId)
);

const oppositionTeam = ref(null);

const showTeamComparison = ref(false);

const oppositionId = 77;

const toggleTeamComparison = () => {
    viewDetails.value = [];
    showTeamComparison.value = !showTeamComparison.value;
    if (showTeamComparison.value) getComparisonTeam();
};

const loadingComparison = ref(false);

const getComparisonTeam = async () => {
    loadingComparison.value = true;
    const { data } = await useSupabaseClient()
        .from("games")
        .select("id")
        .or(`home.eq.${props.teamId},away.eq.${props.teamId}`)
        .or(`home.eq.${oppositionId},away.eq.${oppositionId}`);
    const games = data?.map(({ id }) => id) || [];

    //TODO inform user there have been no games
    if (!games?.length) return;

    const { data: stats } = await useSupabaseClient()
        .from("team_stats")
        .select(
            `
        *,
        team:team_id (
            name,
            team_avatar,
            avatar_url,
            avatar_type
        )
        `
        )
        .in("game_id", games);

    console.log("GOT STATS: ", stats);
    const [reference] = stats;

    const EXCLUDE_STATS_FROM_COMPARISON = [
        "id",
        "created_at",
        "game_id",
        "team_id",
        "team",
    ];

    const keys = Object.keys(reference).filter(
        (key) => !EXCLUDE_STATS_FROM_COMPARISON.includes(key)
    );

    const myTeam = {};
    const oppTeam = {};

    keys.forEach((key) => {
        myTeam[key] = stats.reduce((all, current) => {
            if (current.team_id !== props.teamId) return all;
            return all + current[key];
        }, 0);

        oppTeam[key] = stats.reduce((all, current) => {
            if (current.team_id !== oppositionId) return all;
            return all + current[key];
        }, 0);
    });

    const oneOppositionEntry = stats.find(
        ({ team_id }) => team_id === oppositionId
    );

    const { avatar_type, avatar_url, team_avatar, name } = { ...team.value };

    team.value = {
        ...myTeam,
        games_played: stats.length / 2,
        avatar_type,
        avatar_url,
        team_avatar,
        name,
    };
    oppositionTeam.value = {
        ...oppTeam,
        games_played: stats.length / 2,
        ...oneOppositionEntry.team,
    };

    loadingComparison.value = false;
};
</script>
