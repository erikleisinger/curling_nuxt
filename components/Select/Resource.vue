<template>
    <div class="column wrap" style="position: relative; min-height: 40px" ref="resourceSelect">
        <q-chip
            v-if="selectedItem"
            clickable
            @click="deselectItem"
            :style="{backgroundColor: computedColor, color: 'inherit'}"
            icon-right="edit"
        >
            <div class="truncate-text">
                {{ selectedItem.label || "No item selected" }}
            </div>
        </q-chip>
        <q-input
            v-model="search"
            @blur="useInput"
            @keydown.enter="onEnter"
            ref="searchInput"
            style="width: 100%"
            clearable
            dense
            @keydown.down="changeSelection(+1)"
            @keydown.up="changeSelection(-1)"
            v-else
        />
        <div
            class="results__container text-black"   v-if="searchResults.length && !selectedItem"
           
        >

            <q-list class="results" separator bordered dark>
                <q-item
                    v-for="(item, index) in searchResults"
                    :key="item.value"
                    clickable
                    v-ripple
                    @click="selectItem(item)"
                    :active="selected === index"
                >
                    <q-item-section>
                        <q-item-label>
                            {{ item.label }}
                        </q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.results__container {
    position: fixed;
    width: 100%;
    top: v-bind(menuPosY);
    left: v-bind(menuPosX);
    max-width: v-bind(maxWidth);
 
    z-index: 50;
 
    .results {
        position: absolute;
        top: 0;
        width: 100%;
        overflow: auto;
        z-index: 100;
        background-color: var(--transparent-heavy);
           height: v-bind(maxHeight);
    overflow: auto;
    }
}
</style>
<script setup>
import { useFocus, useElementBounding, useWindowSize } from "@vueuse/core";
import { VALIDATION_RULES } from "@/constants/validation";
import { useEditorStore } from "@/store/editor";


const props = defineProps({
    allowCustom: Boolean,
    color: String,
    eager: Boolean,
    fallback: String,
    modelValue: Object,
    options: {
        type: Array,
        default() {
            return []
        }
    }
});
const emit = defineEmits(["update:modelValue"]);
const selectedItem = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const selected = ref(-1);

const changeSelection = (inc) => {
    if (selected.value + inc >= searchResults.value.length) return;
    if (selected.value + inc < -1) return;
    selected.value += inc;
};

const searchResults = computed(() => {
    if (!search.value || search.value?.length < 2) {
        if (!props.eager) {
            return []
        } else {
            return props.options;
        }
    }
    const reg = new RegExp(search.value?.toLowerCase());
    return props.options.filter(({ label }) => {
        return reg.test(label.toLowerCase());
    });
});

const search = ref(null);

const selectItem = (team) => {
    selectedItem.value = team;
};

const $q = useQuasar();

const useInput = () => {
    const input = search.value;
    if (!input) {
        selectedItem.value = fallbackItem.value || null;
    } else {
        selectedItem.value = {
            label: input,
            value: 0,
        };
    }
};

const onEnter = () => {
    if ($q.platform.is.mobile || selected.value === -1) {
        useInput();
    } else {
        const selection = searchResults.value[selected.value];
        selectedItem.value = selection;
    }
};
const searchInput = ref(null);

const searchElement = computed(() => searchInput.value?.nativeEl);
const { focused } = useFocus(searchElement);
const fallbackItem = computed(() =>
    props.options.find(({ label }) => label === props.fallback) || {label: props.fallback, value: 0}
);
onMounted(() => {
    if (!props.modelValue && props.fallback) {
        selectedItem.value = props.options.find(
            ({ label }) => label === props.fallback
        ) || {label: props.fallback, value: 0}
    }
});

const deselectItem = () => {
    selectedItem.value = null;
    nextTick(() => {
        searchElement.value.focus();
    });
};
    const {getColor} = useColor();
const computedColor = computed(() => {

    return getColor(props.color) || props.color;
})
const resourceSelect = ref(null)
const {x, y, height, width} = useElementBounding(resourceSelect)
const {height: windowHeight} = useWindowSize();
const menuPosX = computed(() => `${x.value}px`)
const menuPosY = computed(() => `${y.value + height.value}px`)
const maxWidth = computed(() => `${width.value}px`)
const maxHeight = computed(() => `${windowHeight.value - y.value - height.value - 16}px`)
</script>
