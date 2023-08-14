<template>
    <div class="full-height full-width column end-count__select">
        <q-btn color="deep-purple" rounded @click="onSelect(6)">6 Ends</q-btn>
        <q-btn color="deep-purple" rounded @click="onSelect(8)">8 Ends</q-btn>
        <q-btn color="deep-purple" rounded @click="onSelect(10)"
            >10 Ends</q-btn
        >
    </div>
</template>
<style lang="scss" scoped>
.end-count__select {
    padding: var(--space-md);
    .q-btn {
        margin-bottom: var(--space-md);
    }
}
</style>

<script setup>
const props = defineProps({
    modelValue: Number,
});

const emit = defineEmits(["select", "update:modelValue"]);

const selection = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const onSelect = (num) => {
    emit('select')
    selection.value = num
}
</script>
