<template>

<div class="row justify-around">
    <StatsCard label="Wins" :value="wins" size="30%"/>
    <StatsCard label="Draws" :value="ties" size="30%"/>
    <StatsCard label="Losses" :value="losses" size="30%"/>
</div>
<div class="game-breakdown">
    <div>
        <h1>Offense</h1>
          <h2 >With hammer</h2>
   <label>Hammer possession</label>
    <div class="percent">{{controlOfGame}}</div> 

     <label>Hammer conversion</label>
    <div class="subtitle">2+ points scored</div>
    <div class="percent">{{hammerConversion}}</div>
      <label>Blank ends</label>
    <div class="percent">{{blankEnds}}</div>
        <label>Forced with hammer</label>
    <div class="percent">{{forcedWith}}</div>
    </div>
    <div class="text-right">
         <h1 >Defense</h1>
         <h2 >Without hammer</h2>
             <label>Steal efficiency</label>
    <div class="percent">{{stolenEnds}}</div>
          <label>Force efficiency</label>
    <div class="percent">{{forceWithout}}</div>
              <label>Average points conceded</label>
    <div>{{avgPointsConceded}}</div>
    </div>

    </div>
</template>
<style lang="scss" scoped>
.game-breakdown {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 8px;
    h2 {
        font-size: 1.2em;
        margin-top: -8px;
        font-style: italic;
        margin-bottom: 16px;
    }
}
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
    const wins = ref(0);
    const losses = ref(0);
    const ties = ref(0)
    const controlOfGame = ref(null)
    const stolenEnds = ref(null)
    const hammerConversion = ref(null)
    const blankEnds = ref(null)
    const forcedWith = ref(null)
    const forceWithout = ref(null)
    const avgPointsConceded = ref(null);
    const getGameStats = async () => {
         const client = useSupabaseClient();
        const {data} = await client.rpc('get_team_stats', {
            team_id_param: route.params.id
        })
        const [s] =data;
        stats.value = s
        const {
            avg_points_conceded,
            forced_end_count,
            hammer_1_point_count,
            hammer_blank_count,
            hammer_ends_count,
            stolen_end_count,
            total_ends_played
        } = stats.value;
        
        // Of all ends played, what % of the time did the team have the hammer?
        controlOfGame.value = toPercent(hammer_ends_count / total_ends_played)

        // How many ends did they steal? 
        stolenEnds.value = toPercent(stolen_end_count / (total_ends_played - hammer_ends_count))

        // Hammer efficiency -- scored 2+ points with hammer. NOT INCLUDING blanks
        hammerConversion.value = toPercent(addPointCounts(2, 8) / (hammer_ends_count - hammer_blank_count))

        // Blank ends: % of ends with hammer when score was 0
        blankEnds.value = toPercent(hammer_blank_count / hammer_ends_count)

        // forced with hammer: % of ends with hammer when team only scored 1
        forcedWith.value = toPercent(hammer_1_point_count / (hammer_ends_count - hammer_blank_count))

        // forced opposition to take one when they had hammer
        forceWithout.value = toPercent(forced_end_count / (total_ends_played - hammer_ends_count))

        // Average points conceded without hammer
        avgPointsConceded.value = avg_points_conceded.toFixed(2);
    }

    const getWinsLossess = async () => {
         const client = useSupabaseClient();
        const {data} = await client.rpc('get_team_wins', {
            team_id_param: route.params.id
        })
        wins.value = data.wins;
        losses.value = data.losses
        ties.value = data.ties;
    }
    onMounted(async() => {
    getGameStats();

    getWinsLossess();
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