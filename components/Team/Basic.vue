<template>
    <q-item-section
        :style="{ transform: deleteOpen ? 'translateX(-3em)' : '' }"
        ref="teamItem"
        style="transition: transform 0.3s; display: block"
    >
        <div class="row no-wrap">
            <div class="row table-team__section full-width">
                <div class="q-mt-xs team-player__container">
                    <Avataaar v-bind="parseAvatar(props.item.team_avatar)" />
                    <div
                        class="truncate-text col-auto q-pl-xs q-ml-xs column justify-center text-lg text-bold"
                    >
                        <q-item-label overline>Team</q-item-label>
                        <InputName
                            :name="props.item.name"
                            v-if="props.item.name"
                            @save="saveName"
                            :disabled="!canEdit || !editable"
                        >
                            <q-item-label class="truncate-text">
                                <span>
                                    {{ props.item.name }}
                                </span>
                            </q-item-label>
                        </InputName>
                    </div>
                    <div class="row justify-end items-center" v-if="viewable">
                        <q-btn flat color="deep-purple" @click="viewTeam">View</q-btn>
                    </div>
                </div>
            </div>
        </div>
    </q-item-section>
    <transition
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
    >
        <div
            class="delete__section row justify-center items-center"
            v-if="deleteOpen"
            @click="deleteItem"
        >
            <q-icon flat round name="delete" size="md" />
        </div>
    </transition>
</template>
<style lang="scss" scoped>
.team-player__container {
    display: grid;
    grid-template-columns: v-bind(columns);
    width: 100%;
}
.delete__section {
    position: absolute;
    right: 0;
    top: 0;
    width: calc(3em + 16px);
    background-color: $negative;
    height: 100%;
    color: white;
}
</style>
<script setup lang="ts">
import { useSwipe } from "@vueuse/core";
import { useTeamStore } from "@/store/teams";
import { useEditorStore } from "@/store/editor";
import { parseAvatar } from "@/utils/avatar";
import Team from "@/types/team";

const { user: userId } = useUser();

const props = defineProps({
    deleteable: Boolean,
    editable: Boolean,
    viewable: Boolean,
    canEdit: Boolean,
    item: Object,
});

const canEdit = (props.item.profile_id = userId.value);

const columns = ref(props.viewable ? 'max(70px, 15vw) auto auto' : 'max(70px, 15vw) 1fr')

/**
 * Begin item deletion
 *
 */

const deleteOpen = ref(false);
const teamItem = ref(null);
if (canEdit && props.deleteable) {
    const { direction } = useSwipe(teamItem, {
        onSwipe: () => {
            if (direction.value === "right") {
                deleteOpen.value = false;
            } else if (direction.value === "left") {
                deleteOpen.value = true;
            }
        },
    });
}

const emit = defineEmits(["delete"]);

const deleteItem = () => {
    emit("delete");
    deleteOpen.value = false;
};

/**
 * End item deletion
 */


/**
 * Begin view item
 */

const viewTeam = () => {
    const editorStore = useEditorStore();
    editorStore.toggleTeamViewer({open: true, team: props.item})
}

/**
 * End view item
 */


/**
 * Begin change name
 */

const savingName = ref(false);
const saveName = async (name: string) => {
    const teamStore = useTeamStore();
    teamStore.updateTeamName(name, props.item.id);
};

/**
 * End change name
 */
</script>
