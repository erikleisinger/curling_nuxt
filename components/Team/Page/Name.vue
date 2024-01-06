<template>
    <div class="title-text text-center relative-position" ref="name">
        <div
            v-for="(line, index) in lines"
            :key="index"
            class="name-word"
            :style="{ fontSize: `${fontSize[index]}px` }"
        >
            <span v-for="(word, i) in line" :key="i">{{ `${word} ` }}</span>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.title-text {
    font-family: $font-family-header;
    color: white;
    fill: white;
    width: fit-content;
    padding: 0px 10%;
    .name-word {
        line-height: 0.8;
    }
}
</style>
<script setup>
import { useParentElement, useElementBounding } from "@vueuse/core";
const props = defineProps({
    name: String,
});
const words = computed(() => props.name.split(" "));

const wordLengths = computed(() => {
    const maxLength = Math.max(...words.value.map((w) => w.length));
    return words.value.map((w) => {
        const wordLength = w.length;
        return `${(wordLength / maxLength) * 100}%`;
    });
});

const maxWordLength = computed(() => Math.max(...words.value.map((w) => w.length)))

const lines = computed(() => {
    return words.value.reduce((all, current) => {
        if (!all?.length) return [[current]];
        const isCurrentLowerCase = !containsUppercase(current);
        const isLastWordLowerCase = !containsUppercase(
            all[all.length - 1][all[all.length - 1].length - 1]
        );

        if (isCurrentLowerCase && isLastWordLowerCase) {
            const allClone = [...all];

            const lastLine = allClone.splice(allClone.length - 1, 1)[0];
            console.log("last line: ", lastLine, current, allClone);
            lastLine.push(current);
            return [...allClone, lastLine];
        } else {
            return [...all, [current]];
        }
    }, []);
});
const containsUppercase = (str) => {
    return /[A-Z]/.test(str);
};

const name = ref(null);
const { width: parentWidth, height: parentHeight } = useElementBounding(
    useParentElement(name)
);

const MAX_FONT_SIZE = computed(() => {
    return (parentWidth.value * 1.2) / (maxWordLength.value)
})

const fontSize = computed(() => {
    return lines.value.map((l, i) => {
        let size;
        if (containsUppercase(l[0])) {
            const word = l[0];
            size = parentWidth.value / (word.length / 2);
             if (size > MAX_FONT_SIZE.value) return MAX_FONT_SIZE.value;
        } else {
            const totalWord = l.join(" ");
            size = (parentWidth.value / 2) / (totalWord.length);
            if (size > MAX_FONT_SIZE.value * 0.7) return Number((MAX_FONT_SIZE.value * 0.7).toFixed())
        }

       
        return size;
    });
});
</script>
