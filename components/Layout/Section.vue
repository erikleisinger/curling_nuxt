<template>
  <section>
    <header class="section__header">
        <div class="rings-icon__wrap">
            <Rings :size="$q.screen.xs ? '25px' : '32px'"/>
        </div>
        <div class="section-header__text" >
            <div v-for="titleWord, i in words" :key="i" class="word">
                {{titleWord}}
            </div>
        
        </div>
    </header>
    <main class="section__main" v-bind="$attrs">
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
        noPadding: Boolean,
        title: String,
    })

    const $q = useQuasar();

    const words = props.title?.split(' ')
  
</script>