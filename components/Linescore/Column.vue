<template>
    <div
        class="scoreboard__end-row justify-center items-center"
        @click.prevent.stop="setTop"
        v-memo="[score.home]"
        ref="top"
    >
        <div class="inner row items-center justify-center q-pt-sm">
            <div class="inner-scorecard text-center">
                {{ score.home }}
            </div>
        </div>
    </div>

    <div
        class="scoreboard__end-row justify-center items-center"
        @click.prevent.stop="setBottom"
        v-memo="[score.away]"
        ref="bottom"
    >
        <div class="inner row items-center justify-center q-pt-sm">
            <div class="inner-scorecard text-center">
                {{ score.away }}
            </div>
        </div>
    </div>
    <div class="extra__container" v-if="extra">
        <q-btn icon="remove" round @click="emit('remove')"></q-btn>
    </div>
    <div class="shake__container" v-if="shakeable || canExtra" ref="shaker" :style="shakeStyle">
        <q-btn
        v-if="shakeable"
            :round="!isRevealed"
            rounded
            :color="isRevealed ? 'primary' : 'white'"
            @click="handleShake"
            no-wrap
            ><q-icon
                name="handshake"
                :color="isRevealed ? 'white' : 'primary'"
            />

            <span class="shake-hands__text" :class="{isRevealed}">Shake hands?</span>
              <q-tooltip v-if="$q.platform.is.desktop">
                        Shake hands
                    </q-tooltip>
            </q-btn
        >
           <q-btn
           v-if="canExtra"
            round
            no-wrap
            icon="add"
            >

         <q-tooltip >
                        Extra end
                    </q-tooltip>
            </q-btn
        >
    </div>
</template>
<style lang="scss" scoped>
.shake-hands__text {
    max-width: 0px;
    transition: 0.2s all;
    &.isRevealed {
        max-width: 500px;
    }
}
.scoreboard__end-row {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    transform-origin: bottom;
    &:nth-child(2) {
        transform-origin: top;
    }

    padding: var(--space-md);
    .inner {
        border: 1px solid $grey-5;
        aspect-ratio: 1/1;
        text-align: center;
        border-radius: 32px;
        font-size: calc(50%);
        line-height: 15vh;
        width: 100%;
        font-size: 12vh;
        padding-top: 0.1em;
    }
}
.extra__container {
    position: absolute;
    top: 0;
    bottom: 0;
    height: 40px;

    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
.shake__container {
    position: absolute;
    top: 0;
    bottom: 0;
    height: 40px;
    
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
<script setup>
import { onClickOutside, useConfirmDialog } from "@vueuse/core";
const props = defineProps({
    canExtra: Boolean,
    endno: Number,
    extra: Boolean,
    modelValue: Object,
    shakeable: Boolean,
    visible: Boolean,
});

const emit = defineEmits(["shake", "remove", "update:model-value"]);

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

const top = ref(null);
const bottom = ref(null)

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

const { isRevealed, reveal, confirm, cancel, onConfirm } = useConfirmDialog();

const handleShake = () => {
    if (!isRevealed.value) {
        reveal();
    } else {
        confirm();
    }
};

onConfirm(() => {
    emit('shake')
})

const shaker = ref(null);
onClickOutside(shaker, cancel)

const $q = useQuasar();

const shakeStyle = computed(() => {
    if ($q.platform.is.desktop) {
        return {
            left: 0,
            right: 0,
        }
    } else {
        return {
            right: `-1em`
        }
    }
})

</script>
