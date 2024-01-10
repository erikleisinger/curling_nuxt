<template>
    
    <LayoutCircleTitle title="game Summary" minHeight="225px">
        <template v-slot:underlay>
            <Rings size="100%" />
        </template>
        <template v-slot:append>
            <div class="full-width text-center text-white">
                {{ toTimezone(game?.start_time, "MMM D, YYYY") }}
            </div>
            <div
                class="full-width text-center text-white"
                v-if="game?.rink"
            >
                {{ game.rink?.name }}
            </div>
            <div
                class="full-width text-center text-white"
                v-if="game?.sheet"
            >
                Sheet {{ game.sheet?.number }}
            </div>
            <div
                style="width: fit-content"
                class="full-width row justify-center"
            >
                <TeamGameResultVerification :gameId="Number(gameId)" />
            </div>
        </template>
    </LayoutCircleTitle>
</template>
<style lang="scss" scoped>

</style>
<script setup>
import Game from '@/store/models/game'
    const props = defineProps({
        gameId: Number
    })

    const game = computed(() => useRepo(Game).withAll().where('id', props.gameId).first())

    const {toTimezone} = useTime();
</script>

