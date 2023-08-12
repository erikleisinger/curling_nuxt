<template>
<div class="linescore-confirmation__wrap">
    <div class="linescore-confirmation__container">
        <div class="team-result__container">
            <div class="score__container">{{ score.home }}</div>
            <div class="team__container">
                <div style="width: 5em">
                    <Avataaar
                        v-bind="parseAvatar(teamSelection?.home?.team_avatar)"
                    />
                </div>
                  <div class="text-center text-bold text-md">{{teamSelection.home?.name || 'Unnamed team'}}</div>
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
                        <Avataaar
                            v-bind="parseAvatar(teamSelection?.away?.team_avatar)"
                        />
                    </div>
                    <div class="text-bold text-md text-center">{{teamSelection.away?.name || 'Unnamed team'}}</div>
                
            </div>
        </div>
    </div>
    <div class="confirm-button__container">
        <q-btn rounded size="xl" color="deep-purple" @click="emit('save')">Confirm & Save</q-btn>
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
    teamSelection: Object,
});

const emit = defineEmits(['save'])
</script>
