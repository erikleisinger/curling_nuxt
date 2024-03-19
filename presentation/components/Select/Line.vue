<template>

 <div class="row justify-around items-center turn-select-btn__wrap no-wrap">
        <div
            class="select__button pretty-shadow"
            @click="model = 0"
            :class="{ selected: model === 0 }"
        >
            <div class="column items-center justify-center no-wrap text-center">
                Tight
            </div>
        </div>
    
        <div
            class="select__button pretty-shadow"
            @click="model = 1"
            :class="{ selected: model === 1 }"
        >
            <div class="column items-center justify-center no-wrap text-center">
                On line
            </div>
        </div>
         <div
            class="select__button pretty-shadow"
            @click="model = 2"
            :class="{ selected: model === 2 }"
        >
            <div class="column items-center justify-center no-wrap text-center">
                Wide
            </div>
        </div>
    </div>

</template>
<style lang="scss" scoped>
.line__select {
    border: 1px solid $blue-7;
}
    h1 {
        font-size: 2em;
           font-family: $font-family-main;
    }
.turn-select-btn__wrap {
    width: 100%;
    .select__button {
        
        height: v-bind(size);
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

    const emit = defineEmits('update:modelValue');

    const props = defineProps({
        modelValue: [Number, null],
    size: {
        type: String,
        default() {
            return "4em";
        },
    },

       
});
 const model = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
 })
</script>