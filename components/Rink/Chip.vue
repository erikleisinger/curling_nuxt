<template>
     <q-chip dense class="text-sm q-mx-none text-bold" style="width: min-content"   clickable  @click.stop>
        <q-icon flat round dense name="location_on" color="red" style="padding-bottom: 1px"/>
        <!-- :outline="!!rink" -->
        <!-- :color="!!rink ? 'blue' : ''" :text-color="!!rink ? 'white' : 'black'" -->
        <span v-if="!!rink">{{rink?.name}}</span>
        <span v-else-if="!canEdit">{{noRinkText}}</span>
        <span v-else>{{noRinkEditText}}</span>
        <q-menu v-model="menuOpen">
            <q-list>
                <q-item clickable v-ripple @click="viewRink">
                    <q-item-section avatar>
                        <q-icon name="visibility" dense size="1.2em"/>
                    </q-item-section>
                    <q-item-section>View rink</q-item-section>
                </q-item>
                <q-item v-if="canEdit" clickable v-ripple @click="searchRink">
                    <q-item-section avatar>
                        <q-icon name="search" dense size="1.2em"/>
                    </q-item-section>
                    <q-item-section>{{editText}}</q-item-section>
                </q-item>
            </q-list>   
        </q-menu>
      </q-chip>
</template>
<script setup>
    import Rink from '@/store/models/rink';
    import {useDialogStore} from '@/store/dialog'

    const props = defineProps({
        canEdit: Boolean,
        editText: {
            type: String,
            default: 'Edit rink'
        },
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
    const menuOpen = ref(false)
   const viewRink = () => {
    menuOpen.value = false;
    return navigateTo(`/rinks/${props.rinkId}`)
   }

    const searchRink = () => {
    if (!props.canEdit) return;
    menuOpen.value = false;
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