<template>
<div style="background-color:white">
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
<td><div class="row no-wrap items-center"><RockIcon :color="game.home_color" style="height:1em; width:1em" :draggable="false"/><div class="team-name q-pl-xs">{{game.home.name}}</div><q-icon name="hardware" class="hammer-icon" v-if="hammerFirstEnd === 'home'"/></div></td>
 <td v-for="index in 11" :key="`td-home-${index}`" >
                    <GameScoreboardColumn :score="ends[index] && ends[index].scoring_team_id === game.home.id ? ends[index].points_scored : 0" @update-score="updateScore($event, index, game.home.id, game.id)"/>
                </td>
                  <td>{{score.home}}</td>
            </tr>

            <tr id="away">
                <td><div class="row no-wrap items-center"><RockIcon :color="game.away_color" style="height:1em; width:1em" :draggable="false"/><div class="team-name q-pl-xs">{{game.away.name}}</div><q-icon v-if="hammerFirstEnd === 'away'" name="hardware" class="hammer-icon"/></div></td>
                <td v-for="index in 11" :key="`td-away-${index}`">
                    <GameScoreboardColumn :score="ends[index] && ends[index].scoring_team_id === game.away.id ? ends[index].points_scored : 0" @update-score="updateScore($event, index, game.away.id, game.id)"/>
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
                text-align:left;
                
                .team-name {
                      @extend .truncate-text;
width: calc(100% - 1em);
                }
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
        .hammer-icon {
            transform: rotateZ(45deg)
        }
    }
</style>
<script setup lang="ts">
    import {useSessionStore} from '@/store/session';
    import type Game from '@/types/game'
    import type End from '@/types/end'
    const store = useSessionStore();
      const game = computed(() => store.game) as unknown as Ref<Game>;

      const hammerFirstEnd = computed(() => {
        const {hammer_first_end} = game.value || {};
        if (!hammer_first_end?.id) return null;
        if (hammer_first_end.id === game.value?.home?.id ) return 'home';
        if (hammer_first_end.id === game.value?.away?.id) return 'away'
        return null;

      })
    const ends = computed(() => {
        return store.ends.reduce((all, current: End) => {
            return {...all,
            [current.end_number]: {
                scoring_team_id: current.scoring_team_id,
                points_scored: current.points_scored
            }
            }
        }, {})
    })
    const score = computed(() => {
        return store.ends.reduce((all, current:End) => {
            if (current.scoring_team_id === game.value.home.id) {
                return {
                    ...all,
                    home: all.home + (current.points_scored ?? 0)
                }
            } else {
                return {
                    ...all,
                    away: all.away + (current.points_scored ?? 0)
                }
            }
        }, {home: 0, away: 0})
    })
     const {updateScore} = store

</script>

