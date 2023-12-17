<template>
    <div class="popup-container">
        <div class="popup-container--header">
            <div class="popup-container--header-content">
                <slot name="header" />
            </div>
        </div>
        <q-separator />
        <div class="popup-container--slot-content">
            <slot />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.popup-container {
    margin: var(--space-xs);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    max-height: calc(100 * var(--vh, 1vh) - 65px);
    box-sizing: border-box;
    box-shadow: $pretty-shadow;
    overflow: auto;
    position: fixed;
    top: 0;
    background-color: white;
    z-index: 10;
    .popup-container--header {
        padding: var(--space-sm);
    }
}
</style>
<script setup>
import gsap from "gsap";
import { useMouse } from "@vueuse/core";

const props = defineProps({
    open: Boolean,
});

const { x: mouseX, y: mouseY } = useMouse();

const percentX = ref(0);

const onOpen = () => {
    percentX.value = (mouseX.value / window.innerWidth) * 100;
    const tl = gsap.timeline();
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
};
const onClose = () => {
    gsap.to(".popup-container", {
        scale: 0,
        transformOrigin: `${percentX.value}% bottom`,
        duration: 0.2,
        ease: "sine",
    });
};
watch(
    () => props.open,
    (val) => {
        if (val) {
            onOpen();
        }
        if (!val) {
            onClose();
        }
    },
    { immediate: true }
);
onMounted(() => {
    if (!props.open) {
        gsap.to(".popup-container", {
            scaleY: 0,
            scaleX: 0,
            duration: 0,
        });
    }
    console.log("is open? ", props.open);
});
// onDeactivated(() => {
//     onClose();
// })
</script>
