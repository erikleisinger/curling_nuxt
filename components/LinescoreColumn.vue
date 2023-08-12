<template>
    <div
        class="scoreboard__end-row justify-center items-center" @click.prevent.stop="setTop"
        v-memo="[score.home]"
    >
        <div class="inner row items-center justify-center q-pt-sm">
            <div class="inner-scorecard text-center" >
                {{ score.home }}
            </div>
        </div>
    </div>
    <div
        class="scoreboard__end-row justify-center items-center" @click.prevent.stop="setBottom"
        v-memo="[score.away]"
    >
        <div class="inner row items-center justify-center q-pt-sm">
            <div class="inner-scorecard text-center" >
                {{ score.away }}
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.scoreboard__end-row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    transform-origin: bottom;
    &:nth-child(2) {
        transform-origin: top;
    }
    padding: var(--space-xxxxs);
    .inner {
        border: 1px solid $grey-5;
        aspect-ratio: 1/1;
        text-align: center;
        border-radius: 32px;
        font-size: calc(50%);
        line-height: 15vh;
        width: 100%;
        font-size: 15vh;
        padding-top: 0.1em;
    }
}
</style>
<script setup>
const props = defineProps({
    endno: Number,
    modelValue: Object,
    visible: Boolean,
});

const emit = defineEmits(["update:model-value", "visible"]);

const score = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:model-value", val);
    },
});

const reset = () => {
    score.value.home = 0;
    score.value.away = 0;
};

const setTop = () => {
    if (!props.visible) return;

    if (score.value.away) {
        reset();
    } else if (score.value.home + 1 < 9) {
        score.value.home += 1;
    }
};
const setBottom = () => {
    if (!props.visible) return;
    if (score.value.home) {
        reset();
    } else if (score.value.away + 1 < 9) {
        score.value.away += 1;
    }
};
</script>
