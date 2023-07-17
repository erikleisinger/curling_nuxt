<template>
<div>
    {{score}}
    <q-popup-edit v-model="label" auto-save v-slot="scope">
        <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" @blur="scope.set"></q-input>
      </q-popup-edit>
      </div>
</template>
<script setup lang="ts">
    const props = defineProps({
        score: Number,
    });
    const emit = defineEmits(['update-score'])

    const label = computed({
        get() {
            return props.score
        },
        set(val) {
            emit('update-score', val)
        }
    })
</script>