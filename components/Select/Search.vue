<template>
    <q-input v-model="search">
        <template v-slot:append>
               <div style="position: absolute; left:0; top:100%; width:100%; background-color:white; z-index:3; max-height: 200px;overflow:scroll" v-if="results.length">
                <div v-for="result in results" :key="result.value" class="result">
                    {{result.label}}
                </div>
               </div>
        </template>
    </q-input>
 
</template>
<style scoped lang="scss">
    .result {
        &:hover {
            background-color: seashell;
        }
    }
</style>

<script setup>
import {usePlayerStore} from '@/store/players'
        const playerStore = usePlayerStore();
const playerOptions = computed(() => {
  return playerStore.players.map((t) => {
    return {
      label: t.name || "Unnamed player",
      value: t.id,
    };
  });
});
const search = ref(null);
const regex = /[\s-]([A-Z][a-z]*)/
const results = computed(() => {
    if (!search.value) return [];
    return playerOptions.value.filter((p) => {
        return p.label.match(regex)
    })
})
watch(results, (v) => {
    console.log('results: ', v)
}, {deep: true})

</script>