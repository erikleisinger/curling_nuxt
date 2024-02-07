<template>
    <LinescoreGrid
            :score="score"

            class="q-mb-lg"
            v-if="!loading"
        >
         <template v-slot:avatarHome>
            
                   <TeamAvatar
                :teamId="home?.team_id"
                :color="home?.color"
                class="avatar"
                :hammer="hammerFirstEnd === home?.team_id"
            />
         </template>
           <template v-slot:avatarAway>
            
                   <TeamAvatar
                :teamId="away?.team_id"
                :color="away?.color"
                  class="avatar"
                  :hammer="!hammerFirstEnd || hammerFirstEnd === away?.team_id"
            />
         </template>
                
      </LinescoreGrid>
</template>
<style lang="scss" scoped>
    .avatar {
        height: unset;
        width: 100%;
        padding: var(--space-xxxs);
        margin-top: unset;
    
    }
</style>
<script setup>
    import GameTeam from '@/store/models/game-team';
    import Game from '@/store/models/game'

    const props = defineProps({
        gameId: Number,
    })

    const home = computed(() => useRepo(GameTeam).where('game_id', props.gameId).offset(0).first())
    const away = computed(() => useRepo(GameTeam).where('game_id', props.gameId).offset(1).first())

    const hammerFirstEnd = computed(() => useRepo(Game).where('id', props.gameId).first()?.hammer_first_end)

    const score = ref({})

    const loading = ref(false)

    const {generateScore} = useGame();

    const init = async () => {
        loading.value = true;
        score.value = await generateScore(props.gameId);
        loading.value  = false;
    }


 onMounted(() => {
        init()
    })
</script>