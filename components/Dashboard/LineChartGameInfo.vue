<template>
    <div v-if="!isLoading" class="game-info">
        <DialogCard
            maxWidth="95vw"
            minWidth="200px"
            :titleColor="getColor(STAT_COLORS[type])"
        >
            <template v-slot:title>
                <div class="row no-wrap">
                <div class="relative-position">
                    <h3>
                        {{ props.data?.points_for }}-{{
                            props.data?.points_against
                        }}
                        {{
                            props.data?.win
                                ? "win"
                                : props.data?.tie
                                ? "tie"
                                : "loss"
                        }}
                    </h3>
                    <div class="text-caption title-caption">
                        vs.
                        <TeamChip
                            :teamId="opposition?.id"
                            :teamName="opposition?.name"
                        />
                    </div>
                </div>  
                <div class="total-container">
                <h2 :style="{ color: getColor(STAT_COLORS[type]) }">{{props.data.raw.toFixed(isPercent ? 0 : 1)}}
                    <span v-if="isPercent" class="text-caption" style="margin-left: -0.7em">
                        %
                    </span>
                </h2> 
                </div>
                </div>
            </template>

            <template v-slot:content>
                <div
                    class="row items-center"
                    :style="{ backgroundColor: getColor(STAT_COLORS[type]) }"
                ></div>

                <LinescoreGrid
                    v-if="score"
                    :score="score"
                    style="padding: unset"
                >
                    <template v-slot:avatarHome>
                        <div style="width: 18px">
                            <TeamAvatar
                                :teamId="home?.team_id"
                                :color="home?.color"
                                :hammer="
                                    game?.hammer_first_end ===
                                    home?.team_id
                                "
                            />
                        </div>
                    </template>
                    <template v-slot:avatarAway>
                        <div style="width: 18px">
                            <TeamAvatar
                                :teamId="away?.team_id"
                                :color="away?.color"
                                :hammer="
                                    game?.hammer_first_end ===
                                    away?.team_id
                                "
                            />
                        </div>
                    </template>
                </LinescoreGrid>
                <div class="footer-caption row justify-between items-center">
                    <div class="text-caption ">
                    {{ toTimezone(gameData?.start_time, "MMMM D, YYYY") }}
                    </div>
                    <q-btn flat round icon="open_in_new"   :style="{ color: getColor(STAT_COLORS[type]) }" dense size="0.5em" @click="navigateTo(`/games/${data.game_id}`)"/>
                </div>
            </template>
        </DialogCard>
    </div>
</template>
<style lang="scss" scoped>
.game-info {
    min-width: 200px;
    h3 {
        @include md-text;
    }
    h1 {
        @include smmd-text;
    }

    .title-caption {
        font-family: $font-family-secondary;
    }

    .footer-caption {
        margin-top: var(--space-xs);
        // text-align: right;
        font-style: italic;
    }
    .total-container {
        background-color: white;
        margin-left: var(--space-xs);
        height: 100%;
        padding: var(--space-sm);
        margin-top: calc(-1 * var(--space-sm));
        margin-right: calc(-1 * var(--space-sm));
        margin-bottom: calc(-1 * (var(--space-sm) - 0px));
        border-bottom-left-radius: 16px;
        flex-grow: 1;
        h2 {
            @include lg-text;
            text-align: center;

        }
    }
}
</style>
<script setup>
import { useQuery } from "@tanstack/vue-query";
import Team from "@/store/models/team";
import Game from '@/store/models/game';
import GameTeam from '@/store/models/game-team'
import {
    STAT_FIELDS_TOTAL,
    STAT_NAMES,
    STAT_TYPES,
    STAT_COLORS,
    NON_PERCENT_STATS
} from "@/constants/stats";
const props = defineProps({
    data: Object,
    gameId: Number,
    type: String,
});
const isPercent = !NON_PERCENT_STATS.includes(props.type);
const { toTimezone } = useTime();
const dayjs = useDayjs();
const { getColor } = useColor();

const HIDE_TYPE_TYPES = [STAT_TYPES.WINS];
const BOOLEAN_STAT_TYPES = [
    STAT_TYPES.HAMMER_LAST_END,
    STAT_TYPES.HAMMER_FIRST_END,
];

const value = computed(() => STAT_FIELDS_TOTAL[props.type](props.data));

const title = STAT_NAMES[props.type];

const game = computed(() => useRepo(Game).where('id', props.data.game_id).first())
const home = computed(() => useRepo(GameTeam).with('team').where('game_id', props.data.game_id).offset(0).first())
const away = computed(() => useRepo(GameTeam).with('team').where('game_id', props.data.game_id).offset(1).first())

const getScoreDetails = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("ends")
        .select(
            `
        id,
        end_number,
        scoring_team_id,
        hammer_team_id,
        points_scored
    `
        )
        .eq("game_id", props.gameId);
    return data;
};

const generateScore = async () => {
    const details = await getScoreDetails();
    const s = Array.from(
        {
            length: Math.max(game?.value?.end_count, details?.length),
        },
        (_, i) => i + 1
    ).reduce((all, current, index) => {
        if (!details[index]) {
            return {
                ...all,
                [index + 1]: {
                    home: "X",
                    away: "X",
                },
            };
        } else {
            return {
                ...all,
                [index + 1]: {
                    home:
                        details[index]?.points_scored === null
                            ? "X"
                            : details[index]?.scoring_team_id ===
                              home.value?.team_id
                            ? details[index]?.points_scored
                            : 0,
                    away:
                        details[index]?.points_scored === null
                            ? "X"
                            : details[index]?.scoring_team_id ===
                                  away.value?.team_id 
                            ? details[index]?.points_scored
                            : 0,
                    ...details[index],
                },
            };
        }
    }, {});
    return s;
};

const score = ref(null);

const getScore = async () => {
    score.value = await generateScore();
};

const getGameInfo = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("game_scores")
        .select(
            `
            team:team_id (
                id,
                name,
                avatar_url
            ),
            game:game_id(
                id,
                start_time,
                end_count
            ),
            color,
            placeholder,
            pending,
            points_scored
        `
        )
        .eq("game_id", props.data.game_id)
    
    const {data:gameInfoData} = await client.from('games_full').select(`
        end_count,
        hammer_first_end,
        conceded
        
    `).eq('id', props.data.game_id).single()
      

    data.forEach((item) => {
        const {team, game, pending, color, placeholder, points_scored} = item;
        const {end_count, hammer_first_end, conceded} = gameInfoData;
        console.log(team, placeholder)
        useRepo(Team).save({
            ...team
        });
        useRepo(Game).save({
            ...game,
            start_time: dayjs(game.start_time).unix(),
            end_count,
            hammer_first_end,
            conceded
        })
        useRepo(GameTeam).save({
            game_id: game?.id,
            team_id: team?.id,
            pending,
            color,
            placeholder,
            points_scored
        })

    })
    

    return data;
};

const { gameId } = toRefs(props);

const { isLoading, data: gameData } = useQuery({
    queryKey: ["game", "info", gameId],
    queryFn: getGameInfo,
    refetchOnWindowFocus: false,
    select: (val) => {
        getScore();
        return val;
    },
});

const opposition = computed(() => {
    if (home.value?.team_id === props.data.team_id)
        return !away.value?.id ? {
    id: 0,
    name: away.value?.placeholder} : away.value?.team
    return home.value?.team
});
</script>
