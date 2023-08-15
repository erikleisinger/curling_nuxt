<template>
    <div class="row justify-center items-center total__card ">
        <!-- <q-icon name="hotel_class" size="lg"/> -->
        <div class="total__card--inner text-bold">
            {{ score }}
        </div>
    </div>
</template>
<style lang="scss" scoped>
$width: min(20vw, 100px);
.total__card {
    border-radius: 25%;
    border: 1px solid $grey-5;
  
    aspect-ratio: 1/1;
    // font-size: calc($width / 2);
    height: 100%;
    // width: $width;
    // max-width: $width;
    margin-right: var(--space-xxs);
    position: relative;
    box-shadow: $pretty-shadow-2;


    .total__card--inner {
        position: relative;
        color: rgba(0, 0, 0, 0.8);
    }
}
</style>
<script setup>
    const props  = defineProps({
        score: Number,
    })
</script>
