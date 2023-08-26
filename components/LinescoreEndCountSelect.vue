<template>
<div class="end-count__container ">
   <h2 class="text-md text-bold title">Select # of ends</h2>
    <div class="full-height full-width column end-count__select">
        <q-btn color="deep-purple" rounded @click="onSelect(6)">6 Ends</q-btn>
        <q-btn color="deep-purple" rounded @click="onSelect(8)">8 Ends</q-btn>
        <q-btn color="deep-purple" rounded @click="onSelect(10)"
            >10 Ends</q-btn
        >
    </div>
</div>
</template>
<style lang="scss" scoped>
.end-count__container {
      padding: 0px var(--space-md);
      .title {
        margin-top: var(--space-sm);
      }
      .end-count__select {
    padding: var(--space-md);
    box-sizing: border-box;
    .q-btn {
        margin-bottom: var(--space-md);
    }
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
