<template>
    <q-item >
            <q-item-section>
                <q-item-label
                    :style="{ color: league.color }"
                    class="text-bold"
                >
                    {{ league.name }}
                </q-item-label>
                <q-item-label caption> 
                    <span v-for="drawtime in league.drawtimes" :key="drawtime" class="drawtime">
                        {{toTimezone(drawtime.time, 'h:mm a', false, false)}}
                    </span>
                     </q-item-label>
            </q-item-section>
            <q-item-section avatar v-if="canEdit">
                <q-btn flat round icon="edit" dense size="sm" @click="toggleLeagueEditor({
                    open: true,
                    editedLeague: {...props.league}
                })"/>
            </q-item-section>
        </q-item>
</template>
<style lang="scss" scoped>
    .drawtime {
        &:not(:last-child) {
            &:after {
                content: ', '
            }
        }
    }
</style>
<script setup>
import {useDialogStore} from '@/store/dialog'
    const props = defineProps({
        league: Object,
    })

    const {toggleLeagueEditor} = useDialogStore();

    const {toTimezone} = useTime();

    const {user:userId} = useUser()

    const canEdit = computed(() => props.league.admins.some(({profile_id}) => profile_id === userId.value))
</script>
<script>
export default {
    name: 'LeagueListItem'
}
</script>