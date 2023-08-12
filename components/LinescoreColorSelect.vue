<template>
    <div class="linescore-confirmation__container">
        <div class="team-option__container">
            <div class="color__container">
                <div class="color-selection__wrap">
                <SelectColor v-model="selections.homeColor"/>
                </div>
            </div>
            <div class="team__container">
                <div class="avatar-container">
                    <Avataaar
                        v-bind="parseAvatar(selections?.home?.team_avatar)"
                    />
                </div>
                <div class="text-center text-bold text-md q-pt-sm">
                    {{ selections.home?.name || "Unnamed team" }}
                </div>
            </div>
        </div>

        <div class="team-option__container">
            <div class="color__container">
                  <div class="color-selection__wrap">
                <SelectColor v-model="selections.awayColor"/>
                </div>
            </div>
            <div class="team__container">
                <div class="avatar-container">
                    <Avataaar
                        v-bind="parseAvatar(selections?.away?.team_avatar)"
                    />
                </div>
                <div class="text-bold text-md text-center q-pt-sm">
                    {{ selections.away?.name || "Unnamed team" }}
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
$hammer-container-padding: var(--space-md);
$color-selection-height: 5em;
.linescore-confirmation__container {
    width: min(500px, 100%);
    margin: auto;
    height: 60%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    .team-option__container {
        display: flex;
        flex-direction: column;

        .color__container {
              min-height: calc($color-selection-height + $hammer-container-padding * 2);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: $hammer-container-padding;
        
            .color-selection__wrap {
            width: $color-selection-height;
            }
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

const emit = defineEmits(["update:modelValue"]);

const selections = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});

</script>
