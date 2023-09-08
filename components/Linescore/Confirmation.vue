<template>
    <GameSummary
        :game="{
            home: {
                ...gameParams.home,
                color: gameParams.homeColor,
                points_scored: score.home
            },
            away: {
                ...gameParams.away,
                color: gameParams.awayColor,
                points_scored: score.home
            },
            end_count: score.finalEndCount,
            hammer_first_end: gameParams.hammerFirstEndTeam
        }"
        static
    />
    <LinescoreRinkAndSheet :rink="rink" :sheet="sheet" @update:rink="rink = $event" @update:sheet="sheet = $event"/>
</template>
<script setup>
import { parseAvatar } from "@/utils/avatar";
import { numberToLetter } from "@/utils/sheets";
import { views } from "@/constants/linescore";
const props = defineProps({
    score: Object,
    gameParams: Object,
    startTime: String,
    rink: Object,
    sheet: Number,
});

const emit = defineEmits(["nav", "save"]);

const { format, toTimezone } = useTime();
const dayjs = useDayjs();

const getEndCountText = () => {
    const { finalEndCount, totalEndCount } = props.score;
    if (finalEndCount >= totalEndCount) return `After ${finalEndCount} ends`;
    return finalEndCount;
};

const resultText = computed(() => {
    if (props.score.finalEndCount < props.score.totalEndCount) {
        const concededTeamName =
            props.score.away < props.score.home
                ? props.gameParams.away?.name
                : props.gameParams.home?.name;
        return `${concededTeamName} concedes`;
    }
    if (props.score.home > props.score.away)
        return `${props.gameParams.home?.name} wins!`;
    if (props.score.away > props.score.home)
        return `${props.gameParams.away?.name} wins!`;
    if (props.score.away === props.score.home) return "Draw";
});
</script>
