<template>
    <div class="linescore-options__container full-height">
        <div class="column  no-wrap" style="max-width: 100vw">
            <h2 class="text-xl title text-bold title q-px-md text-center">
                Edit game
            </h2>
            <div class="full-width text-center">
                Click the rocks to change colors. Press an avatar to select the
                team with hammer in the first end.
            </div>
        </div>
        <div class="linescore-confirmation__container">
            <div class="team-option__container">
                <div class="team__container">
                    <div class="avatar-container">
                        <TeamAvatar
                            :teamId="selections.home?.id"
                            :color="selections.homeColor"
                            :viewable="false"
                        />
                        <div class="color__container clickable">
                            <div class="color-selection__wrap">
                                <SelectColor
                                    v-model="selections.homeColor"
                                    :prevent="[selections.awayColor]"
                                />
                            </div>
                        </div>
                        <div class="hammer__container clickable">
                            <q-icon
                                clickable
                                :name="
                                    selections.hammerFirstEndTeam ===
                                    selections.home.id
                                        ? 'hardware'
                                        : 'o_hardware'
                                "
                                :color="
                                    selections.hammerFirstEndTeam ===
                                    selections.home.id
                                        ? 'deep-purple'
                                        : 'grey-6'
                                "
                                @click="setHammer(selections.home.id)"
                                class="hammer-icon"
                                :class="{
                                    selected:
                                        selections.hammerFirstEndTeam ===
                                        selections.home.id,
                                }"
                            />
                        </div>
                    </div>
                    <div class="text-center text-bold text-md q-pt-sm">
                        {{ selections.home?.name || "Opposition team" }}
                    </div>
                </div>
            </div>

            <div class="team-option__container">
                <div class="team__container">
                    <div class="avatar-container">
                        <TeamAvatar
                            :teamId="selections?.away?.id"
                            :color="selections.awayColor"
                            :viewable="false"
                        />
                        <div class="color__container clickable">
                            <div class="color-selection__wrap ">
                                <SelectColor
                                    v-model="selections.awayColor"
                                    :prevent="[selections.homeColor]"
                                />
                            </div>
                        </div>
                        <div class="hammer__container clickable">
                            <q-icon
                                clickable
                                :name="
                                    selections.hammerFirstEndTeam ===
                                    selections.away.id
                                        ? 'hardware'
                                        : 'o_hardware'
                                "
                                :color="
                                    selections.hammerFirstEndTeam ===
                                    selections.away.id
                                        ? 'deep-purple'
                                        : 'grey-6'
                                "
                                @click="setHammer(selections.away.id)"
                                class="hammer-icon"
                                :class="{
                                    selected:
                                        selections.hammerFirstEndTeam ===
                                            selections.away.id ||
                                        selections.hammerFirstEndTeam ===
                                            undefined,
                                }"
                            />
                        </div>
                    </div>
                    <div class="text-bold text-md text-center q-pt-sm">
                        {{ selections.away?.name || "Opposition team" }}
                    </div>
                </div>
            </div>
        </div>
         <div class="row justify-center items-start">
            <q-btn
                icon="check_circle"
                color="green"
                size="50px"
                flat
                round
                dense
                @click="emit('select')"
               
            />
        </div>
    </div>
</template>
<style lang="scss" scoped>
$hammer-container-padding: var(--space-md);
$color-selection-height: 3em;
.linescore-options__container {
    display: grid;
    grid-template-rows: 100px auto 25%;
    padding-top: 60px;
}
.linescore-confirmation__container {
    width: min(500px, 100vw);
    margin: auto;
  
    display: grid;
    grid-template-columns: repeat(2, 50%);
    
    .team-option__container {
        display: flex;
        flex-direction: column;
        position: relative;

        .color__container,
        .hammer__container {
            z-index: 1;
            transition: transform 0.2s;
            &:hover {
                transform: scale(1.1)
            }
        }

        .color__container {
            height: auto;

            position: absolute;
            right: -10px;
            bottom: -10px;

            .color-selection__wrap {
                width: $color-selection-height;
            }
        }
        .hammer__container {
            width: 3em;
            height: 3em;
            position: absolute;
            bottom: -5px;
            left: -10px;
            z-index: 3;
            background-color: white;
            aspect-ratio: 1/1;
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, 0.3);
            padding: 2px;
            .hammer-icon {
                transition: all 0.2s linear;
                font-size: calc(3em - 6px);
                &.selected {
                    transform: rotate(45deg);
                    // font-size: 3em;
                }
            }
        }
        .team__container {
            display: flex;
            flex-direction: column;
            // justify-content: center;
            align-items: center;
            padding: var(--space-lg);
            min-height: 250px;
            position: relative;
        }
        .avatar-container {
            width: 18vh;
            position: relative;
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
</style>
<script setup>
import { parseAvatar } from "@/utils/avatar";
const props = defineProps({
    modelValue: Object,
});

const emit = defineEmits(["update:modelValue", 'select']);

const selections = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

onMounted(() => {
    setHammer(selections.value.home.id);
});

const setHammer = (id) => {
    selections.value.hammerFirstEndTeam = id;
};
</script>
