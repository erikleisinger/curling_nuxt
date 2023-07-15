<template>
<div>
    <table class="score__table">
        <thead>
            <th>Team</th>
            <th v-for="index in 11" :key="`theader-${index}`">
                {{index}}
            </th>
            <th>Score</th>
        </thead>
        <tbody>
            <tr id="home">
<td>{{game.home.name}}</td>
 <td v-for="index in 11" :key="`td-home-${index}`" >
                    <ScoreBoardColumn :score="ends[index] && ends[index].scoring_team_id === game.home.id ? ends[index].points_scored : 0" @update-score="updateScore($event, index, game.home.id, game.id)"/>
                </td>
                  <td>{{score.home}}</td>
            </tr>

            <tr id="away">
                <td>{{game.away.name}}</td>
                <td v-for="index in 11" :key="`td-away-${index}`">
                    <ScoreBoardColumn :score="ends[index] && ends[index].scoring_team_id === game.away.id ? ends[index].points_scored : 0" @update-score="updateScore($event, index, game.away.id, game.id)"/>
                </td>
                <td>{{score.away}}</td>
            </tr>
        </tbody>
    </table>
</div>
</template>
<style lang="scss">
    .score__table {
        td, tr {
border: 1px solid #999;
        }
        td, th {
            &:nth-child(1) {
                max-width: 150px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow:hidden;
                text-align:left;
            } 
            &:not(:nth-child(1)) {
                width: 8%;
            }
        }
        td {
            text-align: center;

            &:nth-child(13) {
                width: 10%;
            }
        }
        th:nth-child(1) {
            text-align: left;
        }
    }
</style>
<script setup>
    import {useGameStore} from '@/store/game';
    const store = useGameStore();
      const game = computed(() => store.game)
    const ends = computed(() => {
        return store.ends.reduce((all, current) => {
            return {...all,
            [current.end_number]: {
                scoring_team_id: current.scoring_team_id?.id,
                points_scored: current.points_scored
            }
            }
        }, {})
    })
    const score = computed(() => {
        return store.ends.reduce((all, current) => {
            if (current.scoring_team_id?.id === game.value.home.id) {
                return {
                    ...all,
                    home: all.home + current.points_scored
                }
            } else {
                return {
                    ...all,
                    away: all.away + current.points_scored
                }
            }
        }, {home: 0, away: 0})
    })
     const {updateScore} = store

</script>

