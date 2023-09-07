<template>
    <div class="attribute__container" :class="{ highlight: expanded }" @click="expand" :style="styleObj">
        <div class="row no-wrap items-center">
            <q-icon size="1em" :name="icon" :color="color" />
            <h3 class="text-xs truncate-text">{{title}}</h3>
            <slot name="appendAction"/>
         
        </div>
        <div class="text-md text-bold value">
            <slot/>
            <span v-if="expanded">
            <slot name="contentExpanded"/>
            </span>
        </div>
      

        <slot name="tooltip"/>
    </div>
</template>
<style lang="scss" scoped>
.attribute__container {
    padding: var(--space-xs);
    border: 1px solid $grey-4;
    border-radius: 4px;
    margin-bottom: var(--space-sm);
    height: fit-content;
    transition: width 0.2s;
    
    .q-icon {
        margin-right: var(--space-xxs);
    }
    .value {
        margin-left: 1.2em;
    }
    &.highlight {
        border: v-bind(highlightBorder)
    }
    &:nth-child(even) {
        margin-left: var(--space-xs);
    }
    &:nth-child(odd) {
        margin-right: var(--space-xs);
    }
}
</style>

<script setup>
const props = defineProps({
    color: String,
    expandable:Boolean,
    icon: String,
    title: String,
});

const expanded = ref(false)

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