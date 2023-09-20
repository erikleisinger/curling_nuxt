<template>
    <div class="attribute__container column" :class="{ highlight: expanded }" @click="expand" :style="styleObj">
             
         <div>
        <div class="row no-wrap items-center">
      
           
            <!-- <q-icon size="1em" :name="icon" :color="color" /> -->
            <h3 class="text-sm truncate-text">{{title}}</h3>
          
            
        </div>
        <div class="row">
        <div class="text-xxxl text-bold value row">
            <slot/>
            <span v-if="expanded">
            <slot name="contentExpanded"/>
            </span>
           
        </div>
           <div class="text-sm row items-center q-ml-sm">
                <slot name="extra"/>    
           </div>
        </div>

        </div>
       <div class="bar" v-if="showPercent"/>
      
      

        <slot name="tooltip"/>
    </div>
</template>
<style lang="scss" scoped>
.attribute__container {
    padding: var(--space-xs);
    padding-left: var(--space-sm);
    background-color: rgba(0,0,0,0.015);
    // border: 1px solid $grey-4;
    border-radius: 16px;
    margin-bottom: var(--space-sm);
    height: fit-content;
    transition: width 0.2s;
    min-width: 150px;
    color: #36454F;
    
    .q-icon {
        margin-right: var(--space-xxs);
    }
    .value {
        // margin-left: 1.2em;
    }
    &.highlight {
        border: v-bind(highlightBorder)
    }
           .bar {
            height: 0.4em;
            width: 100%;
            background-color: rgba(0,0,0,0.1);
            border-radius: 4px;
            position: relative;
            &:after {
                content: '';
                height: 100%;
                width: v-bind(statPercent);
                border-radius: inherit;
                position: absolute;
                top: 0;
                left: 0;
                background-color: $amber;
            }
        }
}
</style>

<script setup>
const props = defineProps({
    color: String,
    expandable:Boolean,
    icon: String,
    showPercent: Boolean,
    percent: Number,
    title: String,
});

const expanded = ref(false)

const statPercent = computed(() => `${props.percent}%`)

const expand = () => {
    if (!props.expandable) return;
    expanded.value = !expanded.value
}

const styleObj = computed(() => {
    if (!expanded.value) return {};
    return {
        width: '90%'
    }
}) 
const {getColor} = useColor()
const highlightBorder = `2px solid ${getColor(props.color)}`
</script>
<script>
    export default {
        name: 'TeamAttribute'
    }
</script>