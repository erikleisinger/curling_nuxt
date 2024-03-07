<template>
    <LayoutCircleTitle
        :title="team.name"
        :backgroundImage="displayAvatar"
        ref="header"
    >
        <template v-slot:prepend>
            <div class="full-width header__prepend row justify-center no-wrap">
                <h2>Team</h2>
                <div class="edit--floating" v-if="isOnTeam(team.id)">
                    <q-btn
                        icon="edit"
                        color="white"
                        flat
                        round
                        @click="toggleEditing(true)"
                    />
                </div>
            </div>
        </template>
        <template v-slot:title>
            <TeamPageName :name="teamName"  ref="teamName" />
        </template>
    </LayoutCircleTitle>
<div class="full-width row justify-center" v-if="$q.screen.xs">
    <RinkCard :rink="editing ? editedTeam?.rink : team?.rink"  class="rink__card"/>
</div>
    <TeamEditOverlay
        v-if="editing"
        @close="toggleEditing(false)"
        :name="editedTeam.name"
        :avatar="editedTeam.avatar"
        :rink="editedTeam.rink"
        :teamId="teamId"
    />
</template>
<style lang="scss" scoped>
.edit--floating {
    position: absolute;
    top: 0;
    right: 0;
    @include sm {
        right: var(--space-md);
    }
}
.header__prepend {
    font-family: $font-family-header;
    @include smmd-text;
    text-align: center;
    color: white;
    line-height: 40px;
    @include sm {
        line-height: 50px;
    }
}
.rink__card {
    margin: var(--space-md) var(--space-xs);
}

</style>

<script setup lang="ts">
import Team from "@/store/models/team";
import { useElementBounding } from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";
import { useTeamStore } from "@/store/teams";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
const queryClient = useQueryClient();
const props = defineProps<{
    create: boolean;
    teamId: number | string;
}>();

const emit = defineEmits(["loaded"]);

const $q = useQuasar();

const { truncateWords } = useText();
const { getColor } = useColor();

const team = computed(() => {
    const t = useRepo(Team)
        .with("players")
        .with("rink")
        .where("id", props.teamId)
        .first();
    if (!t) {
        return {
            name: null,
            rink: {},
        };
    }
    return {
        ...t,
        players: t.players?.filter(({ pivot }) => !pivot.status) ?? [],
    };
});

const {editedTeam, toggleEditing, editing} = useEditTeam();

const { $api } = useNuxtApp();

const { data: avatar } = $api.getTeamAvatar(props.teamId);


const displayAvatar = computed(() => {
    if (editing.value) {
        return editedTeam.value.avatar.url
    } else {
        return avatar.value
    }
})

const { isOnTeam } = useTeam();

onMounted(() => {
    if (props.create) toggleEditing(true);
})

const teamName = computed(() => {
    let name;
    if (editing.value) {
        name = editedTeam.value.name
    } else {
        name = team.value.name
    }
    return name ?? 'team Name'
})
</script>
