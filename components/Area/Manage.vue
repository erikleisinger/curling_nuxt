<template>
<header>
    <nav>
         <q-tabs  v-model="tab" stretch>
                    <q-tab name="my teams" label="My teams" style="width: 50%" />
                    <q-tab name="explore" label="Explore" style="width: 50%" />

                </q-tabs>
    </nav>
</header>
    <main class="column select__section full-width">
        <KeepAlive>
        <TeamList  :teams="teams" v-if="tab === 'my teams'"/>
        <TeamSearch v-else/>
        </KeepAlive>
    </main>
</template>
<style lang="scss" scoped>
.select__section {
    height: calc((var(--vh) * 100) - 98px);
    overflow: auto;
}
</style>
<script setup>

const tab = ref('my teams')
     import {useTeamStore} from '@/store/teams';
     const store = useTeamStore();

     const teams = computed(() => store.teams)
</script>


