<template>
    <div
        class="column"
        style="position: relative; height: 100px; overflow: hidden; margin-bottom: -24px;"
    >
        <q-btn-toggle
            v-model="model"
            spread
            class="my-custom-toggle select-type"
            no-caps
            rounded
            unelevated
            :toggle-color="model === 0 ? 'negative' : 'positive'"
            color="white"
            :text-color="
                model === null
                    ? 'primary'
                    : model === 0
                    ? 'negative'
                    : 'positive'
            "
            :options="[
                { label: 'Hit', value: 0 },
                { label: 'Draw', value: 1 },
            ]"
            :style="{
                borderBottomLeftRadius: borderRad,
                borderBottomRightRadius: borderRad,
            }"
            clearable
        ></q-btn-toggle>
        <transition
            appear
            enter-active-class="animated fadeInDown"
            leave-active-class="animated fadeOutUp"
            mode="out-in"
            :duration="1500"
        >
            <div v-if="model !== null" style="overflow: hidden">
                <q-btn-toggle
                    v-if="model === 0"
                    v-model="hitModel"
                    spread
                    class="my-custom-toggle select-hit"
                    no-caps
                    rounded
                    unelevated
                    toggle-color="negative"
                    color="white"
                    text-color="negative"
                    :options="[
                        { label: 'Hit and roll', value: 15 },
                        { label: 'Peel', value: 16 },
                        { label: 'Runback', value: 17 },
                    ]"
                    clearable
                ></q-btn-toggle>
                <q-btn-toggle
                    v-else-if="model === 1"
                    v-model="drawModel"
                    spread
                    class="my-custom-toggle select-draw"
                    no-caps
                    rounded
                    unelevated
                    :toggle-color="model === 0 ? 'negative' : 'positive'"
                    color="white"
                    text-color="positive"
                    :options="[
                        { label: 'Front', value: 18 },
                        { label: 'Guard', value: 19 },
                        { label: 'Freeze', value: 20 },
                        { label: 'Tap', value: 21 },
                    ]"
                    clearable
                ></q-btn-toggle>
            </div>
        </transition>
    </div>
</template>
<style lang="scss">
.select-hit,
.select-draw {
    border-top-left-radius: 0px !important;
    border-top-right-radius: 0px !important;
}
.select-hit {
    border: 1px solid;
    border-color: v-bind(selectBorder);
    z-index: 0;
}
.select-draw {
    border: 1px solid;
    border-color: v-bind(selectBorder);
    z-index: 0;
}
.select-type {
    border: 1px solid;
    border-color: v-bind(selectBorder);
    z-index: 6;
    transition: 1s all;
    background-color: white;
}
</style>
<script setup>
const model = ref(null);
const drawModel = ref(null);
const hitModel = ref(null);

const props = defineProps({
    modelValue: [Number, String],
});
const emit = defineEmits(["update:modelValue"]);

const getNewValue = () => {
    console.log('GET NEW VALUE: ', model.value)
    if (model.value === 0 && !hitModel.value) return 0;
        if (model.value === 1 && !drawModel.value) return 1;
        if (model.value === 0) return hitModel.value;
        if (model.value === 1) return drawModel.value;
}
const HIT_TYPES = [
    15, 16, 17
]
const DRAW_TYPES = [
 18, 19,20,21
]

const selections = computed(() => ({model: model.value, draw: drawModel.value, hit: hitModel.value}))
const modelValue = computed(() => props.modelValue)

watch(modelValue, (v) => {
    console.log('model updated: ', v)
    if (v === null) {
         model.value = null;
    } else if (v === 1) {
        model.value = v;
    } else if(v === 2)  {
model.value = v;
    } else if (DRAW_TYPES.includes(v)) {
        console.log('draw type');
        drawModel.value = v;
        model.value = 1
    } else if (HIT_TYPES.includes(v)){
        console.log('HIT TYPE')
         hitModel.value = v; 
         model.value = 0
    }
   
}, {immediate: true})
watch(selections, (v) => {
    console.log('selection updated: ', v, getNewValue())
    emit('update:modelValue', getNewValue())
}, {deep:true,flush:'post'})

// Style bindings

const selectBorder = computed(() => {
    if (model.value === null) return "#1976d2";
    return {
        0: "#d32f2f",
        1: "#4caf50",
    }[model.value];
});

const borderRad = computed(() => {
    if (model.value === null) return "28px!important";
    return "0px!important";
});
</script>
