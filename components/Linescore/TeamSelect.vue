<template>
    <h2 class="text-md text-bold title q-px-md q-pt-md q-pb-none text-center">
        <slot/>
    </h2>
    <h3 class="text-sm  title  text-center">
        <slot name="subtitle"/>
    </h3>
    <div class="linescore-confirmation__wrap">
        <div class="linescore-confirmation__container">
            <div class="team__card row items-center justify-center">
                <div class="column items-center  full-width">
               
                        <div style="width: 50%" class="q-mb-md" @click="toggleSelect">
                            <!-- v-bind="parseAvatar(teamSelection?.home?.team_avatar)" -->
                            <TeamAvatar
                                :team="
                                    !selections ? {} : selections
                                "
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
                              @blur="customOpposition = false"
                                clearable
                                @keydown.enter="customOpposition = false"
                            >
                            </q-input>
                  
                        </div>
                    </div>
                    <div
                        v-else-if="allowCustom && customOppositionName"
                        class="row justify-center"
                    >
                        <div>{{ customOppositionName }}</div>
                        <q-btn
                            flat
                            round
                            icon="edit"
                            size="sm"
                            dense
                            @click="customOpposition = true"
                        />
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
        </div>
    </div>
</template>
<style lang="scss" scoped>
.linescore-confirmation__wrap {
    width: 100%;
    height: 100%;
    display: flex;
    // background-color: rgba(0, 0, 0, 0.1);
    background-color: white;
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
            background-color: white;

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
}
</style>
<script setup>
import { useTeamStore } from "@/store/teams";
import { useDialogStore } from "@/store/dialog";
import { useUserTeamStore } from "@/store/user-teams";

const { toggleLineScore, toggleGlobalSearch } = useDialogStore();

const props = defineProps({
    modelValue: Object,
    allowCustom: Boolean,
    restrictIds: Array,
    filterIds: Array,
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
    toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ["team"],
            restrictIds: props.restrictIds,
            filterIds: props.filterIds,
            callback: (selection) =>
                (selections.value = {
                    ...selection,
                    team_avatar: selection.avatar,
                }),
            inputLabel: "Select your team",
        },
    });
};

const customOppositionName = ref(null);
</script>
