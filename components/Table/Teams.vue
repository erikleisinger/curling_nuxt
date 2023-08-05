<template>
    <NuxtLayout>
        <div
            class="col-grow bg-white team-table__item"
            ref="tableArea"
            v-if="!loading"
        >
            <q-list separator>
                <q-item
                    v-for="item in teams"
                    :key="item.id"
                    :class="{ focused: focused === item.id }"
                    :id="`team-table-item-${item.id}`"
                    @click="unsetFocus(item.id)"
                    clickable
                >
                    <TableTeamItem :item="item" @delete="itemToDelete = item" />

                    <!-- <q-item-section side top class="column q-mt-xs">
                    <q-badge
                        color="positive"
                        label="My team"
                        v-if="item.isMine"
                        rounded
                    ></q-badge>
                    <q-badge
                        outline
                        rounded
                        color="grey"
                        label="+ My team"
                        v-else
                    ></q-badge>
                </q-item-section> -->
                    <!-- <q-item-section side @click.stop.prevent>
                   
                </q-item-section> -->
                </q-item>
            </q-list>
            <!-- </q-list> -->
        </div>
        <GlobalLoading infinite v-else />
        <DialogConfirmation
            v-if="itemToDelete"
            @close="itemToDelete = null"
            @confirm="deleteTeam(itemToDelete)"
        >
            Are you sure you want to delete team "{{
                itemToDelete.name ?? "Unnamed team"
            }}"
        </DialogConfirmation>
    </NuxtLayout>
</template>
<style lang="scss">
.focused {
    background-color: rgb(0 132 255 / 11%);
}
.team-table__item {
    height: calc(100 * var(--vh, 1vh) - 50px);
    overflow: auto;
    .q-scrollarea__container {
        height: inherit;
        min-height: inherit;
    }
}
</style>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTeamStore } from "@/store/teams";
import { useScroll, useSwipe, useThrottleFn } from "@vueuse/core";
import { TABLE_NAMES } from "@/constants/tables";
import { useUserStore } from "@/store/user";
import { useFriendStore } from "@/store/friends";
import { useNavigationStore } from "@/store/navigation";
import { parseAvatar } from "@/utils/avatar";
import type Team from "@/types/team";
import type Player from "@/types/player";
const teamStore = useTeamStore();

const teams = computed(() =>
    [...teamStore.teams].map((t) => {
        if (userStore.userTeams.includes(t.id)) return { ...t, isMine: true };
        return t;
    })
);
const loading = ref(false);

const loadTeams = async (force: boolean = false) => {
    loading.value = true;
    await teamStore.fetchTeams(force);
    loading.value = false;
};

const tableArea = ref(null);
const { direction } = useSwipe(tableArea, {
    threshold: 200,
    onSwipeEnd: (e) => {
        if (direction.value !== "down") return;
        loadTeams(true);
    },
});

const itemToDelete = ref(null);
const deleteTeam = async (team: Team) => {
    const { id = null } = team;
    await teamStore.deleteTeam(id);
    itemToDelete.value = null;
};

const userStore = useUserStore();

const userId = computed(() => userStore.id);

const goToStats = (id) => {
    navigateTo(`/stats/team/${id}`);
};

const onRight = ({ reset }) => {
    setTimeout(() => {
        reset();
    }, 6000);
};

/**
 * Automatic scroll & focus on team, if focusTeam is set in navigation store
 */

const navigationStore = useNavigationStore();
const focused = computed(() => navigationStore.focusTeam);

const { y: scrollY } = useScroll(tableArea, {
    behavior: "smooth",
});

const focusOnTeam = () => {
 if (!focused.value) return;
    const teamId = focused.value;
    setTimeout(() => {
        const elementId = `team-table-item-${teamId}`;
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(
                "could not scroll to focused team: team element not found"
            );
            return;
        }
        const scrollTo = element?.offsetTop;
        tableArea.value.scrollTop = scrollTo;
    }, 1000);
}
onMounted(() => {
   focusOnTeam();
});

watch(focused, () => {
    focusOnTeam();
})

const unsetFocus = (teamId: number) => {
    if (!focused.value || teamId !== focused.value) return;
    navigationStore.setTeamFocus(null);
};
</script>
