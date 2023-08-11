<template>
    <DialogFloating @close="toggleLineScore({ open: false })">
        <!-- <Scoreboard/> -->
        <div
            class="full-height scoreboard__container row justify-center items-center" 
        >
        <div class="nav__container">
             <div
                    v-for="end in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    :key="`${end}-label`"
              
                   class="row justify-center items-center text-xl nav__container--item"
                   :class="{selected: visible === end}"
                   @click="scrollTo(end)"
                >
            <div class="nav-container--item__column">
                <div>{{end}}</div>
                <div>{{score[end].home}}</div>
                 <div>{{score[end].away}}</div>
            </div>
             </div>
        </div>
            <div class="scoreboard__score-container row no-wrap hide-scroll" id="scoreboard-linescore" ref="scroller">
                <div class="start__padding col-grow" />
                <div
                    v-for="end in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    :key="end"
                          :id="`scoreboard-end-${end}`"
                    class="scoreboard__end-container "
                   
                >
                    <LinescoreColumn @visible="setVisible(end)"  v-model="score[end]" />
                </div>
            </div>
        </div>
    </DialogFloating>
</template>
<style lang="scss">
$column-width: 30vh;
$gutter-width: 20vw;
.nav__container {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    column-gap: 1px;
    background-color: $grey-4;
    // background-color: rgba(0,0,0)
    .nav__container--item {
      border-bottom: 1px solid $grey-4;
      background-color: white;
      &.selected {
        background-color: #00cd93;
        color: white;
        font-weight: bold;
      }
    }

}
.scoreboard__end-row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: v-bind(opacity);
}
.scoreboard__container {
    display: grid;
    grid-template-rows: 15vh auto;
    grid-template-columns: 100%;
    width: 100%;
    .scoreboard__score-container {
        height: calc(70 * var(--vh, 1vh));

        width: 100%;
        border-radius: 8px;
        overflow-y: hidden;
        overflow-x: scroll;
        position: relative;
        .start__padding {
            width: calc((100% - $column-width) / 2);
            height: 100%;
        }
        .scoreboard__end-container {
            display: grid;
            min-width: $column-width;
            max-width: $column-width;
            grid-template-columns: 100%;
            grid-template-rows: repeat(2, 50%);
            row-gap: 1px;
            height: 100%;
            width: 100%;
        }
    }
}
</style>
<script setup lang="ts">
import { useEditorStore } from "@/store/editor";
import { usePlayerStore } from "@/store/players";
import {useScroll} from '@vueuse/core'

const root = ref(null);

const editorStore = useEditorStore();
const { toggleLineScore } = editorStore;

const visible = ref(1);

const setVisible = (index) => {
    console.log('visible: ', index)

    visible.value = index
}

const emit = defineEmits(["close"]);

const scroller = ref(null)
const {x} = useScroll(scroller, {behavior: 'smooth'})

const scrollTo = (end) => {
    const ele = document.getElementById(`scoreboard-end-${end}`)
    console.dir(ele?.offsetLeft)
    x.value = ele?.offsetLeft - window.innerWidth / 4 + 16
}

const score = ref({
    1: {
        home: 0,
        away: 0,
    },
     2: {
        home: 0,
        away: 0,
    },
     3: {
        home: 0,
        away: 0,
    },
     4: {
        home: 0,
        away: 0,
    },
     5: {
        home: 0,
        away: 0,
    },
     6: {
        home: 0,
        away: 0,
    },
     7: {
        home: 0,
        away: 0,
    },
     8: {
        home: 0,
        away: 0,
    },
     9: {
        home: 0,
        away: 0,
    },
     10: {
        home: 0,
        away: 0,
    },

})


</script>
