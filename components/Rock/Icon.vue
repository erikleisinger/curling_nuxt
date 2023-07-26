<template>
    <div
        class="rock__icon"
        :class="[
            props.disabled ? 'rock-disabled' : '',
            props.selected ? 'selected' : '',
        ]"
        :style="{ position: draggable ? 'absolute' : 'relative' }"
    >
        <svg width="100%" height="100%" :transform="`${rotation}`">
            <circle
                cx="50%"
                cy="50%"
                r="50%"
                stroke="rgba(0,0,0,0.4)"
                stroke-width="2px"
                fill="rgba(0,0,0,0)"
            ></circle>
            <rect
                width="9%"
                height="55%"
                fill="rgba(0, 0, 0, 0.4)"
                x="45%"
                y="22%"
                class="handle"
                stroke-linejoin="round"
                ry="5%"
            />
        </svg>
        <div
            class="row justify-center items-center number-label"
            v-if="props.overlay"
        >
            <slot />
        </div>
    </div>
</template>
<style lang="scss">
.handle {
    border-radius: 4px;
}
.rock__icon {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0);
    border-radius: 50%;
    color: black;
    background-image: v-bind(bg);
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
        rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    aspect-ratio: 1/1;
    overflow: hidden;
    .number-label {
        color: white;
    }

    &.rock-disabled {
        color: rgb(206, 206, 206);
        background-color: rgb(206, 206, 206, 0.4);
        .number-label {
            color: white
        }
    }
    &.selected {
        -webkit-box-shadow: 0px 0px 6px 4px rgba(255, 220, 46, 0.85);
        -moz-box-shadow: 0px 0px 6px 4px rgba(255, 220, 46, 0.85);
        box-shadow: 0px 0px 6px 4px rgba(255, 220, 46, 0.85);
    }
    .number-label {
        height: inherit;
        width: inherit;
        position: absolute;
        left: -1px;
        top: 0;
        right: 0;
        margin: auto;
        z-index: 1;
        border-radius: 50%;
        font-size: 90%;
        text-align: center;
        font-weight: 600;
    }
}
</style>
<script setup lang="ts">
const props = defineProps({
    disabled: Boolean,
    draggable: {
        type: Boolean,
        default() {
            return true;
        },
    },
    color: {
        type: String,
        default() {
            return "red";
        },
    },
    reverse: Boolean,
    overlay: Boolean,
    selected: Boolean,
    size: Number,
});
const bg = computed(() => {
    if (props.disabled) return "linear-gradient(to top, #b0b0b0 0%, #b0b0b0 100%)";

    return (
        {
            blue: `${
                props.overlay
                    ? "linear-gradient(to top, #2664a3 0%, #2664a3 100%)"
                    : "linear-gradient(to top, #3790e9 0%, #2e8be9 100%)"
            }`,
            yellow: `${
                props.overlay
                    ? "linear-gradient(to top,#b1a326 0%, #b1a326 100%)"
                    : "linear-gradient(to top, #ffec3d 0%, #f3dc0f 100%)"
            }`,
            red: `${
                props.overlay
                    ? "linear-gradient(to top, #9e2624 0%, #9e2624 100%)"
                    : "linear-gradient(to top, #e53734 0%, #d33131 100%)"
            }`,
        }[props.color] || "unset"
    );
});
const handleColor = computed(() => {
    if (props.disabled) return "gray";
    return (
        {
            blue: "#003060",
            yellow: "#837600",
            red: "#640200",
        }[props.color] || "unset"
    );
});
const ratio = window.devicePixelRatio;
const calcForRatio = (num: number) => {
    return num - (num % Number(ratio.toFixed(2)));
};

const rotation = computed(
    () => `rotate(${props.reverse ? calcForRatio(225) : calcForRatio(135)})`
);
const handleTop = computed(() => `${calcForRatio(props.size * 0.25)}px`);
const handleLeft = computed(() => `${calcForRatio(props.size * 0.45)}px`);
const translate = computed(
    () => `translate(${handleLeft.value}, ${handleTop.value}) ${rotation.value}`
);
</script>
