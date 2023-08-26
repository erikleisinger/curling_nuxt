<template>
    <!-- :class="{confirm: selections.home && selections.away}" -->
    <!-- <div class="linescore-teamselect__container" >
    <div class="inner__container" > -->

    <div class="linescore-confirmation__wrap">
        <div class="linescore-confirmation__container">
            <div class="team__card">
                <h2 class="team__header">My team</h2>
                <div class="team-result__container">
                    <div class="color-hammer-select__container">
                        <div class="color-hammer-inner">
                            <q-icon
                                clickable
                                :name="
                                    selections.hammerFirstEndTeam === 'home'
                                        ? 'hardware'
                                        : 'o_hardware'
                                "
                                :color="
                                    selections.hammerFirstEndTeam === 'home'
                                        ? 'deep-purple'
                                        : 'grey-6'
                                "
                                @click="selections.hammerFirstEndTeam = 'home'"
                                class="hammer-icon"
                                :class="{
                                    selected: selections.hammerFirstEndTeam === 'home',
                                }"
                            />
                        </div>
                    </div>
                    <div class="team__container">
                        <div style="width: 7em" @click="toggleHomeSelect">
                            <!-- v-bind="parseAvatar(teamSelection?.home?.team_avatar)" -->
                            <TeamAvatar
                                :team="
                                    !selections.home?.id ? {} : selections.home
                                "
                            />
                        </div>
                    </div>
                    <div class="color-hammer-select__container">
                        <div class="color-hammer-inner">
                            <SelectColor
                                v-model="selections.homeColor"
                                :prevent="[selections.awayColor]"
                            />
                        </div>
                    </div>
                </div>
                <div
                    class="text-center text-bold text-md"
                    style="white-space: nowrap"
                >
                    {{
                        selections.home?.id
                            ? selections.home.name ?? "Unnamed team"
                            : "Click to select your team"
                    }}
                </div>
            </div>

            <div
                class="versus-container text-xl text-bold row justify-center items-center"
            >
                VS
            </div>

            <div class="team__card">
                <h2 class="team__header">
                    <div>Opposition</div>
                </h2>
                <div
                    class="no-opposition__floating text-sm"
                    @click="customOpposition = true"
                >
                    {{
                        customOpposition
                            ? "Type their name and they can add themselves later"
                            : "Can't find opposition?"
                    }}
                </div>
                <div class="team-result__container">
                    <div class="color-hammer-select__container">
                        <div class="color-hammer-inner">
                            <q-icon
                                clickable
                                :name="
                                    selections.hammerFirstEndTeam === 'away'
                                        ? 'hardware'
                                        : 'o_hardware'
                                "
                                :color="
                                    selections.hammerFirstEndTeam === 'away'
                                        ? 'deep-purple'
                                        : 'grey-6'
                                "
                                @click="selections.hammerFirstEndTeam = 'away'"
                                class="hammer-icon"
                                :class="{
                                    selected: selections.hammerFirstEndTeam === 'away',
                                }"
                            />
                        </div>
                    </div>
                    <div class="team__container">
                        <div style="width: 7em" @click="toggleAwaySelect">
                            <!-- v-bind="parseAvatar(teamSelection?.away?.team_avatar)" -->
                           <TeamAvatar
                                :team="
                                    !selections.away?.id ? {} : selections.away
                                "
                            />
                        </div>
                    </div>
                    <div class="color-hammer-select__container">
                        <div class="color-hammer-inner">
                            <SelectColor
                                v-model="selections.awayColor"
                                :prevent="[selections.homeColor]"
                            />
                        </div>
                    </div>
                </div>
                <div
                    class="text-bold text-md text-center full-width"
                    style="overflow: hidden"
                >
                    <div
                        v-if="customOpposition"
                        class="row justify-center"
                        key="custom"
                    >
                        <div style="width: 75%">
                            <q-input
                                dense
                                rounded
                                outlined
                                label="Type opposition name"
                                autofocus
                                v-model="selections.away.name"
                                @blur="customOpposition = false"
                                clearable
                                @keydown.enter="customOpposition = false"
                            >
                            </q-input>
                        </div>
                    </div>
                    <div
                        v-else-if="customOppositionName"
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
                    <div v-else-if="selections.away" key="awayname">
                        {{ selections.away.name ?? "Unnamed opposition" }}
                    </div>
                    <div
                        v-else-if="!customOpposition"
                        style="white-space: nowrap; height: 40px"
                        key="select"
                        @click="toggleHomeSelect"
                    >
                        Click to select opposition
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="confirm-button__container">
        <q-btn rounded size="xl" color="deep-purple" @click="emit('save')">Confirm & Save</q-btn>
    </div> -->
    </div>

    <!-- <KeepAlive>

    <TeamList :teams="teamOptions" v-if="teamOptions?.length " @select="onSelect" />
   
</KeepAlive> -->

    <!-- </div>
    </div> -->
</template>
<style lang="scss" scoped>
.linescore-confirmation__wrap {
    width: 100%;
    height: 100%;
    display: flex;
    background-color: rgba(0, 0, 0, 0.1);
    // display: grid;
    // grid-template-rows: min(300px, 50%) min(250px, 50%);
    .linescore-confirmation__container {
        display: grid;
        grid-template-rows: auto 50px auto;
        height: 100%;
        box-sizing: border-box;
        width: 100%;
        max-height: 600px;
        max-width: 500px;
        margin: auto;

        // row-gap: var(--space-sm);
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
            display: grid;
            grid-template-rows: 1fr min-content 1fr;
            box-shadow: $pretty-shadow;
            border-radius: 8px;
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

                // font-weight: bold;
            }
            .team-result__container {
                // margin-top: var(--space-md);
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
                            // font-size: $selected-hammer-height;
                        }
                    }
                }
            }
        }
    }
    .confirm-button__container {
        // padding: var(--space-md);
        display: flex;
        justify-content: center;
        align-items: center;
        :deep(.q-btn) {
            width: 75%;
        }
    }
}

.linescore-teamselect__container {
    height: 100%;
    width: 100%;
    &.confirm {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .inner__container {
        width: 100%;
        &.confirm {
            height: 50%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
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

const userTeamStore = useUserTeamStore();

const userTeams = computed(() =>
    userTeamStore.userTeams
        .filter(({ is_admin, type }) => type === "member" || !!is_admin)
        .map(({ id }) => id)
);

const customOpposition = ref(false);

const toggleHomeSelect = () => {
    toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ["team"],
            restrictIds: userTeams.value,
            callback: (selection) =>
                (selections.value.home = {
                    ...selection,
                    team_avatar: selection.avatar,
                }),
            inputLabel: "Select your team",
        },
    });
};

const toggleAwaySelect = () => {
    toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ["team"],
            filterIds: [userId.value],
            callback: (selection) =>
                (selections.value.away = {
                    ...selection,
                    team_avatar: selection.avatar,
                }),
            inputLabel: "Select your team",
        },
    });
};

const customOppositionName = ref(null);
</script>
