<template>
    <div v-if="!isLoading" class="game-info">
        <div class="row items-center" :style="{backgroundColor: getColor(STAT_COLORS[type])}">
          
            <!-- <h2 v-if="!BOOLEAN_STAT_TYPES.includes(type)">{{ value }}</h2>
            <q-icon
                :name="value ? 'check_circle' : 'cancel'"
                size="1.6em"
                :style="{ color: value ? getColor('mint') : getColor('red') }"
                v-else
            />
            <h1 v-if="!HIDE_TYPE_TYPES.includes(type)" class="q-pl-xs">
                {{ title }}
            </h1> -->
        </div>
        <!-- <q-separator class="q-my-sm"/> -->
      
        <div class="text-caption">
            vs.
            <TeamChip :teamId="opposition?.id" :teamName="opposition?.name" />
        </div>

        <div class="text-caption">
            {{ toTimezone(gameData?.start_time, "MMMM D, YYYY") }}
        </div>
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
}
</style>
<script setup>
import { useQuery } from "@tanstack/vue-query";
import Team from "@/store/models/team";
import Rink from "@/store/models/rink";
import Sheet from "@/store/models/sheet";
import { STAT_FIELDS_TOTAL, STAT_NAMES, STAT_TYPES, STAT_COLORS } from "@/constants/stats";
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
            placeholder_away
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
});

const opposition = computed(() => {
    const { home, away, placeholder_away } = gameData.value ?? {};
    if (!gameData.value) return {};
    if (home?.id === props.data.team_id)
        return away ?? { name: placeholder_away };
    return home;
});
</script>
