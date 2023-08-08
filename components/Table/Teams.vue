<template>
    <!-- <NuxtLayout> -->
    <div class="col-grow bg-white" style="height: 100%" ref="tableArea">
        <q-list separator v-if="teams.length">
            <q-item
                v-for="item in teams"
                :key="item.id"
                :class="{ focused: focused === item.id }"
                :id="`team-table-item-${item.id}`"
                @click="unsetFocus(item.id)"
                clickable
                v-memo="[
                    item.name,
                    item.lead_player_id?.id,
                    item.second_player_id?.id,
                    item.third_player_id?.id,
                    item.fourth_player_id?.id,
                    item.fifth_player_id?.id,
                    item.sixth_player_id?.id,
                    item.seventh_player_id?.id,
                ]" 
            >
       
             <!--
                -->
                <TeamBasic
                    :item="useStoreTeam(item.id)"
                    @delete="itemToDelete = item"
                    @update="emit('update', $event)"
                />
            </q-item>
        </q-list>
    </div>
    <DialogConfirmation
        v-if="itemToDelete"
        @close="itemToDelete = null"
        @confirm="deleteTeam(itemToDelete)"
    >
        Are you sure you want to delete team "{{
            itemToDelete.name ?? "Unnamed team"
        }}"
    </DialogConfirmation>
    <!-- </NuxtLayout> -->
</template>
<style lang="scss">
.focused {
    background-color: rgb(0 132 255 / 11%);
}
.team-table__container {
    height: calc(100 * var(--vh, 1vh) - 50px);
    // overflow: auto;
    border-top: 1px solid $grey-4;
    .q-scrollarea__container {
        height: inherit;
        min-height: inherit;
    }
}
:deep(.page__select) {
    width: 100%;
    max-width: 50vw;
    border: 1px solid $deep-purple;
}
</style>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTeamStore } from "@/store/teams";
import {toValue,  useScroll, useSwipe, useThrottleFn } from "@vueuse/core";
import { TABLE_NAMES } from "@/constants/tables";
import { useUserStore } from "@/store/user";
import { useFriendStore } from "@/store/friends";
import { useNavigationStore } from "@/store/navigation";
import { parseAvatar } from "@/utils/avatar";
import type Team from "@/types/team";
import type Player from "@/types/player";
const tab = ref("My games");
const teamStore = useTeamStore();

const props = defineProps<{
    filter?: String,
}>();

// const loadTeams = async (force: boolean = false) => {
//     loading.value = true;
//     await teamStore.fetchTeams(force);
//     loading.value = false;
// };

const tableArea = ref(null);
// const { direction } = useSwipe(tableArea, {
//     threshold: 200,
//     onSwipeEnd: (e) => {
//         if (direction.value !== "down") return;
//         loadTeams(true);
//     },
// });
    let teams = ref([])
    let useStoreTeam;
    onMounted(async() => {
        const {useTempTeamStore} = useTeam();
        const {teams: storeTeams, useStoreTeam:us} = await useTempTeamStore({useStore: true, filter: null, realtime: true})
        useStoreTeam = us;
        
        teams.value = toValue(storeTeams);

    })

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
};
onMounted(() => {
    focusOnTeam();
});

watch(focused, () => {
    focusOnTeam();
});

const unsetFocus = (teamId: number) => {
    if (!focused.value || teamId !== focused.value) return;
    navigationStore.setTeamFocus(null);
};

const emit = defineEmits(["update"]);

</script>
