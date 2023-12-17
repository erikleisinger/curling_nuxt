<template>
    <div class="column items-center">
        <div
            class="row justify-between items-center no-wrap"
            style="width: 100%"
        >
            <div style="width: 20%" class="row justify-center">
                <q-btn
                    flat
                    round
                    icon="chevron_left"
                    @click="goToFeature(-1)"
                    :disable="disabled"
                />
            </div>
            <h2
                class="text-md truncate-text text-center"
                style="width: 60%"
                :style="{
                    textDecoration: props.disabled ? 'line-through' : '',
                }"
            >
                {{ title }}
            </h2>
            <div style="width: 20%" class="row justify-center">
                <q-btn
                    flat
                    round
                    icon="chevron_right"
                    @click="goToFeature(+1)"
                    :disable="disabled"
                />
            </div>
        </div>
    </div>
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
        emit("update:modelValue", val);
    },
});

const featureOptions = { ...props.features, null: null };
const options = Object.keys(featureOptions);
const goToFeature = (inc) => {
    const currentIndex = options.findIndex((o) => o === feature.value);
    if (currentIndex + inc < 0 || currentIndex + inc > options.length - 1)
        return;
    feature.value = options[currentIndex + inc];
};
</script>
