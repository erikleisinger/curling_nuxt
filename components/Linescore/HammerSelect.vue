<template>
  <h2 class="text-md text-bold title q-pa-md text-center">Who has hammer in the 1st end?</h2>
    <div class="linescore-confirmation__container">
        <div class="team-option__container">
            <div class="hammer__container">
                <q-icon
                    clickable
                    :name="selected === homeId ? 'hardware' : 'o_hardware'"
                    :color="selected === homeId ? 'deep-purple' : 'grey-6'"
                    @click="setHammer(homeId)"
                    class="hammer-icon"
                    :class="{selected: selected === homeId}"
                />
            </div>
            <div class="team__container">
                <div class="avatar-container">
                   <TeamAvatar :teamId="selections.home?.id" :color="selections?.homeColor"/>
                </div>
                <div class="text-center text-bold text-md q-pt-sm">
                    {{ selections.home?.name || "Opposition team" }}
                </div>
            </div>
        </div>

        <div class="team-option__container">
            <div class="hammer__container">
                <q-icon
                clickable
                    :name="selected === awayId ? 'hardware' : 'o_hardware'"
                    :color="selected === awayId ? 'deep-purple' : 'grey-6'"
                    @click="setHammer(awayId)"
                     class="hammer-icon"
                    :class="{selected: selected === awayId}"
                />
            </div>
            <div class="team__container">
                <div class="avatar-container">
                    <TeamAvatar :teamId="selections.away?.id" :color="selections?.awayColor"/>
                </div>
                <div class="text-bold text-md text-center q-pt-sm">
                    {{ selections.away?.name || "Opposition team" }}
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
    grid-template-columns: 50% 50%;
    .team-option__container {
        display: flex;
        flex-direction: column;

        .hammer__container {
              min-height: calc($selected-hammer-height + $hammer-container-padding);
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
    modelValue: Object,
});

const homeId = computed(() => selections?.value?.home?.id);
const awayId = computed(() => selections?.value?.away?.id);

const emit = defineEmits(["update:modelValue"]);

const selected = computed(() => selections.value.hammerFirstEndTeam)

const selections = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

onMounted(() => {
    if (!selections.value.hammerFirstEndTeam) selections.value.hammerFirstEndTeam = homeId.value
})

const setHammer = (id) => {
    selections.value.hammerFirstEndTeam = id;
}


</script>
