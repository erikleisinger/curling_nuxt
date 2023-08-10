<template>
    
        <section name="hammer conversion" class="stats__section">
            <div class="row items-center no-wrap total__card--wrap">
                <slot name="card"/>
                <div class="column">
                    <h2 class="text-md text-bold"><slot name="title"/></h2>
                    <h3 class="text-sm"><slot name="subtitle"/></h3>
                </div>
            </div>
            <span ref="chartContainer" :id="`stats-scroller-${index}`" style="height: 100%">
                  <transition-group appear :enter-active-class="`animated ${enterClass}`" :leave-active-class="`animated ${leaveClass}`"> 
            <slot/>
                  </transition-group>
            </span>


            <q-inner-loading color="deep-purple" :showing="loading" />
        </section>
</template>
<style lang="scss" scoped>
$section-margin: var(--space-xs);


    .stats__section {
        overflow: hidden;
        display: grid;
        grid-template-rows: 25% 75%;
        height: calc(100% - $section-margin * 2);
        border-radius: 0px;
        box-shadow: $pretty-shadow;
        margin: $section-margin;
        padding: var(--space-sm);
        aspect-ratio: 3/2;
        position: relative;
        width: calc(100% - var(--space-md));
        @include sm {
            width: calc(50% - var(--space-md));
        }
        :deep(.pinch-zoom-container) {
            height: 100%!important;
        }
        :deep(canvas) {
            height: 100%!important;
            width: 100%!important;
        }
    }
    .total__card--wrap {
        margin-bottom: var(--space-sm);
    }

</style>
<script setup>
import PinchZoom from "pinch-zoom-js";
import {useSwipe, useRefHistory} from '@vueuse/core'
    const props = defineProps({
        loading: Boolean,
        index: Number,
    })
    onMounted(() => {
        console.log('making zoomer: ', document.querySelector(`#stats-scroller-${props.index}`))
         new PinchZoom(document.querySelector(`#stats-scroller-${props.index}`), {
                maxZoom: 6,
                draggableUnzoomed: false,
            });
          
    })
  
    const emit = defineEmits(['swipe'])
    const chartContainer = ref(null)
    const {direction} = useSwipe(chartContainer, {
        onSwipe: () => {
            if (direction.value === 'left' || direction.value === 'right') {
                emit('swipe', direction.value)
            } 
        }
    })

    const indexes = computed(() => props.index)

    const enterClass = ref('slideInLeft')
    const leaveClass = ref('slideOutLeft')

    const {history} = useRefHistory(indexes)

    watch(history, () => {
        if(history.value[0].snapshot > history.value[1].snapshot) {
                enterClass.value = 'slideInRight'
            leaveClass.value = 'slideInRight'
        } else {
             enterClass.value = 'slideInLeft'
            leaveClass.value = 'slideInLeft'
         
        }
    }, {deep: true})
</script>   