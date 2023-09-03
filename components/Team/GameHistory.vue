<template>
    <div class="full-height game-results__container" v-if="results?.length">
    <TeamGameResult   v-for="result in results"
            :key="result.id"
            :result="result"
            :expanded="expanded === result.id"
            @expand="expand(result.id)"
            @update="updateResult"
    
            
            />
    </div>
    <div
        class="full-height relative-position row justify-center items-center"
        v-else
    >
    
           <slot name="noData"/>
   
    </div>
</template>
<style lang="scss" scoped>
    .game-results__container {
        padding: var(--space-sm);
    }
</style>
<script setup>
import { watchDebounced } from "@vueuse/core";

const props = defineProps({
   results:Array,
   teamName: String,
});
const { format } = useTime();

const loading = ref(true);

// const getTeamRecord = async (team_id_param) => {
//     const {getTeamGames} = useGame();
//     const games = await getTeamGames([team_id_param])
//     results.value = games;
// };

const expanded = ref(null)
const expand = (id) => {
    if (expanded.value === id) {
        expanded.value = null;
    } else {
        expanded.value = id;
    }
}

const updateResult = (newResult) => {
    console.log('UPDATE: ', newResult)
    // const {id} = newResult;
    // const index = results.value.findIndex((res) => res.id === id)
    // if (index === -1) return;
    // results.value.splice(index, 1, newResult)
}


</script>
