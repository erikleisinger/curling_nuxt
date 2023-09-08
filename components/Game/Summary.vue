<template>
    <header class="game__header">
        <nav class="row no-wrap justify-center full-width items-center">
            <div>
                <h2 class="text-sm text-center">Game</h2>
                <h1 class="text-md text-bold text-center">
                    {{ format(toTimezone(game.start_time), "MMMM DD, YYYY") }}
                </h1>
                <h2 class="text-sm text-center">
                    {{ format(toTimezone(game.start_time), "HH:mm a") }}
                </h2>
            </div>
        </nav>
        <div
            class="row no-wrap justify-between col-12"
            style="position: relative"
        >
            <div class="end-count__container">
                {{ `After ${game.end_count}` }}
            </div>
            <div class="column team__header items-center col-6">
                <div class="avatar__container q-mb-md">
                    <TeamAvatar
                        :teamId="game.home?.id"
                        :color="game.home.color"
                        :viewable="!!game.home.id && !static"
                    />
                     <div class="hammer-container bg-primary" v-if="game.hammer_first_end === game.home?.id">
                        <q-icon name="hardware" color="white"/>
                    </div>
                </div>

                <div class="column items-center full-width">
                    <div class="text-sm">Team</div>
                    <h2
                        class="text-sm text-bold text-center truncate-text full-width"
                    >
                        {{ game.home.name }}
                    </h2>
                </div>
                <div class="score__container">
                    {{ game.home.points_scored ?? 0 }}
                </div>
            </div>
            <div class="column team__header items-center col-6">
                <div class="avatar__container q-mb-md">
                    <TeamAvatar
                        :teamId="game.away?.id"
                        :color="game.away.color"
                        :viewable="!!game.away.id && !static"
                    />
                    <div class="hammer-container bg-primary" v-if="game.hammer_first_end === game.away?.id">
                        <q-icon name="hardware" color="white"/>
                    </div>
                </div>

                <div class="column items-center full-width">
                    <div class="text-sm">Team</div>
                    <div style="position: relative" class="full-width">
                        <div class="verified__container" v-if="game.verified">
                            <q-icon
                                name="verified"
                                :color="game.verified ? 'primary' : 'grey-5'"
                            />
                          
                        </div>
                        <h2
                            class="text-sm text-bold text-center truncate-text"
                            style="white-space: nowrap"
                        >
                            {{ game.away.name }}
                        </h2>
                    </div>
                </div>
                <div class="score__container">
                    {{ game.away.points_scored ?? 0 }}
                </div>
            </div>
        </div>
    </header>
</template>
<style lang="scss" scoped>
.game__header {
    padding: 0px var(--space-md);
    nav {
        padding: var(--space-sm) 0px;
        margin-bottom: var(--space-md);
    }
    h1 {
        text-align: center;
    }
     .team__header {
             .avatar__container {
            height: 7em;
            max-width: 100%;
            width: 7em;
            position: relative;
            .hammer-container {
                position: absolute;
                bottom: -1;
                right: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 6px;
                border-radius: 50%;
                font-size: 1.2em;
                border: 1px solid rgba(0,0,0,0.3);
                box-shadow: $pretty-shadow-2;
              
            }
        }
        .score__container {
            font-size: 4em;
            position: relative;
        }
    }
    .end-count__container {
        position: absolute;
        bottom: 1em;
        left: 0;
        right: 0;
        margin: auto;
        width: fit-content;
        color: $grey-8;
        font-size: 0.8em;
    }
}
</style>
<script setup>
const props = defineProps({
    game: Object,
    static: Boolean,
});
const $q = useQuasar();
const { format, toTimezone } = useTime();
</script>
