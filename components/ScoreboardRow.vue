<script setup>
const props = defineProps({
    color: String,
    ends: {
        type: Array,
        default() {
            return [
                {
                    end_number: 1,
                    points_scored: 1,
                    scoring_team: 1,
                    hammer_team: 1,
                },
                {
                    end_number: 2,
                    points_scored: 1,
                    scoring_team: 1,
                    hammer_team: 2,
                },
                {
                    end_number: 3,
                    points_scored: 2,
                    scoring_team: 2,
                     hammer_team: 2,

                },
                {
                    end_number: 4,
                    points_scored: 1,
                    scoring_team: 1,
                     hammer_team: 1,
                },
                {
                    end_number: 5,
                    points_scored: 1,
                    scoring_team: 2,
                    hammer_team: 2,
                },
                {
                    end_number: 6,
                    points_scored: 0,
                    scoring_team: 1,
                    hammer_team: 1,
                },
                {
                    end_number: 7,
                    points_scored: 2,
                    scoring_team: 1,
                    hammer_team: 2,
                },
                {
                    end_number: 8,
                    points_scored: 4,
                    scoring_team: 2,
                    hammer_team: 2,
                },
                {
                    end_number: 9,
                    points_scored: 0,
                    scoring_team: 1,
                    hammer_team: 1,
                },
                {
                    end_number: 10,
                    points_scored: 0,
                    scoring_team: 1,
                    hammer_team: 2,
                },
            ];
        },
    },
    teamId: Number,
});

const scoreResults = computed(() => {
    return props.ends.map((end) => {
        if (end.scoring_team !== props.teamId) return {score: 0};
        return {score: end.points_scored, steal: end.hammer_team !== props.teamId};
    });
});
const total = computed(() => {
    return scoreResults.value.reduce((all, current) => all + current?.score || 0, 0);
});
</script>

<template>
    <div class="scoreboard__row linescore yellow">
        <div class="column justify-center items-center team__label">
            <RockIcon
                :color="color"
                style="height: 3em; width: 3em"
                :draggable="false"
            />
            <div class="truncate-text text-center full-width q-mt-xs">
                Team Campbell
            </div>
        </div>
        <div v-for="(end, index) in new Array(11)" :key="index" :class="{'text-white': scoreResults[index]?.score}" :style="{backgroundColor: scoreResults[index]?.score ?'#00cd93' : 'white'}">
            {{ scoreResults[index]?.score }}
        </div>
        <div class="score__column">{{ total }}</div>
    </div>
</template>

<style lang="scss" scoped>
$column-width: 60px;
$team-column-width: 80px;
$team-column-max-width: 120px;
$column-height: 4em;
$bg-opacity: 0.3;
.scoreboard__row {
    position: relative;
    display: inline-grid;
    grid-template-rows: $column-height;
    grid-template-columns: minmax($team-column-width, $team-column-max-width) repeat(
            12,
            $column-width
        );
    column-gap: 1px;
    &.header {
        > div {
            background-color: $deep-purple;
            color: white;
        }
    }
    &.linescore {
        grid-template-rows: calc($column-height * 2);
    }
    > div {
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 0 1px #dddddd;
        background-color: white;
        overflow: hidden;
        &:first-child {
            position: sticky;
            left: 0;
            width: 100%;
        }
    }
    .team__label {
        padding: var(--space-xs);
    }
    .score__column {
        position: sticky;
        right: 0;
        background-color: white;
    }
}
</style>
