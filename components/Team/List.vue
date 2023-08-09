<template>
    <div class="col-grow bg-white" style="height: 100%" ref="tableArea">
        <RecycleScroller
            :items="teams"
            :item-size="1"
            :min-item-size="50"
            height="100%"
            :buffer="200"
            key-field="id"
            v-slot="{ item, index }"
            ref="scroller"
        >
            <div
                :id="`team-table-item-${item.id}`"
                @click="onClick(item.id, index)"
                :class="{ focused: focused === item.id }"
                class="team-item"
                v-ripple.early
            >
                <TeamBasic
                    :item="item"
                    @delete="itemToDelete = item"
                    viewable
                    deleteable
                    v-memo="[item.name, item.team_avatar]"
                
                 
                />
                   <!--     v-if="expanded !== item.id" -->
                <!-- <div v-else style="height: calc(100% - 200px)">
                    <TeamFull :team="item" /> -->
                <!-- </div> -->
            </div>
        </RecycleScroller>
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

const scroller = ref(null)

const scrollTo = async (index: number) => {
    console.log(index)
    console.log(scroller.value.scrollToItem())
    await new Promise((r) => setTimeout(r, 3))
    scroller.value.scrollToItem(index);
   
};

const focusOnTeam = () => {
    if (!focused.value) return;
    const teamId = focused.value;
    setTimeout(() => {
         const elementId = `team-table-item-${teamId}`;
    const element = document.getElementById(elementId);
    console.dir(element);
    if (!element) {
        console.error(
            "could not scroll to focused team: team element not found"
        );
        return;
    }
    const scrollPos = element?.offsetTop;
    console.log(scrollPos);
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

const onClick = (teamId: number, index: number) => {
    emit('select', index)
    if (focused.value && teamId === focused.value) unsetFocus(teamId);
    if (expanded.value === teamId) {
        expanded.value = null;
    } else {
        expanded.value = teamId;
 scrollTo(index);
       
    }
};

const unsetFocus = (teamId: number) => {
    if (!focused.value || teamId !== focused.value) return;
    navigationStore.setTeamFocus(null);
};

const emit = defineEmits(["update", 'select']);
</script>
