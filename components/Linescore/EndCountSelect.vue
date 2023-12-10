<template>
<div class="end-count__container column justify-center full-height no-wrap">
   <h2 class="text-xl text-bold title text-center">Select # of ends</h2>
    <div class="row end-count__select justify-around">
        <q-btn color="deep-purple" rounded @click="onSelect(6)" size="xl" >6 Ends</q-btn>
        <q-btn color="deep-purple" rounded @click="onSelect(8)" size="xl" >8 Ends</q-btn>
        <q-btn color="deep-purple" rounded @click="onSelect(10)" size="xl" 
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
        max-width: max(300px, 50%);
    padding: var(--space-md);
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
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
