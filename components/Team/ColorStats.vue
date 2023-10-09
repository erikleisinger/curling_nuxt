<template>
    <div
        class="color-stats__container row"
        v-for="color in ['red', 'blue', 'yellow']"
        :key="color"
    >
        <div class="color-stat__container column col-6">
            <div class="row">
                <div>
                    <RockDraggable
                        :draggable="false"
                        :color="color"
                        width="1em"
                    />
                </div>

                <div class="column q-ml-sm" >
                    <h3 class="text-sm" style="text-transform: capitalize">
                        {{ color }}
                    </h3>
                    <h3 class="text-md q-mt-sm text-bold winrate" v-if="!loading">
                       {{ isNaN(colorPreferences[color]) ? '0' : colorPreferences[color] }}%
                    </h3>
                    <div class="text-xs" v-if="!loading">
                        {{ statsSorted[color].length }} /
                        {{ stats.length }} games
                    </div>
                    <q-circular-progress indeterminate v-else/>
                </div>
            </div>
        </div>
        <div class="color-stat__container column col-6">
            <div class="row">
                <div>
                    <q-icon
                  
                        size="1.5em"
                        :name="
                            colorWinRate[color] > 50
                                ? 'arrow_drop_up'
                                : colorWinRate[color] < 50
                                ? 'arrow_drop_down'
                                : 'remove'
                        "
                        :color="
                            colorWinRate[color] < 50
                                ? 'negative'
                                : colorWinRate[color] > 50
                                ? 'positive'
                                : ''
                        "
                    />
                </div>

                <div class="column q-ml-sm">
                    <h3 class="text-sm">Win rate</h3>
                    <h3 class="text-md q-mt-sm text-bold winrate" v-if="!loading">
                        {{ isNaN(colorWinRate[color]) ? '0' : colorWinRate[color] }}%
                    </h3>
                    <q-circular-progress indeterminate v-else/>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.color-stats__container {
    margin-top: var(--space-md);
    .winrate {
        margin-top: -0.1em;
    }
    .percent-container {
        margin-left: 1em;
        margin-top: -0.1em;
    }
}
</style>
<script setup>
import TeamStats from "@/store/models/team-stats";
import Game from '@/store/models/game'
const props = defineProps({
    loading: Boolean,
    opponentId: Number,
    teamId: Number,
});

const stats = computed(() => {
     if (!props.opponentId)
        return useRepo(TeamStats)
            .where("team_id", props.teamId)
            .where("game_id", (val) => val !== 0)
            .get()
            

    const allStats = useRepo(TeamStats)
        .where("team_id", props.teamId)
        .where("game_id", (val) => val !== 0)
        .get();

    const games = useRepo(Game)
        .with("teams")
        .whereIn(
            "id",
            allStats.map(({ game_id }) => game_id)
        )
        .whereHas("teams", (query) => {
            query.whereIn("team_id", props.opponentId);
        })
        .get()
        .map(({ id }) => id);

    return useRepo(TeamStats)
        .where("team_id", props.teamId)
        .whereIn("game_id", games)
        .get();

    
}
    
);

const statsSorted = computed(() => {
    return stats.value.reduce(
        (all, current) => {
            if (current.color === "yellow")
                return { ...all, yellow: [...all.yellow, current] };
            if (current.color === "blue")
                return { ...all, blue: [...all.blue, current] };
            if (current.color === "red")
                return { ...all, red: [...all.red, current] };
            return all;
        },
        {
            yellow: [],
            red: [],
            blue: [],
        }
    );
});

const colorPreferences = computed(() => ({
    blue: ((statsSorted.value.blue?.length / stats.value.length) * 100).toFixed(
        0
    ),
    red: ((statsSorted.value.red?.length / stats.value.length) * 100).toFixed(
        0
    ),
    yellow: (
        (statsSorted.value.yellow?.length / stats.value.length) *
        100
    ).toFixed(0),
}));

const colorWinRate = computed(() => {
    return {
        blue: Number.parseFloat(
            (
                (statsSorted.value.blue.filter(({ win }) => !!win)?.length /
                    statsSorted.value.blue?.length) *
                100
            ).toFixed(0) ?? null
        ),
        yellow: Number.parseFloat(
            (
                (statsSorted.value.yellow.filter(({ win }) => !!win)?.length /
                    statsSorted.value.yellow?.length) *
                100
            ).toFixed(0) ?? null
        ),
        red: Number.parseFloat(
            (
                (statsSorted.value.red.filter(({ win }) => !!win)?.length /
                    statsSorted.value.red?.length) *
                100
            ).toFixed(0) ?? null
        ),
    };
});

const colorTieRate = computed(() => {
    return {
        blue:
            (
                (statsSorted.value.blue.filter(({ tie }) => !!tie)?.length /
                    statsSorted.value.blue?.length) *
                100
            ).toFixed(0) ?? null,
        yellow:
            (
                (statsSorted.value.yellow.filter(({ tie }) => !!tie)?.length /
                    statsSorted.value.yellow?.length) *
                100
            ).toFixed(0) ?? null,
        red:
            (
                (statsSorted.value.red.filter(({ tie }) => !!tie)?.length /
                    statsSorted.value.red?.length) *
                100
            ).toFixed(0) ?? null,
    };
});
</script>
