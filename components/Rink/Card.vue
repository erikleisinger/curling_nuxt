<template>
      <div class="rink__container" ref="rinkContainer">
        <div class="row justify-center no-wrap">
            <q-icon
                name="location_on"
                color="red"
                size="1.7em"
                class="q-mr-md"
            />
            <div>
                <h2>{{ rink?.name ?? 'Rink name' }}</h2>
                <div class="text-caption">
                    {{ rink?.city ?? 'City' }}, {{ rink?.province ?? 'Province' }}
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .rink__container {
    padding: var(--space-sm);
    @include chunky-border(6px);
    position: relative;
    border-radius: 24px;
    margin: var(--space-md);
    z-index: 0;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    background-color: $app-slate;
    color: white;
    @include smmd-text;
}
</style>
<script setup>
    const props = defineProps({
        rink: Object
    })
</script>