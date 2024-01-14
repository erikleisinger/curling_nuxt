<template>
    <LayoutCircleTitle
        :title="team.name"
        :backgroundImage="editedAvatar?.url"
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
                        @click="editing = true"
                    />
                </div>
            </div>
        </template>
        <template v-slot:title>
            <TeamPageName :name="editedName ?? 'team Name'"  ref="teamName" />
        </template>
    </LayoutCircleTitle>

    <div class="rink__container" ref="rinkContainer">
        <div class="row justify-center">
            <q-icon
                name="location_on"
                color="red"
                size="1.7em"
                class="q-mr-md"
            />
            <div>
                <h2>{{ editedRink?.name ?? 'Rink name' }}</h2>
                <div class="text-caption">
                    {{ editedRink?.city ?? 'City' }}, {{ editedRink?.province ?? 'Province' }}
                </div>
            </div>
        </div>
    </div>
    <TeamEditOverlay
        v-if="editing"
        @close="editing = false"
        :name="editedName"
        :avatar="editedAvatar"
        :rink="editedRink"
        @update:avatar="editedAvatar = $event"
        @update:name="editedName = $event"
        @update:rink="editedRink = $event"
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
.rink__container {
    padding: var(--space-sm);
    @include chunky-border(6px);
    position: relative;
    border-radius: 24px;
    margin: var(--space-md);
    z-index: 0;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    background-color: $app-slate;
    color: white;
    @include smmd-text;
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
const editing = ref(false);
const editedName = ref(null);
const editedRink = ref(null);
const editedAvatar = ref({});

watch(team, (val) => {
    const {name, rink} = val;
    editedName.value = name;
    editedRink.value = rink;
}, {deep: true, immediate: true})

const { getTeamAvatar } = useAvatar();

const { data: avatar } = getTeamAvatar(props.teamId, {
    enabled: !!team.value,
    select: (val) => {
        emit("loaded");
        editedAvatar.value = {
            path: null,
            url: val,
            file: null,
        };
        return val;
    },
});


const { isOnTeam } = useTeam();

onMounted(() => {
    if (props.create) editing.value = true;
})
</script>
