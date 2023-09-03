<template>
    <div class="attribute__container" :class="{ highlight }">
        <div class="row no-wrap">
            <q-icon size="1em" :name="icon" :color="color" />
            <h3 class="text-xs">{{title}}</h3>
        </div>
        <div class="text-md text-bold value">
            <slot/>
        </div>

        <slot name="tooltip"/>
    </div>
</template>
<style lang="scss" scoped>
.attribute__container {
    padding: var(--space-xs);
    border: 1px solid $grey-4;
    border-radius: 4px;
    margin: var(--space-xs);
    .q-icon {
        margin-right: var(--space-xxs);
    }
    .value {
        margin-left: 1.2em;
    }
    &.highlight {
        border: 2px solid $blue;
    }
}
</style>

<script setup>
const props = defineProps({
    color: String,
    highlight: Boolean,
    icon: String,
    title: String,
});
</script>
