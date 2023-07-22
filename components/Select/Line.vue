<template>
<div class="column">
    <label class="col-shrink"><h1>Line</h1></label>
 <div class="row justify-around items-center turn-select-btn__wrap no-wrap">
        <div
            class="select__button pretty-shadow"
            @click="model = 0"
            :class="{ selected: model === 0 }"
        >
            <div class="column items-center justify-center no-wrap">
                Tight
            </div>
        </div>
    
        <div
            class="select__button pretty-shadow"
            @click="model = 1"
            :class="{ selected: model === 1 }"
        >
            <div class="column items-center justify-center no-wrap">
                On line
            </div>
        </div>
         <div
            class="select__button pretty-shadow"
            @click="model = 1"
            :class="{ selected: model === 1 }"
        >
            <div class="column items-center justify-center no-wrap">
                Wide
            </div>
        </div>
    </div>
    </div>
</template>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Hind:wght@300;400;500;600;700&family=Montserrat:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap");
.line__select {
    border: 1px solid $blue-7;
}
    h1 {
        font-size: 2em;
           font-family: "Montserrat", sans-serif;
    }
.turn-select-btn__wrap {
    width: 100%;
    // display: grid;
    // grid-template-rows: 1fr;
    // grid-template-columns: repeat(2, 1fr);
 

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
    const model = ref(0);
    const props = defineProps({
    size: {
        type: String,
        default() {
            return "90px";
        },
    },
});
</script>