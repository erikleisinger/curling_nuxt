<template>
    <Button color="mint" v-if="canEdit" @click="navigateTo(`/games/create?gameId=${gameId}`)" :disable="isVerified">Edit game</Button>
</template>
<script setup>
    import Game from '@/store/models/game'

    const props = defineProps({
        gameId: Number,
    })

    const game = computed(() => useRepo(Game).with('teams').where('id', props.gameId).first())
    
    const isVerified = computed(() => game.value.isVerified)

    const teams = computed(() => game.value?.teams.map(({team_id}) => team_id))

     const {isOnTeam} = useTeam()

    const canEdit = computed(() => {
        let isAuthorized;
        if (!teams.value) return false;

        teams.value.forEach((id) => {
            if (isOnTeam(id)) isAuthorized = true
        })

        return isAuthorized
    })
</script>