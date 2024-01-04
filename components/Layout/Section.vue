<template>
  <section>
    <header class="section__header">
        <div class="rings-icon__wrap">
            <Rings :size="$q.screen.xs ? '25px' : '32px'"/>
        </div>
        <div class="section-header__text" v-html="titleHtml">
        
        </div>
    </header>
    <main class="section__main">
        <slot/>
    </main>
  

    </section>
</template>
<style lang="scss" scoped>
    .section__header {
        text-align: center;
        min-height: 65px;
        background-color: rgba(49, 54, 56, 0.06);
        width: 100%;
        position: relative;
        @include sm {
            min-height: 80px;
        }

        .section-header__text {
            margin: auto;
            width: fit-content;
            font-family: $font-family-header;
            padding: 12px 0px;
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
        padding: var(--space-lg) var(--space-sm) ;
        z-index: 1;
        &:before {
            content: '';
            height: 100%;
            width: 1px;
            background-color: rgba(0,0,0,0.08);
            margin: auto;
            position: absolute;
            left: 0;
            right: 0;
            z-index: -1;
            top:0;
        }
    }
</style>
<script setup>
    const props = defineProps({
        title: String,
    })

    const $q = useQuasar();

    const titleHtml = computed(() => {
        const words = props?.title?.split(' ');
        const smallSize = $q.screen.xs ? '14px' : '24px';
        const largeSize = $q.screen.xs ? '32px' : '48px'
        if (words.length > 1) {
            return `
                <div style="font-size: ${smallSize}; line-height: ${smallSize}">${words[0]}</div>
                <div style="font-size: ${largeSize}; line-height: ${largeSize}">${words[1]}</div>
            `
        } 
       return `<div style="font-size: ${largeSize}; line-height: ${largeSize}">${words[0]}</div>`
    })
</script>