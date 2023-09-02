<template>
    <div class="row no-wrap" style="overflow: hidden">
        <transition-group
            appear
            enter-active-class="animated slideInLeft"
            leave-active-class="animated slideOutRight"
        >
            <div
                v-if="tab === 'overview'"
                class="overview__container row"
                key="overview"
            >
                <header
                    ref="header"
                    class="col-12 col-sm-6"
                    v-if="tab === 'overview'"
                >
                    <div class="row no-wrap justify-between">
                        <div
                            class="column team__header"
                            :class="comparisonTeam ? 'col-6' : 'col-12'"
                        >
                            <div class="avatar__container">
                                <TeamAvatar
                                    :team="team"
                                    :style="{
                                        marginTop:
                                            team.avatar_type === 'avataaar'
                                                ? '-15%'
                                                : '',
                                    }"
                                />
                            </div>

                            <div class="column items-center">
                                <div class="text-sm">Team</div>
                                <h2 class="text-sm text-bold text-center">
                                    {{ team.name }}
                                </h2>
                            </div>
                        </div>
                        <div
                            class="column team__header col-6"
                            v-if="comparisonTeam"
                        >
                            <div class="avatar__container">
                                <TeamAvatar
                                    :team="comparisonTeam"
                                    :style="{
                                        marginTop:
                                            comparisonTeam.avatar_type ===
                                            'avataaar'
                                                ? '-15%'
                                                : '',
                                    }"
                                />
                            </div>

                            <div class="column items-center">
                                <div class="text-sm">Team</div>
                                <h2
                                    class="text-sm text-bold text-center"
                                    style="white-space: nowrap"
                                >
                                    {{ comparisonTeam.name }}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div class="full-width row justify-center">
                        <div
                            class="attribute__container"
                            v-if="!comparisonTeam"
                        >
                            <div class="row no-wrap">
                                <q-icon
                                    size="1em"
                                    name="track_changes"
                                    color="primary"
                                />
                                <h3 class="text-xs">Games played</h3>
                            </div>
                            <div class="text-md text-bold value">
                                {{ team.games_played }}
                            </div>
                        </div>
                        <div
                            class="attribute__container"
                            v-if="!comparisonTeam"
                        >
                            <div class="row no-wrap">
                                <q-icon
                                    size="1em"
                                    name="emoji_events"
                                    color="amber"
                                />
                                <h3 class="text-xs">Win percentage</h3>
                            </div>
                            <div>
                                <span class="text-md text-bold value">
                                    {{
                                        (
                                            (team.win / team.games_played) *
                                            100
                                        ).toFixed(1)
                                    }}%
                                </span>
                                <span class="text-xs" v-if="team.tie"
                                    >({{
                                        (
                                            (team.tie / team.games_played) *
                                            100
                                        ).toFixed(1)
                                    }}%)</span
                                >
                            </div>
                        </div>
                    </div>
                </header>
                <main class="col-12 col-sm-6">
                    <q-separator v-if="!comparisonTeam" />
                    <div
                        class="row justify-between full-width items-end q-my-sm"
                        v-if="!comparisonTeam"
                    >
                        <div class="row items-center">
                            <q-icon
                                name="token"
                                color="amber"
                                class="text-md q-mr-sm"
                            />
                            <h2 class="text-md text-bold">Badges</h2>
                        </div>
                        <!-- <div class="text-sm link-more" @click="tab = 'stats'">
                            See stats
                        </div> -->
                    </div>
                    <q-separator v-if="!comparisonTeam" />
                    <div class="row badge__container" v-if="!comparisonTeam">
                        <div class="badge" v-for="badge in badges" :key="badge">
                            <Badge :badge="badge" height="3em" />
                        </div>
                    </div>
                    <q-separator v-if="!comparisonTeam" />
                    <div
                        class="row items-end justify-between q-my-sm"
                        v-if="!comparisonTeam"
                    >
                        <div class="row items-center">
                            <q-icon
                                color="blue"
                                name="insights"
                                class="text-md q-mr-sm"
                            />
                            <h3 class="text-md text-bold">Stats</h3>
                        </div>
                        <div
                            class="link-more text-sm"
                            @click="
                                toggleGlobalSearch({
                                    open: true,
                                    options: {
                                        inputLabel:
                                            'Search for a team to compare',
                                        resourceTypes: ['team'],
                                        callback: onSelect,
                                        filterIds: [team.id],
                                    },
                                })
                            "
                        >
                            Team comparison
                        </div>
                    </div>
                    <q-separator v-if="!comparisonTeam" />
                    <div class="stats-view__container">
                        <TeamStatsView
                            :teamId="team?.id"
                            v-if="team"
                            key="stats"
                            viewerHeight="400px"
                            :oppositionId="comparisonTeam?.id"
                        >
                            <template
                                v-slot:prepend="{
                                    team: myTeam,
                                    oppositionTeam,
                                }"
                                v-if="comparisonTeam"
                            >
                                <div class="row justify-around q-mb-sm">
                                    <div class="attribute__container">
                                        <div class="row no-wrap">
                                            <q-icon
                                                size="1em"
                                                name="track_changes"
                                                color="blue"
                                            />
                                            <h3 class="text-xs">
                                                Games played
                                            </h3>
                                        </div>
                                        <div class="text-md text-bold value">
                                            {{ myTeam.games_played }}
                                        </div>
                                    </div>
                                    <div class="attribute__container">
                                                <q-tooltip>
                                                    <div><span class="text-bold">{{myTeam.name}}</span>: {{myTeam.win}} wins </div>
                                                    <div><span class="text-bold">{{oppositionTeam.name}}</span>: {{oppositionTeam.win}} wins </div>
                                                    <div ><span class="text-bold">Ties</span>: {{myTeam.tie}} </div>
                                                </q-tooltip>
                                        <div class="row no-wrap">
                                            <q-icon
                                                size="1em"
                                                name="leaderboard"
                                                color="amber"
                                            />
                                            <h3 class="text-xs">Head to head</h3>
                                        </div>
                                        <div class="text-md text-bold value">
                                           
                                                <div class="row items-center">
                                                        <div class="q-mr-xs" >
                                                        +{{
                                                            myTeam.win -
                                                            oppositionTeam.win
                                                        }}
                                                        
                                                    </div>
                                                    <div

                                                        style="
                                                            height: 1em;
                                                            width: 1em;
                                                        "
                                                        v-if="myTeam.win !== oppositionTeam.win"
                                                    >
                                                        <TeamAvatar
                                                     
                                                            :team="myTeam.win > oppositionTeam.win ? myTeam : oppositionTeam"
                                                        />
                                                    </div>
                                        
                                                    
                                                </div>
                                         
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </TeamStatsView>
                    </div>
                </main>
            </div>
            <main
                class="column select__section full-width no-wrap"
                v-else
                key="other"
            >
                <TeamGameHistory
                    :teamId="team?.id"
                    :team="team"
                    key="gamehistory"
                    v-if="team && tab === 'history'"
                />
            </main>
        </transition-group>
    </div>
</template>
<style lang="scss" scoped>
$avatar-dimension: 7em;

.overview__container {
    padding: var(--space-md);
    width: 100%;
    height: fit-content;
    header {
        margin-bottom: var(--space-md);
    }
    .badge__container {
        padding: var(--space-md) 0px;
        .badge {
            margin-right: var(--space-md);
        }
    }
    .link-more {
        text-decoration: underline;
        cursor: pointer;
    }
    .stats-view__container {
        margin: 0px calc(-1 * var(--space-md));
    }
}

// .select__section {
//     box-shadow: $pretty-shadow;
//     border-top-left-radius: 32px;
//     border-top-right-radius: 32px;

// }
.team__header {
    padding: var(--space-lg);
    padding-bottom: var(--space-sm);

    .avatar__container {
        height: $avatar-dimension;
        max-width: 100%;
        width: $avatar-dimension;
    }
}
.attribute__container {
    padding: var(--space-xs);
    border: 1px solid $grey-4;
    border-radius: 4px;
    margin: 0px var(--space-xs);
    .q-icon {
        margin-right: var(--space-xxs);
    }
    .value {
        margin-left: 1.2em;
    }
}
.team__content--container {
    border-bottom: 1px solid $grey-4;
    .team-header__container {
        padding: var(--space-xs);
        position: sticky;
        top: 0;
        background-color: rgba(255, 255, 255, 0.98);
    }
}
</style>
<script setup>
import { useElementSize } from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";
import { BADGE_FIELDS } from "@/constants/badges";

const props = defineProps({
    team: Object,
});

const tab = ref("overview");

const index = ref(0);

const header = ref(null);
const { height: headerHeight } = useElementSize(header);

const mainHeight = computed(() => `calc(100% - ${headerHeight.value}px)`);

const { hasBadge } = useBadge();
const badges = ref(
    Object.keys(BADGE_FIELDS).reduce((all, key) => {
        if (hasBadge(null, key, props.team)) return [...all, key];
        return all;
    }, [])
);

const { toggleGlobalSearch } = useDialogStore();

const comparisonTeam = ref(null);

const onSelect = (selection) => {
    comparisonTeam.value = {
        ...selection,
        team_avatar: selection.avatar,
    };
    toggleGlobalSearch({ open: false });
};
</script>
