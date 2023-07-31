<template>
    <div class="full-height bg-white yellow--background">
        <div class="scoreboard__container--wrap">
            <div class="scoreboard__container hide-scroll">
                <!-- Begin total score -->

                <div class="scoreboard__row header">
                    <div>End</div>
                    <div v-for="(end, index) in new Array(11)" :key="index">
                        {{ index + 1 }}
                    </div>
                    <div class="score__column">Total</div>
                </div>

                <!-- End total score -->

                <!-- Begin home score -->
                <ScoreboardRow color="blue" :teamId="1" />
                <!-- <div class="scoreboard__row linescore yellow">
                    <div class="column justify-center items-center team__label">
                        <RockIcon color="red" style="height: 3em; width: 3em" :draggable="false"/>
                        <div class="truncate-text  text-center full-width q-mt-xs">Team Campbell</div>
                    </div>
                    <div
                        v-for="(end, index) in new Array(11)"
                        :key="index"
                    >{{index}}</div>
                     <div class="score__column">1</div>
                </div> -->
                <!-- End home score -->

                <!-- Begin home stats -->
                <!-- <div class="scoreboard__row">
                    <div></div>
                    <div
                        v-for="(end, index) in new Array(11)"
                        :key="index"
                    >{{index}}</div>
                    <div class="score__column"></div>
                </div> -->
                <!-- End home stats -->

                <!-- Begin away score -->
                <ScoreboardRow color="yellow" :teamId="2" />
                <!-- <div class="scoreboard__row linescore red">
                     <div class="column justify-center items-center team__label">
                        <RockIcon color="yellow" style="height: 3em; width: 3em" :draggable="false"/>
                          <div class="truncate-text text-center full-width q-mt-xs">Team Einarson</div>
                    </div>
                    <div
                        v-for="(end, index) in new Array(11)"
                        :key="index"
                    >{{index}}</div>
                    <div class="score__column">0</div>
                </div> -->
                <!-- End away score -->
            </div>
            <!-- <div class="score__column">
                <div>Score</div>
                <div class="yellow">1</div>
                <div />
                <div class="red">0</div>
            </div> -->
        </div>
    </div>
</template>
<style lang="scss" scoped>
$column-width: 60px;
$team-column-width: 80px;
$team-column-max-width: 120px;
$column-height: 4em;
$bg-opacity: 0.3;
.scoreboard__container--wrap {
    position: relative;
    font-size: var(--text-sm);
    .scoreboard__container {
        overflow: auto;
        max-width: 100vw;
        border-collapse: collapse;
        position: relative;

        .scoreboard__row {
            position: relative;
            display: inline-grid;
            grid-template-rows: $column-height;
            grid-template-columns: minmax(
                    $team-column-width,
                    $team-column-max-width
                ) repeat(12, $column-width);
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
        }
    }
    .score__column {
        position: sticky;
        right: 0;
        background-color: white;
    }
}
</style>
<script setup></script>
