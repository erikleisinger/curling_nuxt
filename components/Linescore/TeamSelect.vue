<template>
    <div class="linescore-confirmation__wrap">
        <div class="row items-end justify-center q-px-md q-mb-sm">
            <div class="column items-center">
                <h2
                    class="text-md text-bold title q-px-md  q-pb-none text-center" style="white-space: nowrap"
                >
                    <slot v-bind:toggleCustom="toggleCustom" />
                </h2>
                <div v-if="homeTeam" class="text-center">
                    <span v-if="homeTeams?.length > 1">Use the arrows to select a team, or press the avatar to
                    search.</span>
                    <span v-else>
                        Since you only have one team, we'll use <strong>{{homeTeams[0].name}}</strong>
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
                <div v-else-if="!homeTeam" class="text-center text-sm">Chances are the team hasn't joined Pebble yet. <strong>For now, type their name in the text field below.</strong> Later on, you can invite them to add this game to their records.</div>
            </div>
        </div>

        <div class="row justify-around items-center no-wrap">
            <q-btn
                flat
                round
                icon="arrow_back"
                size="xl"
                v-if="homeTeam"
                @click="selectTeam(-1)"
                :style="{
                    visibility: currentHomeTeam === 0 ? 'hidden' : 'visible',
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
                <div class="text-center" v-if="!customOpposition">
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
        <q-btn flat round icon="close"  @click="() => {
                        customOpposition = false;
                        selections = {}
                    }"/>
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
        <div class="row justify-center items-start">
            <q-btn
                icon="check_circle"
                :color="selections?.name ? 'green' : ''"
                size="50px"
                flat
                round
                dense
                @click="emit('select')"
                :disable="!selections?.name"
            />
        </div>
        <!-- <div class="linescore-confirmation__container">
            <div class="team__card row items-center justify-center">
                <div class="column items-center  full-width">
               
                        <div style="width: 50%" class="q-mb-md" @click="toggleSelect">
               
                            <TeamAvatar
                                :teamId="
                                    selections?.id
                                "
                                :viewable="false"
                              
                            />
                        </div>
                         <div
                       v-if="!selections?.name && !customOpposition"
                        style="white-space: nowrap; height: 40px"
                        key="select"
                        @click="toggleSelect"
                    >
                        Click to select a team
                    </div>
                          <div
                        v-else-if="allowCustom && customOpposition"
                        class="row justify-center"
                        key="custom"
                    >
                        <div >
                            <q-input
                                dense
                                rounded
                                outlined
                                label="Type team name"
                                autofocus
                                v-model="selections.name"
                                maxlength="15"
                             
                                @keydown.enter="setCustomOpposition"
                            >
                            <template v-slot:append>
                                <q-btn dense flat round icon="check" color="green" @click="setCustomOpposition"/>
                            </template> 
                            </q-input>
                  
                        </div>
                    </div>
                   
                    <div v-else-if="selections" key="awayname">
                        {{ selections.name ?? "Unnamed team" }}
                    </div>
                   
                     <div
                     v-if="allowCustom"
                    class="no-opposition__floating text-sm"
                    @click="customOpposition = true"
                >
                    {{
                        customOpposition
                            ? "Type their name and they can add themselves later"
                            : "Can't find a team?"
                    }}
                </div>
                </div>
            </div>
        </div> -->
    </div>
</template>
<style lang="scss" scoped>
.linescore-confirmation__wrap {
    width: 100%;
    height: 100%;
    display: grid;
    padding-top: 60px;
    grid-template-rows: 100px auto 25%;
    .team-avatar__container {
        width: 50vh;
        max-width: 200px;
        @include sm {
            max-width: 300px;
        }
    }
    .linescore-confirmation__container {
        display: grid;
        grid-template-rows: auto 50px auto;
        height: 100%;
        box-sizing: border-box;
        width: 100%;
        max-height: 600px;
        max-width: 500px;
        margin: auto;
        padding: var(--space-sm);
        .versus-container {
            font-style: italic;
            background-color: rgba(37, 39, 73, 0.5);
            color: white;
            text-decoration: underline;
            margin: calc(-1 * var(--space-xs)) 0px;
        }
        .team__card {
            position: relative;
            .no-opposition__floating {
                width: 100%;
                text-align: center;
                position: absolute;
                bottom: var(--space-xs);
                color: $deep-purple;
                text-decoration: underline;
                font-weight: bold;
            }
            .team__header {
                font-size: var(--text-md);
                padding: var(--space-sm);
                text-align: right;
                .custom-opposition__helper {
                    font-size: var(--text-sm);
                }
            }
            .team-result__container {
                display: flex;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                margin-bottom: var(--space-xs);
                .team-name {
                    font-size: var(--text-md);
                    font-weight: bold;
                    padding: var(--space-md);
                }

                .team__container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .color-hammer-select__container {
                    display: flex;
                    width: 100%;
                    justify-content: center;
                    align-items: center;

                    .color-hammer-inner {
                        width: 50px;
                        :deep(.q-icon) {
                            font-size: 50px;
                        }
                    }
                    .hammer-icon {
                        transition: all 0.2s linear;
                        font-size: 5em;
                        &.selected {
                            transform: rotate(35deg) scale(1.2);
                        }
                    }
                }
            }
        }
    }
    .custom-name__input {
        width: 100vw;
        max-width: 500px;
    }
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
