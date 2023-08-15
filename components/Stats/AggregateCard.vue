<template>
    <div class="row justify-center items-center total__card col-grow">
        <!-- <q-icon name="hotel_class" size="lg"/> -->
        <div class="total__card--inner text-bold">
            {{ score }}
        </div>
    </div>
</template>
<style lang="scss" scoped>
$width: 20vw;
.total__card {
    border-radius: 25%;
    border: 1px solid $grey-5;
  
    aspect-ratio: 1/1;
    font-size: calc($width / 2);
    width: $width;
    max-width: $width;
    margin-right: var(--space-xxs);
    position: relative;
    box-shadow: $pretty-shadow-2;


    .total__card--inner {
        position: relative;
        color: rgba(0, 0, 0, 0.8);
        // &:after {
        //     position: absolute;
        //     content: "/10";
        //     font-size: 0.3em !important;
        //     bottom: 0.5em;
        //     right: -1em;
        //     margin-left: calc(var(--space-sm) * -1);
        //     font-weight: normal;
        // }
    }
}
</style>
<script setup>
    const props  = defineProps({
        score: Number,
    })
</script>
