<template>
    <div class="col-grow bg-white" style="height: 100%" ref="tableArea">
        <q-list separator>
            <q-item
                v-for="item in teams"
                :key="item.id"
                :class="{ focused: focused === item.id }"
                :id="`team-table-item-${item.id}`"
                @click="unsetFocus(item.id)"
                clickable
                v-memo="[
                    item.name,
                    item.team_avatar
                ]"
            >
                <TeamBasic :item="item" @delete="itemToDelete = item" viewable deleteable />
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
</template>
<style lang="scss">
.focused {
    background-color: rgb(0 132 255 / 11%);
}
</style>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useScroll } from "@vueuse/core";
import { useNavigationStore } from "@/store/navigation";
import { useTeamStore } from "@/store/teams";
import type Team from "@/types/team";

const props = defineProps<{
    teams: Team[];
}>();

const tableArea = ref(null);

const itemToDelete = ref(null);
const deleteTeam = async (team: Team) => {
    const teamStore = useTeamStore();
    const { id = null } = team;
    await teamStore.deleteTeam(id);
    itemToDelete.value = null;
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
