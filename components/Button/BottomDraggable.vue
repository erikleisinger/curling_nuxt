<template>
<UseDraggable storage-key="add-button" storage-type="session" :initialValue="initialValue" style="position: fixed" v-slot="{isDragging}">

            <q-btn
                fab
                color="deep-purple"
                icon="add"
                @click="onClick"
                :style="{opacity: isDragging ? '60%' : '100%'}"
                style="transition: opacity 0.2s"
            >
 
            </q-btn>
</UseDraggable>
</template>
<script setup>
import {UseDraggable} from '@vueuse/components'

    const props = defineProps({
        onClick: Function,
    })
const initialValue = ref(null)
onBeforeMount(() => {
    initialValue.value = {x: window.innerWidth - 75, y: window.innerHeight - 75}
})
</script>