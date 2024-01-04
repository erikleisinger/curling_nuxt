<template>
<div class="season__container">
    <main>
    <LayoutSection title="Season Overview">
       <SeasonOverview/>
    </LayoutSection>
    <LayoutSection title="The Latest">
     <RinkNews v-if="homeRink?.id" :rinkId="homeRink.id" :limit="10"/>
    </LayoutSection>
   
    </main>
    <aside v-if="!$q.screen.xs">

    </aside>
</div>
</template>
<style lang="scss" scoped>
    .season__container {
        @include sm {
display: grid;
        grid-template-columns: 1fr 300px;
        aside {
            margin: var(--space-xs);
            height: 100%;
            background-color: white;
            box-shadow: $pretty-shadow;
            border-radius: 16px;
        }
        }
        
    }
</style>
<script setup>
import {useUserStore} from '@/store/user'
import Rink from '@/store/models/rink'
    const $q = useQuasar();
    const user = computed(() => useUserStore())
    const homeRink = computed(() => useRepo(Rink).where('id', user.value?.rink_id).first())
</script>
