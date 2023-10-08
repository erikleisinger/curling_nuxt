<template>
<!-- FIRST END -->
    <div class="row">
        <div class="hammer-stats__container column justify-around col-6">
             <div class="row">
                 <div class="hammer_container">
                    <IconHammer color="#36454F" />
                </div>

                <div class="column q-ml-sm">
                    <h3 class="text-sm">Hammer first end</h3>
                    <h3 class="text-md q-mt-sm text-bold firstEndWinRate">
                       {{ isNaN(hammerFirstEndPercent) ? '0' : hammerFirstEndPercent }}%
                    </h3>
                </div>
            </div>
           
        </div>
        <div class="hammer-stats__container column justify-around col-6">
            <div class="row">
                <div>
                    <q-icon
                        :name="
                            firstEndWinRate > 50
                                ? 'arrow_drop_up'
                                : firstEndWinRate < 50
                                ? 'arrow_drop_down'
                                : 'horizontal-rule'
                        "
                        size="1.5em"
                        :color="
                            firstEndWinRate < 50
                                ? 'negative'
                                : firstEndWinRate > 50
                                ? 'positive'
                                : ''
                        "
                    />
                </div>

                <div class="column q-ml-sm">
                    <h3 class="text-sm">Win rate</h3>
                    <h3 class="text-md q-mt-sm text-bold firstEndWinRate">
                      {{ isNaN(firstEndWinRate) ? '0' : firstEndWinRate }}%
                    </h3>
                </div>
            </div>
        </div>
    </div>
      <!-- LAST END -->
     <div class="row">
        <div class="hammer-stats__container column justify-around col-6">
             <div class="row">
                 <div class="hammer_container">
                    <IconHammer color="#36454F" />
                </div>

                <div class="column q-ml-sm">
                    <h3 class="text-sm">Hammer last end</h3>
                    <h3 class="text-md  text-bold ">
                        {{ isNaN(hammerLastEndPercent) ? '0' : hammerLastEndPercent }}%
                    </h3>
                </div>
            </div>
           
        </div>
      
        <div class="hammer-stats__container column justify-around col-6">
            <div class="row">
                <div>
                    <q-icon
                        :name="
                            lastEndWinRate > 50
                                ? 'arrow_drop_up'
                                : lastEndWinRate < 50
                                ? 'arrow_drop_down'
                                : 'remove'
                        "
                        size="1.5em"
                        :color="
                            lastEndWinRate < 50
                                ? 'negative'
                                : lastEndWinRate > 50
                                ? 'positive'
                                : ''
                        "
                    />
                </div>

                <div class="column q-ml-sm">
                    <h3 class="text-sm">Win rate</h3>
                    <h3 class="text-md text-bold ">
                         {{ isNaN(lastEndWinRate) ? '0' : lastEndWinRate }}%
                    </h3>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.hammer-stats__container {
    margin-top: var(--space-md);
    .hammer_container {
        width: 1em;
    }
    .percent-container {
        margin-left: 1em;
        margin-top: -0.3em;
    }
    .firstEndWinRate {
        margin-top: -0.1em;
    }
}
</style>
<script setup>
import TeamStats from "@/store/models/team-stats";
import Game from '@/store/models/game'
const props = defineProps({
    opponentId: Number,
    teamId: Number,
});

const { getColor } = useColor();

const stats = computed(() => {
     if (!props.opponentId)
        return useRepo(TeamStats)
            .where("team_id", props.teamId)
            .whereIn("game_id", (val) => val !== 0)
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

const hammerFirstEndPercent = computed(() =>
    (
        (stats.value.filter(
            ({ hammer_first_end_count }) => !!hammer_first_end_count
        ).length /
            stats.value.length) *
        100
    ).toFixed(0)
);

const hammerLastEndPercent = computed(() =>
    (
        (stats.value.filter(
            ({ hammer_last_end_count }) => !!hammer_last_end_count
        ).length /
            stats.value.length) *
        100
    ).toFixed(0)
);

const firstEndWinRate = computed(() =>
    Number.parseFloat(
        (
            (stats.value.filter( 
                ({ hammer_first_end_count, win }) => !!hammer_first_end_count && !!win
            ).length /
                stats.value.filter(
                ({ hammer_first_end_count }) => !!hammer_first_end_count
            ).length) *
            100
        ).toFixed(0)
    )
);

const lastEndWinRate = computed(() =>
    Number.parseFloat(
        (
            (stats.value.filter( 
                ({ hammer_last_end_count, win }) => !!hammer_last_end_count && !!win
            ).length /
                stats.value.filter(
                ({ hammer_last_end_count }) => !!hammer_last_end_count
            ).length) *
            100
        ).toFixed(0)
    )
);
</script>
