<template>

    <main class="column select__section full-width">
            <TeamList :teams="teams"/>
    </main>
</template>
<style lang="scss" scoped>
.select__section {
    height: calc((var(--vh) * 100) - 50px);
    overflow: auto;
}
</style>
<script setup>
const tab = ref("my teams");
import { useTeamStore } from "@/store/teams";
const store = useTeamStore();

const teams = computed(() => store.teams);
</script>
