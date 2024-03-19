<template>
    <q-btn flat rounded style="line-height: 1.1">
        <Rings
            :twelveft="active ? getColor(color) : 'white'"
            :eightft="active ? 'white' : getColor('slate')"
            :fourft="active ? getColor(color) : 'white'"
            :buttonft="active ? 'white' : getColor('slate')"
            size="1.4em"
                            class="q-mr-xs"
            />
            <span style="padding-top: 1px">
            <slot/>
            </span>
    </q-btn>
</template>
<script setup>
const props = defineProps({
    color: String,
    active: Boolean,
});

const emit = defineEmits(["update:modelValue"]);


const { getColor } = useColor();
</script>
