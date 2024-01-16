<template>
    <div class="popup-container" :id="`container-${uniqueId}`" :class="{bottom, right}" :style="{zIndex}">
        <div class="popup-container--header" ref="header" :style="{display: hasHeader ? 'block' : 'none'}">
            <div class="popup-container--header-content">
                <slot name="header" />
            </div>
        </div>
        <q-separator />
        <div class="popup-container--slot-content"  :id="`content-${uniqueId}`">
            <slot v-if="ready"/>
        </div>
    </div>
    <div class="popup--overlay" :id="`overlay-${uniqueId}`" v-show="!hideOverlay" :style="{pointerEvents: hideOverlay || !isOpen ? 'none' : 'all'}">

    </div>

</template>
<style lang="scss" scoped>

.popup-container {
    margin: var(--space-xs);
    
    // border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    height: calc(100 * var(--vh, 1vh) - 82px);
    width: calc(100vw - (2 * var(--space-xs)));
    max-height: v-bind(maxHeight);
    max-width: calc(1300px - (2 * var(--space-xs)));
    box-sizing: border-box;
    box-shadow: $pretty-shadow;
    position: fixed;
    max-width: v-bind(maxWidth);
    // background-color: white;
    overflow: hidden;
    &.bottom {
       bottom: 0px;
       @include sm {
        bottom: 0px;
       }
    }
    &:not(.bottom) {
        top: 65px;
    }

     &.right{
        right: 0;
        @include sm {
            right: v-bind(desktopRight);

        }
    }
    &:not(.right) {
        left: 0;
        right: 0;
    }
    @include sm {
         height: calc(100 * var(--vh, 1vh) - 80px);
         margin-left: auto;
        margin-right: auto;
    }
    .popup-container--header {
        padding: var(--space-sm);
        background-color: $app-mint;
        color: white;
        font-size: 1.2rem;
        border-top-left-radius: inherit;
         border-top-right-radius: inherit;
    }
    .popup-container--slot-content {
        height: v-bind(contentHeight);
        min-height: v-bind(contentHeight);
        overflow: auto;
        background-color: white;
        margin-top: -1px;
       
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
    z-index:0;
}
</style>
<script setup>
import gsap from "gsap";
import { useMouse, useElementBounding, useEventListener } from "@vueuse/core";

const props = defineProps({
     bottom: Boolean,
     hideOverlay: Boolean,
      maxHeight: {
        type: String,
        default: 'unset'
    },
      maxWidth: {
        type: String,
        default: 'calc(1300px - (2 * var(--space-xs)))'
    },
    open: Boolean,
    right: Boolean,
   
   
});

const $q = useQuasar();

const slots = useSlots();

const hasHeader = computed(() => !!slots.header)

const emit = defineEmits(['hide'])

const { x: mouseX, y: mouseY } = useMouse();

const percentX = ref(0);
const percentY = ref(0);

const desktopRight = computed(() => `calc(${window.innerWidth * ((100 - percentX.value) / 100)}px - (${props.maxWidth} / 2))`)

const timeline = ref(null)

const ready = ref(false)

const uniqueId = `id-${(Math.random() * 1000000000000).toFixed()}`;

const onOpen = () => {
  
    percentX.value = (mouseX.value / window.innerWidth) * 100;
    percentY.value = (mouseY.value / window.innerHeight) * 100;
const tl = gsap.timeline();
timeline.value = tl
    tl.fromTo(
        `#container-${uniqueId}`,
        {
            scaleX: 0,
            scaleY: 0.05,
        },
        {
            scaleX: 1,
            scaleY: 1,
            transformOrigin: `${percentX.value}% ${percentY.value}%  `,
            duration: 0.2,
            simple: true,
            ease: "power",
            onComplete: () => {
ready.value = true;
    }
        }
    );

    tl.from(".popup-container--slot-content", {
        opacity: 0,
        duration: 0.1,
        
    });
    tl.to(`#overlay-${uniqueId}`, {
        opacity: 1,
    })

};
const onClose = () => {
    timeline.value.pause();
    gsap.to(`#container-${uniqueId}`, {
        scale: 0,
        transformOrigin: `${percentX.value}% ${percentY.value}% `,
        duration: 0.2,
        ease: "sine",
    });
     gsap.to(`#overlay-${uniqueId}`, {
        opacity: 0,
        duration: 0.2,
        ease: "sine",
        onComplete: () => {
            ready.value = false;
        }
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
            window.noPopState = true;
            onOpen();
            calculateZIndex()
        }
        if (!val) {
             window.noPopState = false;
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

const zIndex = ref(12)

const calculateZIndex = () => {
    const containers = document.querySelectorAll('.popup-container')
    const maxZIndex = Array.from(containers).reduce((all, container) => {
        if (container.id === `container-${uniqueId}`) return all;
        const {zIndex} = container.style;
        if (Number(zIndex) > all) return Number(zIndex)
        return all;
      
    }, 0)
    zIndex.value = maxZIndex < 12 ? 12 : maxZIndex + 1;
}



const header = ref(null);
const {height: headerHeight} = useElementBounding(header);
const contentHeight = computed(() => `calc(100% - ${headerHeight.value}px)`)

useEventListener(window, 'popstate', (e) => {
    if (!isOpen) return;
    emit('hide')
})




</script>
