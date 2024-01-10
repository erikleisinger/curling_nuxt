<template>
    <LinescorePageContainer :disabled="!selections?.name" @next="emit('select')">
        <template v-slot:title>
            <slot v-bind:toggleCustom="toggleCustom" />
        </template>
        <template v-slot:subtitle>
            <div v-if="homeTeam" class="text-center">
                <span v-if="homeTeams?.length > 1"
                    >Use the arrows to select a team, or press the avatar to
                    search.</span
                >
                <span v-else>
                    Since you only have one team, we'll use
                    <strong>{{ homeTeams[0].name }}</strong>
                </span>
            </div>
            <div v-else-if="!customOpposition && !homeTeam" class="text-center">
                Press the avatar below to search for a team.
            </div>
            <div
                v-if="!homeTeam && !customOpposition"
                @click="toggleCustom"
                class="text-underline"
                style="cursor: pointer"
            >
                Can't find the team you're looking for?
            </div>
            <div v-else-if="!homeTeam" class="text-center text-sm">
                Chances are the team hasn't joined Pebble yet.
                <strong
                    >For now, type their name in the text field below.</strong
                >
                Later on, you can invite them to add this game to their records.
            </div>
        </template>
        <template v-slot:content>
            <div class="row justify-around items-center no-wrap">
                <q-btn
                    flat
                    round
                    icon="arrow_back"
                    size="xl"
                    v-if="homeTeam"
                    @click="selectTeam(-1)"
                    :style="{
                        visibility:
                            currentHomeTeam === 0 ? 'hidden' : 'visible',
                    }"
                />
                <div class="full-width column items-center no-wrap">
                    <div class="team-avatar__container" @click="toggleSelect">
                        <TeamAvatar
                            :teamId="selections.id"
                            :viewable="false"
                            v-if="showAvatar"
                        />
                    </div>
                    <div class="text-center text-bold team-name" v-if="!customOpposition">
                        {{ selections.name }}
                    </div>
                    <q-input
                        v-else
                        label="Type an opposition name"
                        class="custom-name__input q-px-lg"
                        v-model="selections.name"
                        autofocus
                    >
                        <template v-slot:append>
                            <q-btn
                                flat
                                round
                                icon="close"
                                @click="
                                    () => {
                                        customOpposition = false;
                                        selections = {};
                                    }
                                "
                            />
                        </template>
                    </q-input>
                </div>
                <q-btn
                    flat
                    round
                    icon="arrow_forward"
                    size="xl"
                    v-if="homeTeam"
                    @click="selectTeam(+1)"
                    :style="{
                        visibility:
                            currentHomeTeam >= homeTeams.length - 1
                                ? 'hidden'
                                : 'visible',
                    }"
                />
            </div>
        </template>
    </LinescorePageContainer>
</template>
<style lang="scss" scoped>
    .team-avatar__container {
        width: 10rem;
        max-width: 200px;
        @include sm {
            max-width: 300px;
        }
    }
    .custom-name__input {
        width: 100vw;
        max-width: 500px;
    }
    .team-name {
        @include md-text;
        font-family: $font-family-header;
        margin-top: var(--space-xs);
    }

</style>
<script setup>
import { useDialogStore } from "@/store/dialog";
import { useUserTeamStore } from "@/store/user-teams";
import Team from "@/store/models/team";

const { toggleLineScore, toggleGlobalSearch } = useDialogStore();

const props = defineProps({
    modelValue: Object,
    allowCustom: Boolean,
    restrictIds: Array,
    filterIds: Array,
    homeTeam: Boolean,
});

const selections = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

const { user: userId } = useUser();

const emit = defineEmits(["select", "update:modelValue"]);

const customOpposition = ref(false);

const toggleSelect = () => {
    if (props.homeTeam) return;
    toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ["team"],
            restrictIds: props.restrictIds,
            filterIds: props.filterIds,
            callback: (selection) => {
                customOpposition.value = false;
                selections.value = selection;
            },
            inputLabel: "Select your team",
        },
    });
};

const homeTeams = computed(() =>
    useRepo(Team)
        .where("id", (id) =>
            useUserTeamStore().userTeams.some(({ id: teamId }) => teamId === id)
        )
        .get()
);
const currentHomeTeam = computed(() =>
    homeTeams.value.findIndex(({ id }) => id === selections.value.id)
);

const selectTeam = (inc) => {
    if (inc < 0 && currentHomeTeam.value === 0) return;
    if (inc > 0 && currentHomeTeam.value >= homeTeams.value.length - 1) return;
    selections.value = homeTeams.value[currentHomeTeam.value + inc];
};

const showAvatar = ref(true);

watch(
    () => selections.value,
    () => {
        showAvatar.value = false;
        nextTick(() => {
            showAvatar.value = true;
        });
    },
    { immediate: true }
);

onMounted(() => {
    if (props.homeTeam && !selections.value?.id) {
        selections.value = homeTeams.value[0];
    }
});

const customOppositionName = ref(null);

const toggleCustom = () => {
    if (customOpposition.value) return;
    selections.value = {};
    customOpposition.value = true;
};

const setCustomOpposition = () => {
    const { name } = { ...selections.value };
    selections.value = { name };
    customOpposition.value = false;
};
</script>
