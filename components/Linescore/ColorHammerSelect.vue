<template>
    <LinescorePageContainer @next="emit('select')">
        <template v-slot:title> Edit game </template>
        <template v-slot:subtitle>
            Click rocks to change colors. Click hammers to set hammer in the
            first end.
        </template>
        <template v-slot:content>
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
                                    <SelectRockColor
                                        v-model="selections.homeColor"
                                        :prevent="[selections.awayColor]"
                                    />
                                </div>
                            </div>
                            <GameHammerIndicator :hasHammer=" selections.hammerFirstEndTeam ===
                                        selections.home.id" @select="setHammer(selections.home.id)" clickable/>
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
                                <div class="color-selection__wrap">
                                    <SelectRockColor
                                        v-model="selections.awayColor"
                                        :prevent="[selections.homeColor]"
                                    />
                                </div>
                            </div>
                            <GameHammerIndicator :hasHammer="selections.hammerFirstEndTeam ===
                                        selections.away.id" @select="setHammer(selections.away.id)" clickable/>
                        </div>
                        <div class="text-bold text-md text-center q-pt-sm">
                            {{ selections.away?.name || "Opposition team" }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </LinescorePageContainer>
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

        .color__container {
            z-index: 1;
            transition: transform 0.2s;
            &:hover {
                transform: scale(1.1);
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
            width: 8rem;
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

const emit = defineEmits(["update:modelValue", "select"]);

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
