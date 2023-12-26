<template>
    <div class="linescore-container" ref="container" >
        <div class="linescore-row" style="order: 0">
            <div>
                <slot name="headerPrepend" />
            </div>
            <div class="linescore-row--inner">
                <div
                    v-for="num in Array.from(
                        { length: endCount },
                        (_, i) => i + 1
                    )"
                    :key="`header-${num}`"
                    class="linescore-column--item"
                    :class="{ selected: selected === num }"
                >
                    <div
                        class="overlay--clickable"
                        @click="emit('select', num)"
                    />

                    {{ num }}
                </div>
                <!-- TOTAL header -->
                <div class="linescore-column--item">T</div>
            </div>
        </div>
        <div class="linescore-row" :style="{order: inverted ? '2' : '1'}">
            <div>
                <slot name="avatarHome" />
            </div>
            <div class="linescore-row--inner">
                <div
                    v-for="end in Object.keys(score)"
                    :key="`homescore-${end}`"
                    class="linescore-column--item"
                    :class="{ selected: selected === Number(end) }"
                     @click="emit('select', end)"
                >
                    {{ score[end]?.home }}
                </div>
                <!-- HOME total -->
                <div class="linescore-column--item text-bold">
                    <slot name="homeScore"/>
                      
                   
                </div>
            </div>
        </div>
        <div class="linescore-row" :style="{order: inverted ? '1' : '2'}">
            <div>
                <slot name="avatarAway" />
            </div>
            <div class="linescore-row--inner">
                <div
                    v-for="end in Object.keys(score)"
                    :key="`awayscore-${end}`"
                    class="linescore-column--item"
                    :class="{ selected: selected === Number(end) }"
                      @click="emit('select', end)"
                >
                    {{ score[end]?.away }}
                </div>
                <!-- AWAY total -->
                <div class="linescore-column--item text-bold">
                    <slot name="awayScore"/>
                        
               
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.avatars-unnested__container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 50%);
}
.linescore-container {
    width: 100%;
    box-sizing: border-box;
    padding: 0px var(--space-sm);
    border-bottom: 1px solid rgba(0,0,0,0.2);
     border-top: 1px solid rgba(0,0,0,0.2);
     display: flex;
     flex-direction: column;
    .linescore-row {
        display: grid;
        grid-template-columns: 10% 1fr;
   
        .linescore-row--inner {
            display: grid;
            grid-template-columns: v-bind(columns);
            text-align: center;
              
            .linescore-column--item {
                width: 100%;
                height: 100%;
                margin: auto;
                font-size: max(1.3em, 2vw);
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                   padding: 4%;
                &.selected {
                    background-color: #00cd93;
                    color: white;
                    font-weight: bold;
                }
                .overlay--clickable {
                    position: absolute;
                    width: 100%;
                    height: v-bind(overlayHeight);
                }
            }
        }

        &:nth-child(1) {
            .linescore-column--item {
                font-weight: bold;
                font-size: max(1.5em, 2vw);
            }
        }
    }
}
</style>

<script setup>
import { useElementBounding } from "@vueuse/core";
const props = defineProps({
    inverted: Boolean,
    score: Object,
    selected: Number,
});

const emit = defineEmits(["select"]);

const endCount = computed(() => Object.keys(props.score)?.length ?? 0);

const columns = computed(() => `repeat(${(endCount.value ?? 0) + 1}, 1fr)`);

const container = ref(null);
const { height: containerHeight } = useElementBounding(container);

const overlayHeight = computed(() => `${containerHeight.value}px`);

const totalScore = computed(() => {
    return Object.keys(props.score).reduce((all, current) => {
        const scoreObj = props.score[current];
        return {
            home: scoreObj.home === 'X' ? all.home : all.home + scoreObj.home,
            away: scoreObj.away === 'X' ? all.away : all.away + scoreObj.away,
        }
    }, {
        home: 0,
        away: 0,
    })
})


</script>
<script>
export default {
    name: "LinescoreGrid",
};
</script>
