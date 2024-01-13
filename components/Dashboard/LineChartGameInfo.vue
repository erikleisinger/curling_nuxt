<template>
    <div v-if="!isLoading" class="game-info">
        <div class="text-caption">
            {{ toTimezone(gameData?.start_time, "MMMM D, YYYY") }} vs  {{ opposition?.name }}
        </div>
       <h3>{{ props.data?.points_for }}-{{ props.data?.points_against }} {{props.data?.win ? 'win' : props.data?.tie ? 'tie' : 'loss'}}</h3>
       <h2>{{value}}</h2>
       <div>{{title}}</div>
       
    </div>
</template>
<style lang="scss" scoped>
    .game-info {
        min-width: 200px;
        h3 {
            @include reg-text;
        }
    }
</style>
<script setup>
import { useQuery } from "@tanstack/vue-query";
import Team from "@/store/models/team";
import Rink from "@/store/models/rink";
import Sheet from "@/store/models/sheet";
import {STAT_FIELDS_TOTAL, STAT_NAMES} from '@/constants/stats'
const props = defineProps({
    data: Object,
    type: String,
});

const { toTimezone } = useTime();

const value = computed(() => STAT_FIELDS_TOTAL[props.type](props.data))

const title = STAT_NAMES[props.type]

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

const { isLoading, data: gameData } = useQuery({
    queryKey: ["game", "info", props.gameId],
    queryFn: getGameInfo,
    refetchOnWindowFocus: false,
});

const opposition = computed(() => {
    const { home, away, placeholder_away } = gameData.value ?? {};
    if (!gameData.value) return {};
    if (home?.id === props.data.team_id) return away ?? {name: placeholder_away};
    return home;
});
</script>
