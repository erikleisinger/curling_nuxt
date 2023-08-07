<template>
    <main class="column select__section full-width">
        <TableTeams :teams="teams" />
    </main>
</template>
<style lang="scss" scoped>
.select__section {
    height: calc((var(--vh) * 100) - 50px);
    overflow: auto;
}
</style>

<script setup>
import { useUserStore } from "@/store/user";
    import {useTeamStore} from '@/store/teams';
    const teamStore = useTeamStore();

    const userStore = useUserStore();
    const teams = computed(() =>
    [...teamStore.teams].map((t) => {
        if (userStore.userTeams.includes(t.id)) return { ...t, isMine: true };
        return t;
    })
);
</script>
