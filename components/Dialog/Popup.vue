<template>
    <div class="popup-container" :class="{bottom, right}">
        <div class="popup-container--header" ref="header">
            <div class="popup-container--header-content">
                <slot name="header" />
            </div>
        </div>
        <q-separator />
        <div class="popup-container--slot-content">
            <slot />
        </div>
    </div>
    <div class="popup--overlay" v-show="!hideOverlay">

    </div>
</template>
<style lang="scss" scoped>
.popup-container {
    margin: var(--space-xs);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    height: calc(100 * var(--vh, 1vh) - 65px);
    width: calc(100vw - (2 * var(--space-xs)));
    max-height: v-bind(maxHeight);
    max-width: calc(960px - (2 * var(--space-xs)));
    box-sizing: border-box;
    box-shadow: $pretty-shadow;
    position: fixed;
    max-width: v-bind(maxWidth);
    background-color: white;
    overflow: hidden;
    z-index: 10;
    &.bottom {
        bottom: 50px;
        @include sm {
            bottom: 65px;
        }
    }
    &:not(.bottom) {
        top: 0;
    }

     &.right{
        right: 0
    }
    &:not(.right) {
        left: 0;
    }
    @include sm {
         height: calc(100 * var(--vh, 1vh) - 80px);
    }
    .popup-container--header {
        padding: var(--space-sm);
    }
    .popup-container--slot-content {
        height: v-bind(contentHeight);
        overflow: auto;
    }
}
.popup--overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color:rgba(0,0,0,0.2);
    opacity: 0;
    z-index:1;
    pointer-events: none;
}
</style>
<script setup>
import gsap from "gsap";
import { useMouse, useElementBounding } from "@vueuse/core";

const props = defineProps({
     bottom: Boolean,
     hideOverlay: Boolean,
      maxHeight: {
        type: String,
        default: 'unset'
    },
      maxWidth: {
        type: String,
        default: 'calc(960px - (2 * var(--space-xs)))'
    },
    open: Boolean,
    right: Boolean,
   
   
});

const { x: mouseX, y: mouseY } = useMouse();

const percentX = ref(0);

const timeline = ref(null)

const onOpen = () => {
    percentX.value = (mouseX.value / window.innerWidth) * 100;
const tl = gsap.timeline();
timeline.value = tl
    tl.fromTo(
        ".popup-container",
        {
            scaleX: 0,
            scaleY: 0.05,
        },
        {
            scaleX: 1,
            scaleY: 1,
            transformOrigin: `${percentX.value}% bottom `,
            duration: 0.2,
            ease: "power",
        }
    );

    tl.from(".popup-container--slot-content", {
        opacity: 0,
        duration: 0.1,
    });
    tl.to('.popup--overlay', {
        opacity: 1,
    })

};
const onClose = () => {
    timeline.value.pause();
    gsap.to(".popup-container", {
        scale: 0,
        transformOrigin: `${percentX.value}% bottom`,
        duration: 0.2,
        ease: "sine",
    });
     gsap.to(".popup--overlay", {
        opacity: 0,
        duration: 0.2,
        ease: "sine",
    });
};

const isOpen = ref(false)
watch(
    () => props.open,
    (val) => {
     
        isOpen.value = val;
    }
);
watch(
    isOpen,
    (val) => {
        if (val) {
            onOpen();
        }
        if (!val) {
            onClose();
        }
    }
);
onMounted(() => {
    isOpen.value = props.open
    if (!props.open) {
        gsap.to(".popup-container", {
            scaleY: 0,
            scaleX: 0,
            duration: 0,
        });
    }
});

const header = ref(null);
const {height: headerHeight} = useElementBounding(header);
const contentHeight = computed(() => `calc(100% - ${headerHeight.value}px)`)
</script>
