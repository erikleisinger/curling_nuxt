<template>
<section>
        <header class="section__header" :style="headerStyle">
            <div class="rings-icon__wrap">
                <Rings :size="$q.screen.xs ? '25px' : '32px'" />
            </div>
            <div class="slot__container left">
                <slot name="append-left" />
            </div>
            <div class="section-header__text">
                <slot name="title">
                <div v-for="(titleWord, i) in words" :key="i" class="word">
                    {{ titleWord }}
                </div>
                </slot>
            </div>
            <div class="slot__container right">
                <slot name="append-right" />
            </div>
          
        </header>
        <main class="section__main" :style="mainStyle">
            <slot />
        </main>
</section>
</template>
<style lang="scss" scoped>
.section__header {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    text-align: center;
    min-height: 65px;
    background-color: rgba(49, 54, 56, 0.06);
    width: 100%;
    position: relative;
    @include sm {
        min-height: 80px;
    }
    z-index: 2;

    .section-header__text {
        // margin: auto;
        // width: fit-content;
        font-family: $font-family-header;
        padding: 12px 0px;
        .word {
            @include smmd-text;
            @include line-tight;
            &:only-child {
                @include lg-text;
            }
            &:nth-child(2) {
                @include lg-text;
            }
        }
        // .word-sm {
        //     @include
        // }
    }

    .slot__container {
        // flex-grow: 1;
        display: flex;
        align-items: center;
        padding-left: var(--space-md);
        &.right {
            justify-content: flex-end;
            padding-left: unset;
            padding-right: var(--space-md);
        }
    }

    .rings-icon__wrap {
        position: absolute;
        left: 0;
        right: 0;
        width: fit-content;
        bottom: -20px;
        margin: auto;
        @include sm {
            bottom: -23px;
        }
        height: fit-content;
    }
}
.section__main {
    position: relative;
    padding: var(--space-lg) var(--space-sm);
    z-index: 1;
    &:before {
        content: "";
        height: 100%;
        width: 1px;
        background-color: rgba(0, 0, 0, 0.08);
        margin: auto;
        position: absolute;
        left: 0;
        right: 0;
        z-index: -1;
        top: 0;
    }
}
</style>
<script setup>
const props = defineProps({
    headerStyle: String,
    noPadding: Boolean,
    mainStyle: String,
    title: String,
});

const $q = useQuasar();

const words = props.title?.split(" ");
</script>
