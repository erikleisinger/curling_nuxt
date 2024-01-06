<template>
    <header class="header__container" ref="header">
        <div class="underlay" ref="underlay">
            <q-img
                :src="backgroundImage"
                spinner-color="white"
                v-if="backgroundImage"
                class="background"
                position="50% 50%"
                fit="cover"
                :style="{height: `${headerHeight}px`}"
            ></q-img>
            <slot name="underlay"/>
            <div class="mid-underlay" />
        </div>
        <div class="header--content">
           
            <slot name="prepend">
                <div style="height: 1em"/>
            </slot>
   
            <div class="title-container">
                <TeamPageName :name="title"/>
            </div>
            <slot name="append"/>
        </div>
    </header>
</template>
<style lang="scss" scoped>
.header__container {
    
    position: relative;
    width: 100%;
    border-radius: 50%;
    min-height: v-bind(minimumHeight);
    .header--content {
        z-index: 1;
        position: relative;
        min-height: inherit;
        padding-bottom: calc(var(--space-lg) + var(--space-sm));
        display: flex;
        flex-direction: column;
    }

    .title-container {
        margin-top: -4px;
        min-height: 100px;
        
        display: flex;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
        h1 {
           
            font-family: $font-family-header;
            text-align: center;
            padding: 0px var(--space-md);
            
            color: white;

            margin: auto;
            @include lg-text;
            font-size: clamp(2rem, 10vw, 4rem);
           
        }
    }

    .underlay {
        bottom: 0;
        position: absolute;
        left: -10%;
        right: 0;
        margin: auto;
        // height: 200%;
        aspect-ratio: 1/1;
        width: 150%;
        @include md {
            width: 110%;
            left: -5%;
        }

        border-radius: 50%;
        z-index: 0;
        left: -25%;
        overflow: hidden;
        .background {
            position: absolute;
            height: 50%;
            width: 100%;
            bottom: 0;
        }
        box-shadow: $pretty-shadow;
        .mid-underlay {
            position: absolute;
            height: 100%;
            width: 100%;

            border: 5px solid white;
            background-color: rgba(0, 0, 0, 0.3);
            top: 0;
            border-radius: inherit;
        }
    }
}
</style>

<script setup lang="ts">
import {useElementSize, useElementBounding} from '@vueuse/core'
const props = defineProps<{
    backgroundImage: string;
    minHeight: string;
    title: string;
}>();
const emit = defineEmits(["loaded"]);
const { truncateWords } = useText();
const underlay = ref(null);
const {width: underlayWidth} = useElementSize(underlay);
const header = ref(null)
const {height:headerHeight} = useElementBounding(header)

const $q = useQuasar();

const minimumHeight = computed(() => {
    if (props.minHeight) return props.minHeight;
    if ($q.screen.lt.md) {
        return '250px'
    }
    return '300px'
})

</script>
