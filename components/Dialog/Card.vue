<template>
    <q-card class="dialog-card__container" >
        <h3 v-if="slots.title">
            <slot name="title"> </slot>
        </h3>
        <p v-if="slots.content">
            <slot name="content"> </slot>
        </p>
        <div v-else style="margin-top: var(--space-sm)"/>
         <div class="row no-wrap justify-between q-px-sm">
        <slot name="footer"> 

        </slot>
         </div>
    </q-card>
</template>
<style lang="scss" scoped>
.dialog-card__container {
    max-width: v-bind(maxWidth);
    border-radius: 16px;
    color: $app-slate;
    overflow: hidden;
    box-shadow: $pretty-shadow;
    padding: unset;
    @include chunky-border(2px);
    h3 {
        @include smmd-text;
        padding: var(--space-sm) var(--space-xs);
        background-color: v-bind(titleColor);
        color: white;
    }
    p {
        padding: var(--space-xs);
        margin: unset;
    }

}
</style>
<script setup>
    const slots = useSlots()
    const props = defineProps({
        maxWidth: {
            type: String,
            default: '300px'
        },
        titleColor: {
            type: String,
            default: '#283044'
        },
    })
</script>
