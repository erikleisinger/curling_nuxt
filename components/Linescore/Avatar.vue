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
                :color="selections?.color"
                :viewable="false"
                :animateRing="!!(editing && selectColor && selections?.color)"
                :highlight="false"
                @click="onAvatarClick"
            />

            <div
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
            </div>
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
            class="column items-center full-width q-mt-md"
            v-if="editing || showNames"
            ref="teamName"
        >
            <div class="text-sm" v-if="selections?.id || selections?.name">
                Team
            </div>
            <h2
                class="text-sm text-bold text-center truncate-text full-width"
                v-if="selections?.name"
            >
                <span>{{ selections?.name }}</span>
            </h2>
            <h2 v-else class="text-sm text-bold text-center full-width">
                Click the avatar to select a team
            </h2>
            <div v-if="allowCustom && !showNames" class="">
                <h2 class="text-sm text-bold text-center full-width q-mt-md">
                    Or
                </h2>
                <q-input
                    dense
                    rounded
                    outlined
                    class="q-mt-md"
                    v-model="customName"
                    @keydown.enter="setCustomName"
                    label="Team name"
                >
                    <template v-slot:append>
                        <q-btn
                            flat
                            round
                            icon="check"
                            color="green"
                            dense
                            padding="2px"
                            @click="setCustomName"
                        />
                    </template>
                </q-input>
                <h2 class="text-sm text-bold text-center full-width q-mt-md">
                    Type the team name so you can invite them later
                </h2>
            </div>
        </div>
        <slot name="append"/>
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
            z-index: 100;
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
    .confirm-container--floating {
        z-index: 100;
        position: absolute;
        top: 0;
        right: 0;

        width: fit-content;
    }
}
</style>
<script setup>
import gsap from "gsap";
import { useVModel } from "@vueuse/core";
import { useDialogStore } from "@/store/dialog";
import {triggerClickAnimation} from '@/utils/gsap'
const props = defineProps({
    allowCustom: Boolean,
    avatarSize: {
        type: String,
        default: "inherit",
    },
    canConfirm: Boolean,
    defaultColor: {
        type: String,
        default: "red",
    },
    editing: Boolean,
    hasHammer: Boolean,
    modelValue: Object,
    selectColor: Boolean,
    selectHammer: Boolean,
    showNames: Boolean,
    preventColors: {
        type: Array,
        default: [],
    },
});
const emit = defineEmits(["confirm", "update:color", "update:hammer", "update:modelValue"]);
const selections = useVModel(props, "modelValue", emit);

const customName = ref(null);

const setCustomName = () => {
    emit("update:modelValue", {
        name: customName.value,
        color: selections.value.color,
    });
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
            setConfirmButton();
        }
    }, 10);
};

const confirmContainer = ref(null);

const setConfirmButton = () => {
    gsap.from(confirmContainer.value, {
        scale: 0,
        duration: 0.1,
        delay: 0.6,
    });
};

const teamName = ref(null);

watch(
    () => props.editing,
    () => {
        nextTick(() => {
            gsap.from(teamName.value, {
                ...(props.allowCustom ? { scaleY: 0 } : { scale: 0 }),
                delay: 0.5,
                duration: 0.2,
                transformOrigin: "top",
            });
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
    emit('update:color')
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
