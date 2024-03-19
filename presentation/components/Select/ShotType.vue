<template>
    <SelectWheel
        :modelValue="typeDraw"
        @update:modelValue="updateDraw"

        :options="drawOptions"
        color="#ba68c8"
        size="4em"

    />
    <SelectWheel
        :modelValue="typeHit"
        @update:modelValue="updateHit"

        :options="hitOptions"
        color="#ff4081"
        size="4em"
    />
</template>
<script setup>
const props = defineProps({
    modelValue: [Number, null],
});

const emit = defineEmits(["update:modelValue"]);

const typeDraw = ref(null);

const updateDraw = (v) => {
    typeDraw.value = v
    typeHit.value = null;
}

const typeHit = ref(null);

const updateHit = (v) => {
    typeHit.value = v
    typeDraw.value = null
}

const hitOptions = [
    { value: 2, label: "Hit" },
    { value: 15, label: "Roll" },
    { value: 16, label: "Peel" },
    { value: 17, label: "Run" },
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
        if (drawOptions.some(({ value }) => value === v)) {
            typeDraw.value = drawOptions.findIndex((h) => h.value === v);
            typeHit.value = null;
        } else if (hitOptions.some(({ value }) => value === v)) {
            typeHit.value = hitOptions.findIndex((d) => d.value === v);
            typeDraw.value = null;
        }
    },
    { immediate: true }
);

const selectedType = computed(() => {
    let selection = null;
    if (typeDraw.value !== null) {
        selection = drawOptions[typeDraw.value]?.value;
    } else if (typeHit.value !== null) {
        selection = hitOptions[typeHit.value]?.value;
    }
    return selection || null;
});
watch(
    selectedType,
    (v) => {
        emit("update:modelValue", v);
    },
    { immediate: true }
);
</script>
