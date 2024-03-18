<template>
    <div class="rink__container" ref="rinkContainer" :style="{ background }">
        <div class="underlay" />
        <div class="overlay">
            <div class="row no-wrap flags__container justify-center"></div>

            <div class="row no-wrap items-center full-height">
                <div class="q-mr-md">
                    <FlagChip :name="'CA'" size="40px" />
                </div>
                <div>
                    <h2>{{ rink?.name ?? "Unspecified rink" }}</h2>
                    <div class="text-caption" style="line-height: 1">
                        {{ rink?.city ?? "North" }},
                        {{ rink?.province ?? "Pole" }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$svg-color: rgba(0, 0, 0, 0.2);
$padding: var(--space-sm);
.rink__container {
    padding: $padding;
    @include chunky-border(6px);
    position: relative;
    border-radius: 24px;
    z-index: 0;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    background-color: $app-slate;
    color: white;
    @include smmd-text;
    min-width: 300px;
    max-width: 450px;

    .underlay {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 0;
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 19px;
        :deep(path) {
            stroke: $svg-color;
            fill: $svg-color;
        }
        overflow: hidden;
    }
    .overlay {
        position: relative;
        z-index: 1;
    }

    .flags__container {
        position: absolute;
        top: calc(-1 * ($padding + 25px));
        left: 0;
        right: 0;
        margin: auto;
    }
}
</style>
<script setup>
import {getRink} from '@/business/api/query/rink'
const props = defineProps({
    rinkId: Number,
});

const {fetch} = useApi();

const {loading, result: rink} = fetch(getRink(props.rinkId))
const glob = import.meta.glob("~/assets/flags/*", {
    eager: true,
});

const backgroundUrl = computed(() => {
    try {
        return glob[`/assets/flags/${rink.value?.province}.svg`]["default"];
    } catch {
        return "";
    }
});
const background = computed(() => `url(${backgroundUrl.value}) center / cover`);
</script>
