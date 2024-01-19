<template>
<div class="container" v-if="!isLoadingGames" ref="container">
    <GamePageHeader :gameId="gameId" />
    <GamePageSummary :gameId="gameId" />
    <div class="details">
    <GamePageLinescore :gameId="gameId" />
    <GameStatsView :gameId="gameId" />
    </div>
    <GamePageDeleteHandler :gameId="gameId"/>
</div>
</template>
<style lang="scss" scoped>    
.floating {
        position: fixed;
        left: v-bind(editPosLeft);
        bottom: 0;
        margin: auto;
        width: fit-content;
        padding: var(--space-md);

    }
.container {
    position: relative;
    padding-bottom: var(--space-xl);
    &:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        width: 3px;
        height: 100%;
        border-left: 1px solid rgba(0, 0, 0, 0.08);
        border-right: 1px solid rgba(0, 0, 0, 0.08);
    }
}
    .details {
        @include sm {
  padding: 0px var(--space-xl);
        }
        margin-bottom: var(--space-xxl)
      
    }
</style>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import { createSheet } from "@/utils/create-game";
import { useNotificationStore } from "@/store/notification";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import {useElementBounding} from '@vueuse/core'
import Rink from '@/store/models/rink';
import Sheet from '@/store/models/sheet';
import Game from '@/store/models/game';
import Team from '@/store/models/team';
import GameTeam from '@/store/models/game-team'

const props = defineProps({
    gameId: Number
})



const {isOnTeam} = useTeam();
// const canEdit = computed(() => isOnTeam(teams.value?.home?.team_id) || isOnTeam(teams.value?.away?.team_id))

const score = ref({});
const stats = ref({});

const editedGame = ref(null);

const { setLoading } = useLoading();

const dayjs = useDayjs();

const getGame = async () => {
    const client = useSupabaseClient();
    const {data } = await client.from('games_full').select(`
        id,
        start_time,
        rink:rink_id(
            id,
            name,
            city,
            province,
            sheets
        ),
        conceded,
        sheet:sheet_id(
            id,
            number
        ),
        hammer_first_end,
        end_early,
        ends_played,
        end_count
    `).eq('id', props.gameId).single()
    const {rink, sheet, start_time, ...rest} = data;
    if(rink) useRepo(Rink).save(rink);
    if (sheet) useRepo(Sheet).save(sheet);
    useRepo(Game).save({
        ...rest,
        start_time: dayjs(start_time).unix(),
        rink_id: rink?.id,
        sheet_id: sheet?.id
    })

     const {data: gameScoreData} = await client.from('game_scores').select(`
        team:team_id(
            id,
            name,
            avatar_url
        ),
        pending,
        game_id,
        color,
        placeholder,
        points_scored

    `).eq('game_id', props.gameId);

    gameScoreData.forEach((gameScore) => {
         const {team, game_id, points_scored, color, placeholder, pending} = gameScore;
        useRepo(Team).save(team)
        useRepo(GameTeam).save({
            team_id: team?.id,
            game_id,
            points_scored,
            color,
            placeholder,
            pending

        })
    })


   


return {...data, ...gameScoreData};
}

const gameLoaded = ref(false);

const {
    isLoading: isLoadingGames,
    isSuccess: isGamesDone,
    data: currentGame,
} = useQuery({
    queryKey: ["game", props.gameId],
    queryFn: getGame,
    select: (val) => {
        gameLoaded.value = true;
        return val;
    },
});

const pageReady = computed(() => gameLoaded.value);

watch(pageReady, (val) => {
    if (!val) return;
    setLoading(false);
});
    const {getColor} = useColor();

const { toUTC } = useTime();

const queryClient = useQueryClient();

const notStore = useNotificationStore();

const refreshGame = () => {
    queryClient.invalidateQueries({
        queryKey: ["game", props.gameId],
    });
};

const getBadges = async () => {
    const client = useSupabaseClient();
    const {data} = await client.from('badges').select('*').eq('game_id', props.gameId);
}

onMounted(() => {
    getBadges()
})

const updated = ref(false);

const onUpdate = async (val) => {
    if (updated.value) {
        updated.value = false;
        return;
    }
    updated.value = true;
    const notId = notStore.addNotification({
        text: "Updating game...",
        state: "pending",
    });
    const { start_time, rink = {}, sheet = {}, league = {} } = val;
    const { id: rink_id } = rink ?? {};
    const { number: sheet_number } = sheet || {};
    const { id: league_id } = league || {};

    let sheet_id;
    if (sheet_number) sheet_id = await createSheet(rink_id, sheet_number);

    const updates = {};
    if (sheet_id) updates.sheet_id = sheet_id;
    if (rink_id) updates.rink_id = rink_id;
    if (start_time) updates.start_time = toUTC(start_time, null, true);
    if (league_id) updates.league_id = league_id;
    const client = useSupabaseClient();
    const { error } = await client
        .from("games")
        .update(updates)
        .eq("id", props.gameId);
    if (!error) refreshGame();

    if (error) {
        notStore.updateNotification(notId, {
            state: "failed",
            text: `Error updating game. Please refresh the page and try again.`,
        });
    } else {
        notStore.updateNotification(notId, {
            state: "completed",
            text: `Game updated!`,
            timeout: 1000,
        });
    }
};

const { toTimezone } = useTime();
const $q = useQuasar()

const container = ref(null)
const {width, left} = useElementBounding(container)
const editPosLeft = computed(() => `${left.value + width.value - 100}px`)
</script>
<script>
export default {
    name: "Game",
};
</script>
