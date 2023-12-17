<template>
    <div class="badge__container" @click="showMore = true">
        <div class="row no-wrap items-center q-mb-sm">
            <div class="relative-position">
                <BadgeIcon height="2em" class="q-mr-sm" :badge="badge.name" />
            </div>
            <div>
                <h2 class="text-sm text-bold">{{ BADGE_NAMES[badge.name] }}</h2>
            </div>
        </div>
        <div class="text-sm badge-description">
            {{ BADGE_DESCRIPTIONS[badge.name] }}
        </div>
        <div class="row no-wrap justify-end">
            <div
                v-if="typeof badge.team_id === 'object'"
                class="row flex-grow-1 h-100"
            >
                <div
                    v-for="teamId in badge.team_id"
                    :key="teamId"
                    class="avatar-container"
                >
                    <TeamAvatar :teamId="teamId" viewable />
                </div>
            </div>
            <div
                class="avatar-container"
                v-else-if="showTeam && !!badge.team_id"
            >
                <TeamAvatar :teamId="badge.team_id" viewable />
            </div>
            <div class="text-xs text-right">
                {{ toTimezone(badge.created_at, null, false, true).fromNow() }}
            </div>
        </div>
    </div>
    <DialogInfo v-if="!!showMore" @close="showMore = false">
        <div class="column items-center">
            <BadgeIcon height="4em" class="q-mr-sm" :badge="badge.name" />
            <h2 class="text-md text-bold" style="margin-top: 8px">
                {{ BADGE_NAMES[badge.name] }}
            </h2>
            <p class="text-sm text-italic">
                {{ BADGE_DESCRIPTIONS[badge.name] }}
            </p>
          
            <p class="text-sm row justify-center text-center" v-if="!!game">
               {{game.points_for}}
               {{'-'}}
                {{game.points_against}}
               {{game.points_for > game.points_against ? 'win' : game.points_against > game.points_for ? 'loss' : 'tie'}}
                vs. 
                <div style="width: 1.2em; margin: 0px 4px">
                        <TeamAvatar :teamId="game.team.id"/>
                    </div>
                    {{game.team.name}}
                   <div class="col-12">
                         on {{ toTimezone(badge.created_at, "MMMM DD, YYYY", false) }}
                   </div>
            </p>
            <p class="text-sm text-center text-italic">
                {{globalCount}}% of teams have this badge.
            </p>

        </div>
    </DialogInfo>
</template>
<style lang="scss" scoped>
.badge__container {
    cursor: pointer;
    display: grid;
    grid-template-rows: 2.5em 2.5em 1em;
    padding: var(--space-xs);
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.015);
    height: min-content;
    max-width: v-bind(badgeWidth);
    min-width: v-bind(badgeWidth);
    box-sizing: border-box;
    @include sm {
        max-width: v-bind(badgeWidth);
        min-width: v-bind(badgeWidth);
    }
    .badge-description {
        min-height: 2em;
    }
    .avatar-container {
        width: 1em;
        margin-right: var(--space-xs);
    }
}
</style>
<script setup>
import { BADGE_NAMES, BADGE_DESCRIPTIONS } from "@/constants/badges";
import {useQuery} from '@tanstack/vue-query'
const props = defineProps({
    badge: Object,
    showTeam: Boolean,
    width: {
        type: String,
        default: "150px",
    },
});

const showMore = ref(false);

const badgeWidth = computed(() => `min(50%, ${props.width})`);

const isShowing = computed(() => showMore.value)

const { toTimezone } = useTime();
const {getGames} = useGame();

const {isLoading, data: game} = useQuery({
    queryKey: ['game', Number(props.badge.game_id)],
     queryFn: () =>
        getGames({
            team_id_param: null,
            game_id_param: Number(props.badge.game_id),
        }),
    select: (teams) => {
        const opposition = teams.find(({team_id}) => team_id !== props.badge.team_id)
        const home = teams.find(({team_id}) => team_id === props.badge.team_id)
        return {
            ...opposition,
            points_for: home.points_scored,
            points_against: opposition.points_scored
        }
    },
    enabled: isShowing
})

const getBadgeCountGlobal = async () => {
    const client = useSupabaseClient();
    const {data} = await client.from('badges').select('*').eq('name', props.badge.name).eq('earned', true)

    const {data: teams} = await client.from('teams').select('id');

    const numTeamsWithBadge = data?.length ?? 0;
    const numTeams = teams?.length ?? 0;
    return Number(((numTeamsWithBadge / numTeams)  * 100).toFixed(0))
}

const {isLoading: isLoadingGlobalCount, data: globalCount} = useQuery({
    queryKey: ['badge', 'globalcount', props.badge.name],
    queryFn: getBadgeCountGlobal,
    enabled: isShowing
})
</script>
<script>
export default {
    name: "Badge",
};
</script>
