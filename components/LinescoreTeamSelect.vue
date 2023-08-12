<template>
     <TeamList v-if="teams?.length && step === steps.SELECT_HOME" :teams="teams"  @select="onSelectHome" >
            HEADER HERE "Who's playing"
        </TeamList>
           <TeamList v-if="teams?.length && step === steps.SELECT_AWAY" :teams="teams"  @select="onSelectAway">
            HEADER HERE "Who else is playing"
        </TeamList>
</template>

<script setup>
import {useTeamStore} from '@/store/teams'  
    onMounted(() => {
  const teamStore = useTeamStore();
     teams.value = [...teamStore.teams]
    })

    const homeTeam = ref(null);
    const awayteam = ref(null);

const teams = ref([]);

const onSelectHome = (_, teamId) => {
    homeTeam.value = teamId
    step.value = steps.SELECT_AWAY

}
const onSelectAway = (_, teamId) => {
    homeTeam.value = teamId
    // Can add confirmation before this
    emit('complete')
}

const steps = {
    SELECT_HOME: 0,
    SELECT_AWAY: 1,
}

const step = ref(steps.SELECT_HOME)

const emit = defineEmits(['complete'])



</script>