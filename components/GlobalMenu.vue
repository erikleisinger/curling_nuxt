<template>
    <Teleport to="#global-container">
        <div class="global-menu__positioner">
            <div
                class="global-menu hide-scroll"
                :style="{
                    left: leftVal === 'unset' ? leftVal : `${leftVal}px`,
                    right: rightVal === 'unset' ? rightVal : `${rightVal}px`,
                    top: topVal === 'unset' ? topVal : `${topVal}px`,
                    bottom: bottomVal === 'unset' ? bottomVal : `${bottomVal}px`,
                    visibility: showing ? 'visible' : 'hidden',
                }"
                ref="menu"
                v-show="open"
                :id="uniqueId"
            >
                <slot />
            </div>
        </div>
    </Teleport>
</template>
<style lang="scss" scoped>
.global-menu__positioner {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    pointer-events: none;
    // background-color: rgba(0,0,0,0.3);
    .global-menu {
        position: absolute;
        pointer-events: all;
        max-height: v-bind(maxHeight);
        // min-height: 200px;
        overflow: auto;
        margin-left: auto;
        margin-right: auto;
    }
}
</style>
<script setup>
import {
    useMouse,
    useElementSize,
    onClickOutside,
    useParentElement,
} from "@vueuse/core";
import gsap from "gsap";

const props = defineProps({
    closeAnimation: {
        type: Boolean,
        default: true,
    },
    closeOnOutsideClick: {
        type: Boolean,
        default: true
    },
    modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue", 'close']);

const open = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const uniqueId = `global-menu-${(Math.random() * 1000000000000).toFixed()}`;

const { x, y } = useMouse();

const menu = ref(null);
const { height, width } = useElementSize(menu);

const xVal = ref(0);
const yVal = ref(0);
const bottomVal = ref("unset");
const topVal = ref("unset");
const leftVal = ref('unset');
const rightVal = ref('unset')

const getXVal = () => {
    if (x.value + (width.value / 2) >= window.innerWidth) {
        leftVal.value = 0;
    } else {
        leftVal.value = 'unset'
    }
    if (x.value - width.value < 0) {
        rightVal.value = 0;
    } else {
        rightVal.value = 'unset'
    }
    if (x.value <= 0) return 0;
    if (x.value >= window.innerWidth) return window.innerWidth - width.value;
    if (x.value + (width.value / 2) > window.innerWidth) {
        return x.value - width.value;
    }
    return x.value - width.value / 2;
};
const getYVal = () => {
    if (y.value >= window.innerHeight / 2) {
        topVal.value = "unset";
        bottomVal.value = window.innerHeight - y.value;
        reverseY.value = true;
    } else {
        bottomVal.value = "unset";
        topVal.value = y.value;
        reverseY.value = false;
    }
};
const calcMenuPos = () => {
    getYVal();
    getXVal();
    // getXVal()
    // const newYVal = getYVal()
    // xVal.value = 
    // yVal.value = newYVal < 0 ? 0 : newYVal;
};

const reverseY = ref(false);
const reverseX = ref(false);

const showing = ref(false);
watch(
    () => props.modelValue,
    (val, oldVal) => {
        if (val === oldVal || !val) {
            close();
            return;
        }

        
        setTimeout(() => {
            calcMenuPos();
        showing.value = true;
        setMaxHeight();
            animateOpen();
        }, 50);
    }
);

const animateOpen = () => {
    gsap.fromTo(
        `#${uniqueId}`,
        {
            scaleY: 0,
        },
        {
            scaleY: 1,
            transformOrigin: reverseY.value ? "bottom" : "top",
            duration: 0.2,
        }
    );
};

const close = () => {
    showing.value = false;
                open.value = false;
                emit('close')
    // gsap.fromTo(
    //     `#${uniqueId}`,
    //     {
    //         scaleY: 1,
    //     },
    //     {
    //         scaleY: 0,
    //         transformOrigin: reverseY.value ? "bottom" : "top",
    //         duration: 0.2,
    //         onComplete: () => {
    //             showing.value = false;
    //             open.value = false;
    //         },
    //     }
    // );
};

onClickOutside(menu, (e) => {
    if (!open.value || !props.closeOnOutsideClick) return;
    close();
    maxHeight.value = "unset";
});

const maxHeight = ref("unset");

const setMaxHeight = () => {
    let h;
    if (reverseY.value) {
        h = window.innerHeight - bottomVal.value;
    } else {
        h = window.innerHeight - topVal.value;
    }
    maxHeight.value = `${h - 16}px`;
};
</script>
