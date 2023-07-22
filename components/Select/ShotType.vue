<template>

    <SelectWheel
        :modelValue="typeDraw"
        @update:modelValue="updateDraw"

        :active="active === 0"
        @mousedown="selectActive(0)"
          @touchstart="selectActive(0)"
        :options="drawOptions"
        color="#ba68c8"
        size="90px"
    />
     <!-- -->
    <SelectWheel
        :modelValue="typeHit"
        @update:modelValue="updateHit"
 
        :active="active === 1"
           @mousedown="selectActive(1)"
           @touchstart="selectActive(1)"
        :options="hitOptions"
      color="#ff4081" 
         size="90px"
    />
      <!-- -->
</template>
<script setup>
const props = defineProps({
    modelValue: [Number, null],
});

const emit = defineEmits(['update:modelValue'])

const typeDraw = ref(null);
const typeHit = ref(null);
const active = ref(null);

const updateDraw = (v) => {
    typeDraw.value = v;
};
const updateHit = (v) => {
    typeHit.value = v;
};

const selectActive = (n) => {
    active.value = n
};

const hitOptions = [
    { value: 2, label: "Hit" },
    { value: 15, label: "Roll" },
    { value: 16, label: "Peel" },
    { value: 17, label: "Runback" },
];
const drawOptions = [
    { value: 1, label: "Draw" },
    { value: 18, label: "Front" },
    { value: 19, label: "Guard" },
    { value: 20, label: "Freeze" },
    { value: 21, label: "Tap" },
];

const model = computed(() => props.modelValue);

watch(
    model,
    (v) => {
     if (drawOptions.some(({value}) => value === v)) {
           selectActive(0)
            typeDraw.value = drawOptions.findIndex((h) => h.value === v);
            typeHit.value = null;
         
        }  else if (hitOptions.some(({value}) => value === v)) {
               selectActive(1)
            typeHit.value = hitOptions.findIndex((d) => d.value === v);
             typeDraw.value = null;
         
        } 
    },
    { immediate: true }
);

const selectedType = computed(() => {
    let selection = null;
    if (typeDraw.value !== null) {
        selection = drawOptions[typeDraw.value]?.value
    } else if (typeHit.value !== null) {
        selection = hitOptions[typeHit.value]?.value
    }
    return selection || null;
});
watch(
    selectedType,
    (v) => {
        emit('update:modelValue', v)
        // if (!v) {
        //     setTimeout(() => {
        //         selectActive(null)
        //     }, 10)
        // }
    },
    { immediate: true }
);
</script>
