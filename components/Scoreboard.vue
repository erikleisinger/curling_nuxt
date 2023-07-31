<template>
    <div class="full-height bg-white yellow--background">
        <div class="scoreboard__container--wrap">
            <div class="scoreboard__container hide-scroll">
                <!-- Begin total score -->

                <div class="scoreboard__row">
                    <div>End</div>
                    <div v-for="(end, index) in new Array(11)" :key="index">
                        {{ index + 1 }}
                    </div>
                    <div class="score__column">Score</div>
                </div>

                <!-- End total score -->

                <!-- Begin home score -->
                <div class="scoreboard__row linescore yellow">
                    <div>Home</div>
                    <div
                        v-for="(end, index) in new Array(11)"
                        :key="index"
                    ></div>
                     <div class="score__column">1</div>
                </div>
                <!-- End home score -->

                <!-- Begin home stats -->
                <div class="scoreboard__row">
                    <div></div>
                    <div
                        v-for="(end, index) in new Array(11)"
                        :key="index"
                    ></div>
                    <div class="score__column"></div>
                </div>
                <!-- End home stats -->

                <!-- Begin away score -->
                <div class="scoreboard__row linescore red">
                    <div>Away</div>
                    <div
                        v-for="(end, index) in new Array(11)"
                        :key="index"
                    ></div>
                    <div class="score__column">0</div>
                </div>
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
$column-height: 4em;
$bg-opacity: 0.3;
.scoreboard__container--wrap {
    position: relative;
    font-size: var(--text-xs);
    .scoreboard__container {
        // display: grid;
        // grid-template-columns: repeat(13, 60px);
        // grid-template-rows: 3em 4em 4em;
        overflow: auto;
        max-width: 100vw;

        border-collapse: collapse;
        position: relative;

        .scoreboard__row {
            position:relative;
            display: inline-grid;
            grid-template-rows: $column-height;
            grid-template-columns: repeat(13, $column-width);
            column-gap: 1px;
            row-gap: 1px;
            div {
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 0 1px 1px #dddddd;
                &:first-child {
                    position:sticky;
                    left: 0;
                    width: $column-width;
                    background-color: white;
                }
            }
            &.linescore {
                grid-template-rows: calc($column-height * 2);
                background-color: white;
                &.yellow {
                    div {
                        background-color:#fff8d3;
                    }
                }
                &.red {
                    div {
                        background-color: #fdd4d4;
                    }
                }
            }
        }
    }
    // .score__column {
    //     position: absolute;
    //     right: 0;
    //     top: 0;
    //     background-color: white;
    //     width: $column-width;
    //     height: 100%;
    //     text-align: center;
    //     display: grid;

    //     grid-template-rows: $column-height calc($column-height * 2) $column-height calc(
    //             $column-height * 2
    //         );
    //     column-gap: 1px;
    //     row-gap: 1px;
    //     div {
    //         display: flex;
    //         justify-content: center;
    //         align-items: center;
    //         box-shadow: 0 0 0 1px #dddddd;
    //         &.yellow {
    //             background-color: rgba(255, 231, 110, $bg-opacity);
    //         }
    //         &.red {
    //             background-color: rgba(249, 111, 111, $bg-opacity);
    //         }
    //     }
    // }
    .score__column {
        position: sticky;
        right: 0;
        background-color: white;
    }
}
</style>
<script setup></script>
