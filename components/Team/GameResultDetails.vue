<template>
    <div class="content__expandable column" v-if="score && scoreDetails">
        <div style="border-radius: 16px; overflow: hidden; margin-top: 1em">
            <LinescoreGridView
                :game="game"
                :endCount="Math.max(result.end_count, scoreDetails.length)"
                :score="score"
                :selected="0"
                :colorCode="false"
            />
        </div>
        <div class="row">
            <TeamGameResultH2h
                :score="score"
                stat="conversions"
                :game="game"
                :endCount="Math.max(result.end_count, scoreDetails.length)"
                class="col-12 col-sm-6"
                title="Hammer conversion"
                subtitle="Scoring 2+ points with hammer"
            />
            <TeamGameResultH2h
                :score="score"
                stat="forces"
                :game="game"
                :endCount="Math.max(result.end_count, scoreDetails.length)"
                class="col-12 col-sm-6"
                title="Force efficiency"
                subtitle="Without hammer, forcing opposition to 1"
            />
            <TeamGameResultH2h
                :score="score"
                stat="steals"
                :game="game"
                :endCount="Math.max(result.end_count, scoreDetails.length)"
                class="col-12 col-sm-6"
                title="Steal efficiency"
                subtitle="Scoring without hammer"
            />
            <TeamGameResultH2h
                :score="score"
                stat="hammer"
                :game="game"
                :endCount="Math.max(result.end_count, scoreDetails.length)"
                class="col-12 col-sm-6"
                title="Hammer possession"
                subtitle="% of game with hammer"
            />
        </div>
    </div>
</template>
<style lang="scss" scoped>
$columns: 20% 60% 20%;
.result__container--wrap {
    border-radius: 16px;
    max-height: fit-content;
    border: 1px solid $grey-3;
    margin-bottom: var(--space-sm);
    transition: all 1s;

    .content__expandable {
        transition: all 0.3s;
        height: 0px;
        overflow: hidden;
        padding-left: var(--space-sm);
        padding-right: var(--space-sm);
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;

        height: fit-content;
        padding-bottom: var(--space-sm);
    }
    .score {
        margin: auto !important;
        font-size: min(7vw, 50px);
    }
}
</style>
<script setup>
const props = defineProps({
    result: Object,
});

const scoreDetails = ref(null);

const getScoreDetails = async () => {
    const client = useSupabaseClient();
    const { data } = await client.rpc("get_game_score_detailed", {
        game_id_param: props.result?.id,
    });
    scoreDetails.value = data.sort((a, b) => a.end_number - b.end_number);
};

const score = ref(null);

const getScore = () => {
    score.value = Array.from(
        {
            length: Math.max(
                props.result.end_count,
                scoreDetails.value?.length
            ),
        },
        (_, i) => i + 1
    ).reduce((all, current, index) => {
        if (!scoreDetails.value[index]) {
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
                        scoreDetails.value[index]?.points_scored === null
                            ? "X"
                            : scoreDetails.value[index]?.scoring_team_id ===
                              scoreDetails.value[index]?.home_team
                            ? scoreDetails.value[index]?.points_scored
                            : 0,
                    away:
                        scoreDetails.value[index]?.points_scored === null
                            ? "X"
                            : scoreDetails.value[index]?.scoring_team_id ===
                              scoreDetails.value[index]?.away_team
                            ? scoreDetails.value[index]?.points_scored
                            : 0,
                    ...scoreDetails.value[index],
                },
            };
        }
    }, {});
};

const game = ref({});

const generateFormattedGame = () => {
    const home = {
        id: props.result.home_id,
        team_avatar: props.result.home_avatar,
        avatar_type: props.result.home_avatar_type,
        avatar_url: props.result.home_avatar_url,
    };
    const away = {
        id: props.result.away_id,
        team_avatar: props.result.away_avatar,
        avatar_type: props.result.away_avatar_type,
        avatar_url: props.result.away_avatar_url,
    };
    const homeColor = props.result.home_color;
    const awayColor = props.result.away_color;

    game.value = {
        home,
        away,
        homeColor,
        awayColor,
        hammerFirstEnd: props.result.hammer_first_end,
    };
};

onMounted(async () => {
    generateFormattedGame();
    await getScoreDetails();
    await getScore();
});
</script>
