<template>
     <q-chip dense class="text-sm q-mx-none text-bold" style="width: min-content"   clickable  @click.stop="onClick">
        <q-icon flat round dense name="location_on" color="red" style="padding-bottom: 1px"/>
        <!-- :outline="!!rink" -->
        <!-- :color="!!rink ? 'blue' : ''" :text-color="!!rink ? 'white' : 'black'" -->
        <span v-if="!!rink">{{rink?.name}}</span>
        <span v-else-if="!canEdit">{{noRinkText}}</span>
        <span v-else>{{noRinkEditText}}</span>
      </q-chip>
</template>
<script setup>
    import Rink from '@/store/models/rink';
    import {useDialogStore} from '@/store/dialog'

    const props = defineProps({
        canEdit: Boolean,
        noRinkText: {
            type: String,
            default: 'No rink'
        },
        noRinkEditText: {
            type: String,
            default: 'Click to select rink'
        },
        rinkId: Number
    })

    const rink = computed(() => useRepo(Rink).where('id', props.rinkId).first())

    const {toggleGlobalSearch} = useDialogStore();

    const emit = defineEmits(['update'])

    const onClick = () => {
        console.log('on click')
        if (props.canEdit) {
            searchRink();
        } else {
            console.log('navigate')
            navigateTo(`/rinks/${props.rinkId}`)
        }
    }

    const searchRink = () => {
    if (!props.canEdit) return;
    toggleGlobalSearch({
        open: true,
        options: {
            inputLabel: "Search for a rink",
            resourceTypes: ["rink"],
            callback: async (selection) => {
                emit('update', selection)
            },
        },
    });
};
</script>