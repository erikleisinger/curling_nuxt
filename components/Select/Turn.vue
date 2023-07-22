<template>
     
<div class="column">
    <label class="col-shrink"><h1>Turn</h1></label>
    <div class="row justify-around items-center turn-select-btn__wrap">
       
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
    </div>
    <!-- <q-btn-toggle
        v-model="model"
        spread
        class="my-custom-toggle line__select"
        no-caps
        rounded
        unelevated
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
          {value: 0, slot:'in'},
          { value: 1, slot:'out'},
        ]"
      >
       <template v-slot:in>
        <div class="row no-wrap">
          <q-icon name="rotate_right"/>IN
        </div>
        </template>
         <template v-slot:out>
             <div class="row no-wrap">
                <q-icon name="rotate_left"/>OUT
                      </div>
        </template>
        </q-btn-toggle> -->
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
    font-family: "Montserrat", sans-serif;
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
const model = ref(0);
const props = defineProps({
    size: {
        type: String,
        default() {
            return "90px";
        },
    },
});

const height = computed(() => props.size || '90px')
</script>
