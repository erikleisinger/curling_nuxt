<template>
    <label>Game control</label>
    <div class="subtitle">% hammer possession of all ends played</div>
    <div class="percent">{{controlOfGame}}</div>
    <label>Steal efficiency</label>
    <div class="subtitle">without hammer, % ends scored</div>
    <div class="percent">{{stolenEnds}}</div>
     <label>Hammer efficiency</label>
    <div class="subtitle">with hammer, % time scored 2+ points</div>
    <div class="percent">{{hammerEfficiency}}</div>
      <label>Blank ends</label>
    <div class="subtitle">with hammer, % of ends blanked</div>
    <div class="percent">{{blankEnds}}</div>
        <label>Forced with hammer</label>
    <div class="subtitle">with hammer, % of ends forced</div>
    <div class="percent">{{forcedWith}}</div>
</template>
<style lang="scss" scoped>
label {
    font-weight: bolder;
}
.subtitle {
    font-size: 0.9em;
    font-style: italic;
}
    .percent {
        margin-bottom: 8px;
        &:after {
            content: '%'
        }
    }
</style>
<script setup>
    const route = useRoute();
    const stats = ref(null)
    const controlOfGame = ref(null)
    const stolenEnds = ref(null)
    const hammerEfficiency = ref(null)
    const blankEnds = ref(null)
    const forcedWith = ref(null)
    onMounted(async() => {
        const client = useSupabaseClient();
        const {data} = await client.rpc('get_team_stats', {
            team_id_param: route.params.id
        })
        const [s] =data;
        stats.value = s
        const {
            hammer_1_point_count,
            total_ends_played,
            hammer_blank_count,
            hammer_ends_count,
            stolen_end_count
        } = stats.value;
        
        // Of all ends played, what % of the time did the team have the hammer?
        controlOfGame.value = toPercent(hammer_ends_count / total_ends_played)

        // How many ends did they steal? 
        stolenEnds.value = toPercent(stolen_end_count / (total_ends_played - hammer_ends_count))

        // Hammer efficiency -- scored 2+ points with hammer. NOT INCLUDING blanks
        hammerEfficiency.value = toPercent(addPointCounts(2, 8) / (hammer_ends_count - hammer_blank_count))

        // Blank ends: % of ends with hammer when score was 0
        blankEnds.value = toPercent(hammer_blank_count / hammer_ends_count)

        // forced with hammer: % of ends with hammer when team only scored 1
        forcedWith.value = toPercent(hammer_1_point_count / (hammer_ends_count - hammer_blank_count))

    })


// Utils 

const addPointCounts = (start, end) => {
    if (start < 1 || end > 8) return;
    let sum = 0;
    for (let x = start; x < end; x++) {
        sum += stats.value[`hammer_${x}_point_count`]
    }
    return sum;
}

const toPercent = (num) => {
    return (num * 100).toFixed()
}
</script>