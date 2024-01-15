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

    const home = computed(() => useRepo(GameTeam).where('game_id', props.gameId).where('home_team', true).first())
    const away = computed(() => useRepo(GameTeam).where('game_id', props.gameId).where('home_team', false).first())

    const endCount = computed(() => useRepo(Game).where('id', props.gameId).first()?.end_count)
    const hammerFirstEnd = computed(() => useRepo(Game).where('id', props.gameId).first()?.hammer_first_end)

    const score = ref({})

    const loading = ref(false)

    const init = async () => {
        loading.value = true;
        score.value = await generateScore()
        loading.value  = false;
    }

    const getScoreDetails = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("ends")
        .select(
            `
        id,
        end_number,
        scoring_team_id,
        hammer_team_id,
        points_scored
    `
        )
        .eq("game_id", props.gameId);
    return data;
};

const generateScore = async () => {
    const details = await getScoreDetails();
    const s = Array.from(
        {
            length: Math.max(endCount.value, details?.length),
        },
        (_, i) => i + 1
    ).reduce((all, current, index) => {
        if (!details[index]) {
            return {
                ...all,
                [index + 1]: {
                    home: "X",
                    away: "X",
                },
            };
        } else {
            return {
                ...all,
                [index + 1]: {
                    home:
                        details[index]?.points_scored === null
                            ? "X"
                            : details[index]?.scoring_team_id ===
                                  home.value?.team_id ||
                              (home.value?.pending &&
                                  !details[index]?.scoring_team_id)
                            ? details[index]?.points_scored
                            : 0,
                    away:
                        details[index]?.points_scored === null
                            ? "X"
                            : details[index]?.scoring_team_id ===
                                  away.value?.team_id ||
                              (away.value?.pending &&
                                  !details[index]?.scoring_team_id)
                            ? details[index]?.points_scored
                            : 0,
                    ...details[index],
                },
            };
        }
    }, {});
    return s;
};

 onMounted(() => {
        init()
    })
</script>