<template>
       <div class="game-summary__container">
        <div class="avatar-container">
            <TeamAvatar
                :teamId="home?.team_id"
                :color="home?.color"
                style="height: unset"
            />
        </div>
        <div class="column justify-center items-center">
            <h2 class="score">
                {{ home?.points_scored ?? 0 }} : {{ away?.points_scored ?? 0 }}
            </h2>
           
        </div>
           <div class="avatar-container full-width">
            <TeamAvatar
                :teamId="away?.id"
                :color="away?.color"
                style="height: unset;"
            />
           
        </div>
          <h3 class="text-center md-text q-pt-md">{{home?.team?.name}}</h3>

          <div class="full-width text-center text-caption" style="margin-top: -1.5em">After 8</div>
           <h3 class="text-center md-text q-pt-md">{{ away?.team?.name }}</h3>
    </div>
</template>
<style lang="scss" scoped>
        .game-summary__container {
    display: grid;
    grid-template-columns: 30% 40% 30%;
    padding: 0px var(--space-md);
    margin: var(--space-lg) auto;
    max-width: 700px;

    .score {
        @include lg-text;
        @include sm {
            @include xl-text;
        }
    }
    .avatar-container {

        .avatar-outer__container {
max-width:175px;
margin-left: auto;
margin-right: auto;
        }
        
    }
}
</style>
<script setup>
   import GameTeam from '@/store/models/game-team';

    const props = defineProps({
        gameId: Number,
    })

    const home = computed(() => useRepo(GameTeam).with('team').where('game_id', props.gameId).where('home_team', true).first())
    const away = computed(() => useRepo(GameTeam).with('team').where('game_id', props.gameId).where('home_team', false).first())
</script>