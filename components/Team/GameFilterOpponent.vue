<template>
       <q-select v-model="selection" :options="opponents" label="Opponent" behavior="menu" clearable></q-select>
</template>
<script setup>
import Game from '@/store/models/game'
import GameTeam from '@/store/models/game-team'
import Team from '@/store/models/team'
    const props = defineProps({
        modelValue: Object,
        teamId: Number
    })

    const emit = defineEmits(['update:modelValue'])

    const selection = computed({
        get() {
            return props.modelValue;
        },
        set(val) {
            emit('update:modelValue', val)
        }
    })

    const opponentIds = computed(() => [...new Set(useRepo(Game).with('teams').whereHas('teams', (query) => {
        query.whereIn('team_id', props.teamId)
    }).get().map(({teams}) => teams[0].team_id === props.teamId ? teams[1].team_id : teams[0].team_id))])

    const opponents = computed(() => useRepo(Team).query().where('id', (val) => val < 100000000).whereIn('id', opponentIds.value).get().map(({id, name}) => ({label:name, value:id})))

</script>