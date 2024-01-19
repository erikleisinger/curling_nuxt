<template>
    <div class="column team__header items-center no-wrap">
        <div class="avatar__container" ref="avatarContainer">
            <div
                class="confirm-container--floating"
                v-if="canConfirm"
                ref="confirmContainer"
                @click.stop="emit('confirm')"
            >
                <q-btn round icon="check" color="green" padding="4px" />
            </div>
            <TeamAvatar
                :teamId="selections?.id"
                :color="color"
                :viewable="viewable"
                :animateRing="!!(editing && selectColor && selections?.color)"
                :highlight="false"
                @click="onAvatarClick"
                v-memo="[
                    selections?.id,
                    selections?.color,
                    !!selections.name,
                    editing,
                ]"
                :hammer="hasHammer"
            />

            <!-- <div
                class="hammer-container"
                ref="hammerContainer"
                v-if="selectHammer || hasHammer"
                :class="{
                    'bg-primary': hasHammer,
                    'bg-grey-4': !hasHammer,
                }"
                @click="onHammerClick"
            >
                <IconHammer :color="hasHammer ? 'white' : '#36454F'" />
            </div> -->
            <GameHammerIndicator :hasHammer="hasHammer" size="2.5em" v-if="showHammer"/>
            <div
                class="color-container"
                @click="onColorClick"
                ref="colorContainer"
                :style="{
                    visibility: editing && selectColor ? 'visible' : 'hidden',
                }"
            >
                <RockIcon
                    :draggable="false"
                    :color="selections?.color"
                    v-if="editing && selectColor"
                />
            </div>
        </div>

        <div
            class="column items-center full-width q-mt-md q-px-sm"
            v-if="editing || showNames"
            ref="teamName"
        >
            <h2
                class="text-sm text-bold text-center truncate-text full-width"
                v-if="selections?.name"
            >
                <span class="relative-position"
                    >{{ selections?.name }}
                    <div
                        class="clear-name-container--floating"
                        v-if="customName === selections?.name"
                    >
                        <q-btn
                            flat
                            round
                            icon="edit"
                            dense
                            padding="0px"
                            class="text-sm"
                            size="0.8em"
                            color="grey-8"
                            @click="showCustomNameInput = true"
                        />
                    </div>
                     <div class="placeholder--floating left" v-if="selections.pending && (!selections.id || selections.id > 100000000)">
                <q-icon color="grey-6" name="o_smart_toy" />
            </div>
                </span>
             
            </h2>
            
            <h2 v-else class="text-sm text-bold text-center full-width">
                <slot name="teamSelectPrompt">
                    Click the avatar to select a team
                </slot>
            </h2>
               <slot name="team-name-append"/>
           
        </div>
        <slot name="append" />
    </div>
</template>
<style lang="scss">
.team__header {
    position: relative;
    .avatar__container {
        max-width: 7em;
        width: v-bind(avatarSize);
        aspect-ratio: 1/1;
        position: relative;
        .color-container {
            overflow: hidden;
            z-index: 1000;
            position: absolute;
            bottom: -1;

            display: flex;
            justify-content: center;
            align-items: center;

            border-radius: 50%;
            height: 30%;
            aspect-ratio: 1/1;
            left: 0;
            bottom: -10%;

            border: 1px solid rgba(0, 0, 0, 0.3);
        }
        .hammer-container {
            z-index: 1;
            position: absolute;
            bottom: -1;

            display: flex;
            justify-content: center;
            align-items: center;

            border-radius: 50%;
            height: 30%;
            padding: 5%;
            aspect-ratio: 1/1;
            right: 0;
            bottom: -10%;

            border: 1px solid rgba(0, 0, 0, 0.3);
        }
    }
    .score__container {
        font-size: 4em;
        position: relative;
    }
    .confirm-container--floating,
    .clear-name-container--floating {
        z-index: $z-tools;
        position: absolute;
        top: 0;
        width: fit-content;
    }
    .confirm-container--floating {
        right: 0;
    }
    .clear-name-container--floating {
        left: -1.5em;
    }
    .placeholder--floating {
        position: absolute;
        top: 0;
        &:not(.right) {
            left: -1.3em;
            margin-right: var(--space-xs);
        }
        &.right {
            right: -1em;
            margin-left: var(--space-xs);
        }
    }
}
</style>
<script setup>
import gsap from "gsap";
import { useVModel } from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";
import { triggerClickAnimation } from "@/utils/gsap";
const props = defineProps({
    allowCustom: Boolean,
    avatarSize: {
        type: String,
        default: "inherit",
    },
    canConfirm: Boolean,
    color: String,
    defaultColor: {
        type: String,
        default: "red",
    },
    editing: Boolean,
    filterIds: Array,
    hasHammer: Boolean,
    modelValue: Object,
    restrictIds: Array,
    selectColor: Boolean,
    selectHammer: Boolean,
    showHammer: Boolean,
    showNames: Boolean,
    preventColors: {
        type: Array,
        default: [],
    },
    viewable: Boolean,
});
const emit = defineEmits([
    "confirm",
    "update:color",
    "update:hammer",
    "update:modelValue",
]);
const selections = useVModel(props, "modelValue", emit);

const customName = ref(null);

const showCustomNameInput = ref(true);
const showCustomInstructions = ref(true);

const setCustomName = () => {
    emit("update:modelValue", {
        name: customName.value,
        color: selections.value.color,
    });
    showCustomNameInput.value = false;
    showCustomInstructions.value = false;
};

const avatarContainer = ref(null);

const onAvatarClick = () => {
    if (!props.editing) return;
    triggerClickAnimation(avatarContainer.value);
    useDialogStore().toggleGlobalSearch({
        open: true,
        options: {
            resourceTypes: ["team"],
            callback: onAvatarSelect,
            filterIds: props.filterIds,
            restrictIds: props.restrictIds,
        },
    });
};

const onAvatarSelect = (selection) => {
    const oldSelections = { ...selections.value };
    emit("update:modelValue", { ...selection, color: oldSelections?.color });
    setTimeout(() => {
        if (selection?.id !== oldSelections?.id) {
            if (selection.id) {
                gsap.from(avatarContainer.value, {
                    scale: 3,
                    duration: 0.6,
                    ease: "bounce",
                });
            } else {
                gsap.from(avatarContainer.value, {
                    scale: 0,
                    duration: 0.6,
                    ease: "bounce",
                });
            }
        }
        showCustomNameInput.value = true;
        showCustomInstructions.value = true;
        customName.value = null;
    }, 10);
};

const confirmContainer = ref(null);

const makeButtonAppear = (ref) => {
    if (!ref) return;
    gsap.from(ref, {
        scale: 0,
        duration: 0.3,
        delay: 0.2,
    });
};

const teamName = ref(null);

watch(
    () => props.editing,
    (val) => {
        if (!val) return;
        nextTick(() => {
            gsap.from(teamName.value, {
                ...(props.allowCustom ? { scaleY: 0 } : { scale: 0 }),
                delay: 0.5,
                duration: 0.2,
                transformOrigin: "top",
            });
            if (!val) return;
            if (!props.hasHammer) makeButtonAppear(hammerContainer.value);

            // makeButtonAppear(colorContainer.value)
        });
    }
);

watch(
    () => props.canConfirm,
    (val) => {
        if (!val) return;
        nextTick(() => {
            makeButtonAppear(confirmContainer.value);
        });
    }
);

const colorOptions = ref([
    {
        value: "red",
        label: "Red",
    },
    {
        value: "yellow",
        label: "Yellow",
    },
    {
        value: "blue",
        label: "Blue",
    },
]);

const getNextColorIndex = (index, prevent) => {
    let nextIndex = index + 1 > colorOptions.value.length - 1 ? 0 : index + 1;
    if (prevent.includes(colorOptions.value[nextIndex]?.value)) {
        return getNextColorIndex(nextIndex, prevent);
    }
    return nextIndex;
};

const changeColor = () => {
    const currentColorIndex =
        colorOptions.value.findIndex(
            ({ value }) => value === selections.value?.color
        ) || 0;

    const next = getNextColorIndex(currentColorIndex, props.preventColors);
    selections.value.color = colorOptions.value[next]?.value || "red";
    emit("update:color");
};

const colorContainer = ref(null);

const onColorClick = () => {
    if (!props.editing) return;
    triggerClickAnimation(colorContainer.value);
    changeColor();
};

const hammerContainer = ref(null);

const onHammerClick = () => {
    if (!props.editing) return;
    triggerClickAnimation(hammerContainer.value);
    emit("update:hammer");
};

watch(
    () => props.selectColor,
    (visible) => {
        if (!visible) return;
        const delay = 0.5;
        gsap.from(colorContainer.value, {
            scale: 0,
            delay,
        });

        if (!selections.value.color) {
            setTimeout(() => {
                selections.value.color = props.defaultColor;
            }, delay * 1000);
        }
    }
);


</script>
<script>
export default {
    name: "LinescoreAvatar",
};
</script>
