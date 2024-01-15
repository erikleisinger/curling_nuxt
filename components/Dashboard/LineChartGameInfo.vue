<template>
    <div v-if="!isLoading" class="game-info">
        <DialogCard
            maxWidth="95vw"
            minWidth="200px"
            :titleColor="getColor(STAT_COLORS[type])"
        >
            <template v-slot:title>
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
                                :teamId="gameData.home?.id"
                                :color="gameData?.home_color"
                                :hammer="
                                    gameData?.hammer_first_end ===
                                    gameData.home?.id
                                "
                            />
                        </div>
                    </template>
                    <template v-slot:avatarAway>
                        <div style="width: 18px">
                            <TeamAvatar
                                :teamId="gameData.away?.id"
                                :color="gameData?.away_color"
                                :hammer="
                                    gameData?.hammer_first_end ===
                                    gameData.away?.id
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
}
</style>
<script setup>
import { useQuery } from "@tanstack/vue-query";
import Team from "@/store/models/team";
import Rink from "@/store/models/rink";
import Sheet from "@/store/models/sheet";
import {
    STAT_FIELDS_TOTAL,
    STAT_NAMES,
    STAT_TYPES,
    STAT_COLORS,
} from "@/constants/stats";
const props = defineProps({
    data: Object,
    gameId: Number,
    type: String,
});

const { toTimezone } = useTime();
const { getColor } = useColor();

const HIDE_TYPE_TYPES = [STAT_TYPES.WINS];
const BOOLEAN_STAT_TYPES = [
    STAT_TYPES.HAMMER_LAST_END,
    STAT_TYPES.HAMMER_FIRST_END,
];

const value = computed(() => STAT_FIELDS_TOTAL[props.type](props.data));

const title = STAT_NAMES[props.type];

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
            length: Math.max(gameData.value?.end_count, details?.length),
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
                              gameData.value?.home?.id
                            ? details[index]?.points_scored
                            : 0,
                    away:
                        details[index]?.points_scored === null
                            ? "X"
                            : details[index]?.scoring_team_id ===
                                  gameData.value?.away?.id ||
                              !gameData.value?.away?.id
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
        .from("games")
        .select(
            `
        start_time,
            rink:rink_id (
                id,
                name,
                city,
                province,
                sheets
            ),
            sheet:sheet_id (
                id,
                number,
                rink_id
            ),
            home (
                id,
                name,
                avatar_url
            ),
            away (
                id,
                name,
                avatar_url
            ),
            home_color,
            away_color,
            placeholder_away,
            end_count,
            hammer_first_end
        `
        )
        .eq("id", props.data.game_id)
        .single();

    const { sheet, rink, home, away } = data;
    if (rink) useRepo(Rink).save(rink);
    if (sheet) useRepo(Sheet).save(sheet);
    if (home) useRepo(Team).save(home);
    if (away) useRepo(Team).save(away);

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
    const { home, away, placeholder_away } = gameData.value ?? {};
    if (!gameData.value) return {};
    if (home?.id === props.data.team_id)
        return away ?? { name: placeholder_away };
    return home;
});
</script>
