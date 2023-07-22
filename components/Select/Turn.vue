<template>
     

    <div class="row turn-select-btn__wrap">
       
        <div
            class="select__button pretty-shadow"
            @click="model = 0"
            :class="{ selected: model === 0 }"
        >
            <div class="column items-center justify-center no-wrap">
                <q-icon name="rotate_right" />in
            </div>
        </div>
    
        <div
            class="select__button pretty-shadow"
            @click="model = 1"
            :class="{ selected: model === 1 }"
        >
            <div class="column items-center justify-center no-wrap">
                <q-icon name="rotate_left" />out
            </div>
        </div>
    </div>

</template>
<style lang="scss" scoped>

.line__select {
    border: 1px solid $blue-7;
}
.turn-select-btn__wrap {
    width: 100%;
    height: fit-content;
    font-family: inherit;
 
    h1 {
        font-size: 2em;
    }
    .select__button {
        height: v-bind(height);
        background-color: white;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 16px;
        aspect-ratio: 1/1;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.1s linear;
        font-size: 1.5em;
        &.selected {
            border: 3px solid $blue-8;
            color: $blue-8;
        }
    }
}
</style>
<script setup>

const props = defineProps({
    modelValue: Number,
    size: {
        type: String,
        default() {
            return "90px";
        },
    },
});

const emit = defineEmits(['update:modelValue'])

const model = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})

const height = computed(() => props.size || '90px')
</script>
