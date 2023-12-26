<template>
      <q-select :options="options" behavior="menu" v-model="feature" />
</template>
<script setup>
const props = defineProps({
    disabled: Boolean,
    features: Object,
    modelValue: String,
    title: String,
});

const emit = defineEmits(["update:modelValue"]);

const feature = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val.label);
    },
});

// const featureOptions = { ...props.features, null: null };

// const options = Object.keys(featureOptions);
// const goToFeature = (inc) => {
//     const currentIndex = options.findIndex((o) => o === feature.value);
//     if (currentIndex + inc < 0 || currentIndex + inc > options.length - 1)
//         return;
//     feature.value = options[currentIndex + inc];
// };

const options = Object.entries(props.features).map(([label, value]) => ({
    label,
    value
}))
</script>
