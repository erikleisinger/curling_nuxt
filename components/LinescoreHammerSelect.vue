<template>
    <div class="linescore-confirmation__container">
        <div class="team-option__container">
            <div class="hammer__container">
                <q-icon
                    clickable
                    :name="selected === homeId ? 'hardware' : 'o_hardware'"
                    :color="selected === homeId ? 'deep-purple' : 'grey-6'"
                    @click="selected = homeId"
                    class="hammer-icon"
                    :class="{selected: selected === homeId}"
                />
            </div>
            <div class="team__container">
                <div class="avatar-container">
                    <Avataaar
                        v-bind="parseAvatar(teamSelection?.home?.team_avatar)"
                    />
                </div>
                <div class="text-center text-bold text-md q-pt-sm">
                    {{ teamSelection.home?.name || "Opposition team" }}
                </div>
            </div>
        </div>

        <div class="team-option__container">
            <div class="hammer__container">
                <q-icon
                    :name="selected === awayId ? 'hardware' : 'o_hardware'"
                    :color="selected === awayId ? 'deep-purple' : 'grey-6'"
                    @click="selected = awayId"
                     class="hammer-icon"
                    :class="{selected: selected === awayId}"
                />
            </div>
            <div class="team__container">
                <div class="avatar-container">
                    <Avataaar
                        v-bind="parseAvatar(teamSelection?.away?.team_avatar)"
                    />
                </div>
                <div class="text-bold text-md text-center q-pt-sm">
                    {{ teamSelection.away?.name || "Opposition team" }}
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$hammer-container-padding: var(--space-md);
$selected-hammer-height: 6em;
.linescore-confirmation__container {
    width: min(500px, 100%);
    margin: auto;
    height: 60%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    .team-option__container {
        display: flex;
        flex-direction: column;

        .hammer__container {
              min-height: calc($selected-hammer-height + $hammer-container-padding * 2);
            display: flex;
            justify-content: center;
            padding: $hammer-container-padding;
        }
        .team__container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: var(--space-lg);
        }
        .avatar-container {
            width: 12vh;
        }
        .hammer-icon {
            transition: all 0.2s linear;
           font-size: 5em;
            &.selected {
                transform: rotate(45deg);
                font-size: $selected-hammer-height;
                
            }
        }
    }
}
.confirm-button__container {
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
    modelValue: Number,
    score: Object,
    teamSelection: Object,
});

const homeId = computed(() => props.teamSelection?.home?.id);
const awayId = computed(() => props.teamSelection?.away?.id);

const emit = defineEmits(["update:modelValue"]);

const selected = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});


</script>
