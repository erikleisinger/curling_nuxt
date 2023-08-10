<template>
    <q-item-section
        :style="{ transform: deleteOpen ? 'translateX(-3em)' : '' }"
        ref="teamItem"
        style="transition: transform 0.3s; display: block"
    >
        <div class="row no-wrap">
            <div class="row table-team__section full-width">
                <div class="q-mt-xs team-player__container">
                    <Avataaar
                        v-bind="parseAvatar(props.item.team_avatar)"
                        :class="{ animated__avatar: animated }"
                        @click="onClick"
                    />

                    <div
                        class="truncate-text q-pl-xs q-ml-xs column justify-center text-lg text-bold"
                    >
                        <!--  -->
                        <q-item-label overline><span>Team</span> </q-item-label>
                        <InputName
                            :name="props.item.name"
                            v-if="props.item.name"
                            @save="saveName"
                            :disabled="!canEdit || !editable"
                        />

                        <q-item-label caption class="row" v-if="item.profile_id && item.profile_id !== userId && item.username">
                          <ProfileChip  :id="item.profile_id" :username="item.username"/>
                             
                      
                        </q-item-label>
                    </div>
                    <div
                        class="row justify-end items-center"
                        v-if="slots.actions"
                    >
                        <slot name="actions" v-bind:viewTeam="viewTeam" />
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
    padding: var(--space-sm);
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
.animated__avatar {
    animation: float 0.7s infinite linear;
    animation-direction: alternate;
    animation-iteration-count: infinite;

    &:hover {
        animation: scale 0.3s forwards linear;
    }
}

@keyframes float {
    0% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(0.15em);
    }
}

@keyframes scale {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}
</style>
<script setup lang="ts">
import { useSwipe } from "@vueuse/core";
import { useTeamStore } from "@/store/teams";
import { useEditorStore } from "@/store/editor";
import { parseAvatar } from "@/utils/avatar";
import Team from "@/types/team";

const slots = useSlots();

const onClick = () => {
    if (!props.viewable) return;
    viewTeam();
};

const { user: userId } = useUser();

const props = defineProps({
    animated: Boolean,
    deleteable: Boolean,
    editable: Boolean,
    viewable: Boolean,
    canEdit: Boolean,
    item: Object,
});

const canEdit = props.item.profile_id === userId.value;

const columns = ref(props.viewable || slots.actions ? "25% 1fr" : "25% 1fr");

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
    editorStore.toggleTeamViewer({ open: true, team: props.item });
};

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
