<template>
    <div class="word" ref="wordRef" :style="{fontSize: `${fontSize}px`}">
        {{ word }}
    </div>
</template>
<style lang="scss" scoped>
.word {
    line-height: 0.7;
}
</style>
<script setup>
import { useParentElement, useElementBounding } from "@vueuse/core";
const props = defineProps({
    word: String,
});

const wordRef = ref(null);
const { width: parentWidth, height: parentHeight } = useElementBounding(
    useParentElement(wordRef)
);

const containsUppercase = (str) => {
    return /[A-Z]/.test(str);
};

const fontSize = computed(() => {
    if (containsUppercase(props.word)) {
        return parentWidth.value / (props.word.length / 2);
    }
       return parentWidth.value / 2.5 / props.word.length;
});
</script>
