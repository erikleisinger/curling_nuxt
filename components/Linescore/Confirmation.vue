<template>
<div class="linescore-confirmation__wrap">
    <div class="linescore-confirmation__container">
        <div class="team-result__container">
            <div class="score__container">{{ score.home }}</div>
            <div class="team__container">
                <div style="width: 5em">
                    <TeamAvatar :team="gameParams.home?.id ? gameParams.home : {}"/>
                
                </div>
                  <div class="text-center text-bold text-md">{{gameParams.home?.name || 'Opposition team'}}</div>
            </div>
        </div>
        <div class="team-result__container">
            <div class="score__container" style="margin-top: -0.1em">
               :
            </div>
            <div/>
        </div>
        <div class="team-result__container">
            <div class="score__container">{{ score.away }}</div>
            <div class="team__container">
         
                    <div style="width: 5em">
                          <TeamAvatar :team="gameParams.away?.id ? gameParams.away : {}"/>
                    </div>
                    <div class="text-bold text-md text-center">{{gameParams.away?.name || 'Opposition team'}}</div>
                
            </div>
        </div>
    </div>
    </div>
</template>
<style lang="scss" scoped>
.linescore-confirmation__wrap {
       width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: min(300px, 50%) min(250px, 50%);
.linescore-confirmation__container {
 
    display: grid;
    grid-template-columns: 1fr 2em 1fr;
    .team-result__container {
        display: grid;
        grid-template-rows: auto 1fr;

        .score__container {
            font-size: 7em;
            display: flex;
            justify-content: center;
        }
        .team__container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
        }
    }
}
.confirm-button__container {
    // padding: var(--space-md);
    display: flex;
    justify-content: center;
    align-items: center;
    :deep(.q-btn) {
        width: 75%;
    }
}
}


</style>
<script setup>
import { parseAvatar } from "@/utils/avatar";
const props = defineProps({
    score: Object,
    gameParams: Object,
});

const emit = defineEmits(['save'])
</script>
