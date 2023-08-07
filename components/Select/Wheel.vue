<template>
    <div
        style="position: relative; font-size: 1.5em"
        class="row justify-center items-center"
        :style="{ height: size, width: size }"
    >
        <div
            class="input__wrapper row justify-center items-center"
            ref="wheelInput"
        >
            <div
                class="option__center row justify-center items-center"
                :class="{ selected: selected === 0 || modelValue || focused }"
                @click="select(0)"
                :style="{
                    height: focused ? '50%' : '100%',
                    width: focused ? '50%' : '100%',
                }"
            >
                <div class="column items-center">
                    <div
                        v-if="
                            modelValue &&
                            options[modelValue] &&
                            options[modelValue].label
                        "
                    >
                        {{ options[modelValue] && options[modelValue].label }}
                    </div>
                    <div
                        :style="{
                            fontWeight: modelValue === 0 ? 'bold' : '300',
                           
                        }"
                    >
                        {{ options[0] && options[0].label }}
                    </div>
                </div>
            </div>
            <div class="input__container pretty-shadow">
                <div
                    class="option"
                    style="order: 1"
                    :class="{ selected: selected === 1 }"
                    @click="select(1)"
                >
                    <div>{{ options[1] && options[1].label }}</div>
                </div>
                <div
                    class="option"
                    style="order: 2"
                    :class="{ selected: selected === 2 }"
                    @click="select(2)"
                >
                    <div>{{ options[2] && options[2].label }}</div>
                </div>

                <div
                    class="option"
                    style="order: 4"
                    :class="{ selected: selected === 3 }"
                    @click="select(3)"
                >
                    <div>{{ options[3] && options[3].label }}</div>
                </div>
                <div
                    class="option"
                    style="order: 3"
                    :class="{ selected: selected === 4 }"
                    @click="select(4)"
                >
                    <div>{{ options[4] && options[4].label }}</div>
                </div>

                <div class="center__blind" :class="{ active: focused }" />
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.input__wrapper {
    position: absolute;

    height: v-bind(height);
    width: v-bind(height);
    transition: all 0.1s;
    z-index: 3;
    touch-action: none;
   

    .option__center {
        height: 50%;
        width: 50%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        bottom: 0;
        background-color: inherit;
        border-color: inherit;
        border-radius: v-bind(borderRadius);
        border-color: rgba(0, 0, 0, 0.1);
        z-index: 5;
        color: v-bind(color);
        background-color: white;
        border-width: 3px;
           font-size: 0.9em;


        &.selected {
            color: white !important;
            font-weight: bold;
            background-color: v-bind(color);
            border-width: 0px;
            &:nth-child(1) {
                border-left-width: 3px;
            }
            &:nth-child(2) {
                border-bottom-width: 1px;
            }
            &:nth-child(4) {
                border-top-width: 1px;
            }
            &:nth-child(5) {
                border-left-width: 1px;
            }
        }
    }
    .input__container {
        font-family:$font-family-main;
        display: grid;
        position: absolute;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        background-color: white;
        position: relative;
        border-radius: v-bind(borderRadius);
        border-color: rgba(0, 0, 0, 0.1) !important;
        border: 1px solid;
        overflow: hidden;
        z-index: 0;
        transition: all 0.05s linear;
        height: 100%;
        width: 100%;
      
        .option {
            z-index: 2;
            border: 0px solid;
            border-color: inherit;
            color: v-bind(color);

               font-size: 0.7em;
            display: flex;
            justify-content: center;
            align-items: center;
            &.selected {
                color: white;
                font-weight: bold;
                background-color: v-bind(color);
            }
            > div {
                text-align: center;
            }
            &:nth-child(1) {
                border-right-width: 1px;
            }
            &:nth-child(2) {
                border-bottom-width: 1px;
            }
            &:nth-child(3) {
                border-left-width: 1px;
            }
            &:nth-child(4) {
                border-top-width: 1px;
            }
        }

        .center__blind {
            height: 100%;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            margin: auto;
            bottom: 0;
            background-color: v-bind(color);
            border-radius: v-bind(borderRadius);
            z-index: 2;
            &.active {
                height: 50%;
                width: 50%;
            }
        }
    }
}
@keyframes grow {
    0% {
        height: 50%;
        width: 50%;
    }
    100% {
        height: 100%;
        width: 100%;
    }
}
@keyframes shrink {
    0% {
        height: 100%;
        width: 100%;
    }
    100% {
        height: 50%;
        width: 50%;
    }
}
</style>
<script setup lang="ts">
import {
    useThrottleFn,
    useEventListener,
    useMouseInElement,
    useSwipe,
    onClickOutside,
    onLongPress,
} from "@vueuse/core";

interface WheelOption {
    label: string;
    value: number;
    to: string;
}

interface Props {
    color?: string;
    options: WheelOption[];
    modelValue: number | null;
    persistent?: boolean;
    size: string;
}

const props = withDefaults(defineProps<Props>(), {
    color: "#1976d2",
    size: "130px",
    persistent: false,
});

const emit = defineEmits(["blur", "update:modelValue"]);

const selected = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});
const lastSelected = ref(null);

const hideWheel = computed(() => (selected.value === 0 ? "none" : "block"));

const transition = ref("transform 0.3s");

const select = (num: number, force = false) => {
    if (!props.options[num]) return;
    if (selected.value === num && !force) {
        selected.value = null;
    } else {
        selected.value = num;
    }
    if (props.options[num].to) navigateTo(props.options[num].to);
};

const dragging = ref(false);
const wheelInput = ref(null);
const mouse = useMouseInElement(wheelInput);
const startDrag = () => {
    if (dragging.value) return;
    focused.value = true;
    dragging.value = true;
    document.addEventListener("touchmove", dragMove);
    document.addEventListener("touchend", dragEnd);
};

function distanceToCenter(x1: number, y1: number, x2: number, y2: number) {
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
}

const isInsideCircle = (
    centerX: number,
    centerY: number,
    pointX: number,
    pointY: number,
    radius: number
) => {
    const distance = distanceToCenter(centerX, centerY, pointX, pointY);
    return distance < radius;
};

const getCircleQuadrant = (
    xPos: number,
    yPos: number,
    elementHeight: number,
    elementWidth: number
) => {
    const isCenter = isInsideCircle(
        elementWidth / 2,
        elementHeight / 2,
        xPos,
        yPos,
        elementHeight / 4
    );
    if (isCenter) {
        return 0;
    }
    if (xPos > elementWidth / 2) {
        if (yPos > elementHeight / 2) {
            return 3;
        } else {
            return 2;
        }
    } else {
        if (yPos > elementHeight / 2) {
            return 4;
        } else {
            return 1;
        }
    }
};

const dragMove = () => {
    if (!dragging.value) return;
    const { elementX, elementY, elementHeight, elementWidth } = mouse;
    const newQuadrant = getCircleQuadrant(
        elementX.value,
        elementY.value,
        elementHeight.value,
        elementWidth.value
    );
    if (newQuadrant === selected.value) return;
    select(
        getCircleQuadrant(
            elementX.value,
            elementY.value,
            elementHeight.value,
            elementWidth.value
        ),
        true
    );
};
const dragEnd = (e: TouchEvent) => {
    e.preventDefault();
    if (!dragging.value) return;
    if (!props.persistent) focused.value = false;
    dragging.value = false;

    document.removeEventListener("touchmove", dragMove);
    document.removeEventListener("touchend", dragEnd);
};

const focused = ref(false);
onBeforeMount(() => {
    if (props.persistent) focused.value = true;
});

// useEventListener(wheelInput, 'touchstart', () => selected.value = 0)
onLongPress(wheelInput, startDrag, { delay: 60 });
useEventListener(wheelInput, "mouseup", dragEnd);
useEventListener(wheelInput, "click", (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    focused.value = true;
});

const borderRadius = computed(() => (focused.value ? `50%` : "16px"));
onClickOutside(wheelInput, () => {
    if (!props.persistent) focused.value = false;
});

const height = computed(() =>
    !focused.value ? props.size : `calc(${props.size} * 2)`
);
</script>
