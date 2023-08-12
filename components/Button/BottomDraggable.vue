<template>
  <!-- storage-key="add-button"
        storage-type="session" -->
    <UseDraggable
      
        :initialValue="initialValue"
        style="position: fixed; z-index: 10000000"
        v-slot="{ isDragging }"
    >
        <q-btn
            fab
            color="deep-purple"
            :icon="icon"
            @click="onClick"
            :style="{ opacity: isDragging ? '60%' : '100%' }"
            style="transition: opacity 0.2s"
        >
        </q-btn>
    </UseDraggable>
</template>
<script setup>
import { UseDraggable } from "@vueuse/components";

const props = defineProps({
    icon: {
        type: String,
        default() {
            return "add";
        },
    },
    onClick: Function,
    position: Object,
});
const initialValue = ref(null);
onBeforeMount(() => {
    if (props.position) {
        initialValue.value = props.position;
    } else {
        initialValue.value = {
            x: window.innerWidth - 75,
            y: window.innerHeight - 100,
        };
    }
});
</script>
