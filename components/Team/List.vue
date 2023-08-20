<template>
    <div class="col-grow bg-white" style="height: 100%" ref="tableArea">
        <slot />
        <q-virtual-scroll
            :items="teams"
            separator
            v-slot="{ item, index }"
            ref="scroller"
            v-if="teams?.length"
            style="max-height: 100%"
        >
            <div
                :id="`team-table-item-${item.id}`"
                @click="onClick(item, index)"
                :class="{ focused: focused === item.id }"
                class="team-item"
            >
                <ProfileCard
                    :avatar="item.team_avatar"
                    v-memo="[item.name, item.team_avatar]"
                >
                    <template v-slot:overline> Team </template>
                    {{ item.name }}
                </ProfileCard>
            </div>
        </q-virtual-scroll>
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
<style lang="scss" scoped>
.team-item {
    border-bottom: 1px solid $grey-3;
}
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

const props = defineProps({
    teams: {
        tyoe: Array as Team[],
        default: [],
        required: false,
    },
});

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

const scroller = ref(null);

const scrollTo = async (index: number) => {
    await new Promise((r) => setTimeout(r, 3));
    scroller.value.scrollToItem(index);
};

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
        const scrollPos = element?.offsetTop;
        tableArea.value.scrollTop = scrollPos;
    }, 1000);
};
onMounted(() => {
    focusOnTeam();
});

watch(focused, () => {
    focusOnTeam();
});

const expanded = ref(null);

const onClick = (team: Team, index: number) => {
    const teamId = team?.id;
    emit("select", index, teamId, team);
    if (focused.value && teamId === focused.value) unsetFocus(teamId);
    if (expanded.value === teamId) {
        expanded.value = null;
    } else if (teamId) {
        expanded.value = teamId;
        // scrollTo(index);
    }
};

const unsetFocus = (teamId: number) => {
    if (!focused.value || teamId !== focused.value) return;
    navigationStore.setTeamFocus(null);
};

const emit = defineEmits(["update", "select"]);
</script>
