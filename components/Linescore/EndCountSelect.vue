<template>

    <LinescorePageContainer @next="emit('select')">
        <template v-slot:title> End count </template>
        <template v-slot:subtitle>
            Not including early endings (handshakes, bell, etc.)
        </template>
        <template v-slot:content>
             <div class="row end-count__select justify-between full-width items-center">
        <q-btn icon="remove" round  @click="changeEnds(-2)"/>
        <div class="end-count">
            <div>{{selection}}</div>
        </div>
           <q-btn icon="add" round  @click="changeEnds(+2)"/>

    </div> 
    </template>
    </LinescorePageContainer>
</template>
<style lang="scss" scoped>



    .end-count__select {
        // max-width: max(300px, 50%);
        padding: var(--space-md);
        box-sizing: border-box;
        margin-left: auto;
        margin-right: auto;
        .q-btn {
            margin-bottom: var(--space-md);
        }
    }
    .end-count {
        $tile-height: 150px;
        $border-width: 6px;
        font-family: $font-family-header;
        color: white;
        // background-color: $app-royal-blue;
        color: $app-royal-blue;
        aspect-ratio: 1/1;
        height: $tile-height;
        border-radius: 16px;
        // @include chunky-border($border-width);
        position: relative;
        div {
            @include xl-text;
            line-height: calc($tile-height - ($border-width * 2));
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>

<script setup>
const props = defineProps({
    modelValue: Number,
});

const emit = defineEmits(["select", "update:modelValue"]);

const selection = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const { getColor } = useColor();

const changeEnds = (inc) => {
    if (selection.value + inc < 2) return;
    if (selection.value + inc > 10) return;
    selection.value += inc;
};

const onSelect = (num) => {
    emit("select");
    selection.value = num;
};
</script>
