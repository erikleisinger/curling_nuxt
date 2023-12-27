<template>
    <div class="profile__generator--wrap row" ref="container">
        <div
            class="row justify-center items-center avatar__container col-12 col-sm-6"
            ref="avatarContainer"
        >
            <div class="col-12 row justify-between toolbar">
                <q-btn
                    @click="emit('close')"
                    :disable="readOnly || saving"
                    flat
                    round
                    icon="west"
                />
                <q-btn
                    @click="randomize"
                    :disable="readOnly || saving"
                    icon="casino"
                    flat
                    round
                />
            </div>
            <div class="avatar__wrap">
                <Avataaar v-if="!loading" v-bind="avatar" />
            </div>
        </div>
        <div class="row q-py-md col-12 col-sm-6 features__container">

            <AvataaarFeatureSelector
                :features="skinColors"
                v-model="avatar.skinColor"
                title="Skin color"
                class="col-12"
                :disabled="readOnly"
                label="Skin color"
            />
            <AvataaarFeatureSelector
                :features="topTypes"
                v-model="avatar.topType"
                title="Hair / Hats"
                class="col-12"
                :disabled="readOnly"
                label="Hair & Hats"
            />

            <AvataaarFeatureSelector
                :features="hairColors"
                v-model="avatar.hairColor"
                title="Hair color"
                class="col-12"
                :disabled="readOnly"
                label="Hair color"
            />
            <AvataaarFeatureSelector
                :features="hatAndShirtColors"
                v-model="avatar.topColor"
                title="Hat color"
                class="col-12"
                :disabled="readOnly"
                label="Hat color"
            />
            <AvataaarFeatureSelector
                :features="clothesType"
                v-model="avatar.clotheType"
                title="Clothing"
                class="col-12"
                :disabled="readOnly"
                label="Clothes"
            />
            <AvataaarFeatureSelector
                :features="GraphicShirtTypes"
                v-model="avatar.graphicType"
                title="Logo"
                class="col-12"
                v-if="avatar.clotheType === 'GraphicShirt'"
                label="Shirt logo"
            />
            <AvataaarFeatureSelector
                :features="hatAndShirtColors"
                v-model="avatar.clotheColor"
                title="Shirt color"
                class="col-12"
                :disabled="
                    readOnly ||
                    avatar.clotheType === 'BlazerSweater' ||
                    avatar.clotheType === 'BlazerShirt'
                "
                label="Clothes Color"
            />
            <AvataaarFeatureSelector
                :features="accessoriesTypes"
                v-model="avatar.accessoriesType"
                title="Accessory"
                class="col-12"
                :disabled="readOnly"
                label="Accessories"
            />

            <AvataaarFeatureSelector
                :features="eyebrowTypes"
                v-model="avatar.eyebrowType"
                title="Eyebrows"
                class="col-12"
                :disabled="readOnly"
                label="Eyebrows"
            />
            <AvataaarFeatureSelector
                :features="eyeTypes"
                v-model="avatar.eyeType"
                title="Eyes"
                class="col-12"
                :disabled="readOnly"
                label="Eyes"
            />

            <AvataaarFeatureSelector
                :features="facialHairTypes"
                v-model="avatar.facialHairType"
                title="Facial hair"
                class="col-12"
                :disabled="readOnly"
                label="Facial hair"
            />
            <AvataaarFeatureSelector
                :features="hairColors"
                v-model="avatar.facialHairColor"
                title="Facial hair color"
                class="col-12"
                :disabled="readOnly"
                label="Facial hair color"
            />

            <AvataaarFeatureSelector
                :features="mouthTypes"
                v-model="avatar.mouthType"
                title="Mouth"
                class="col-12"
                :disabled="readOnly"
                label="Mouth"
            />
                        <q-select
                :options="backgrounds"
                v-model="avatar.circleBg"
                emit-value
                map-options
                class="col-12"
                label="Background"
                dense
            >
     
                <template v-slot:after>
                    <q-btn
                        flat
                        round
                        icon="circle"
                        dense
                        :style="{ color: avatar.bgColorPrimary }"
                    >
                        <q-popup-proxy
                       
                            transition-show="scale"
                            transition-hide="scale"
                         
                         
                        >
                            <q-color v-model="avatar.bgColorPrimary"></q-color>
                        </q-popup-proxy>
                    </q-btn>
                     <q-btn
                        flat
                        round
                        icon="circle"
                        dense
                        :style="{ color: avatar.bgColorSecondary }"
                            v-if="isBackgroundPattern"
                    >
                        <q-popup-proxy
                           
                            transition-show="scale"
                            transition-hide="scale"
                        >
                            <q-color v-model="avatar.bgColorSecondary"></q-color>
                        </q-popup-proxy>
                    </q-btn>
                </template>
            </q-select>

            <div class="col-12 row justify-between q-my-lg">
                <q-btn
                    @click="handleSave"
                    :disable="readOnly || saving"
                    color="positive"
                    :loading="saving"
                    block
                    class="col-grow"
                >
                    Save
                </q-btn>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.profile__generator--wrap {
    height: inherit;
    position: relative;
    max-width: v-bind(maxWidth);
    .avatar__container {
        // padding: var(--space-xl);
        padding-bottom: var(--space-xs);
        padding-top: 0px;
        height: max-content;
        max-width: inherit;
        @include sm {
            margin-top: 20vh;
            background-color: unset;
        }
        margin: auto;
        position: sticky;
        top: 0;
        background-color: white;

        z-index: 1;

        .avatar__wrap {
            width: min(275px, 50vw);
        }
    }
    .toolbar {
        position: absolute;
        top: 0;
        z-index: 1;
        padding: var(--space-sm);
        // max-width: inherit;
        box-sizing: border-box;
    }

    .features__container {
        padding: 0px var(--space-lg);
        box-sizing: border-box;
        max-width: inherit;
    }
}
</style>
<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { mouthTypes } from "@/assets/avataaars/mouth";
import { eyeTypes } from "@/assets/avataaars/eyes";
import { eyebrowTypes } from "@/assets/avataaars/eyebrows";
import { clothesType } from "@/assets/avataaars/clothes";
import { topTypes } from "@/assets/avataaars/top";
import { accessoriesTypes } from "@/assets/avataaars/accessories";
import { facialHairTypes } from "@/assets/avataaars/facial-hair";
import { GraphicShirtTypes } from "@/assets/avataaars/graphic-shirt";
import {
    hairColors,
    skinColors,
    hatAndShirtColors,
} from "@/assets/avataaars/colors";
import Player from "@/types/player";
import Json from "@/types/json";

import { usePlayerStore } from "@/store/players";

import { useElementSize, useDebounceFn, rand, useParentElement } from "@vueuse/core";

const props = defineProps<{
    modelValue: Object | String;
    readOnly?: boolean;
}>();

const saving = ref(false);
const handleSave = async () => {
    saving.value = true;
    await useUserStore().updateUserAvatar(avatar.value);
    saving.value = false;
    emit("close");
};

const emit = defineEmits(["update:modelValue", "close"]);

const avatar = ref({ ...props.modelValue });

function getRandomChoice(items: object) {
    const itemsLength = Object.entries(items).length;
    return Object.entries(items)[Math.floor(Math.random() * itemsLength)][0];
}

const randomize = useDebounceFn(() => {
    avatar.value.accessoriesType = getRandomChoice(accessoriesTypes);
    avatar.value.clotheType = getRandomChoice(clothesType);
    avatar.value.clotheColor = getRandomChoice(hatAndShirtColors);
    avatar.value.eyebrowType = getRandomChoice(eyebrowTypes);
    avatar.value.eyeType = getRandomChoice(eyeTypes);
    avatar.value.facialHairColor = getRandomChoice(hairColors);
    avatar.value.facialHairType = getRandomChoice(facialHairTypes);
    avatar.value.graphicType = getRandomChoice(GraphicShirtTypes);
    avatar.value.hairColor = getRandomChoice(hairColors);
    avatar.value.mouthType = getRandomChoice(mouthTypes);
    avatar.value.skinColor = getRandomChoice(skinColors);
    avatar.value.topColor = getRandomChoice(hatAndShirtColors);
    avatar.value.topType = getRandomChoice(topTypes);
}, 100);

onMounted(() => {
    if (!Object.keys(props.modelValue)?.length) randomize();
});

const extractId = (str: string) => {
    if (!str) return null;
    const regex = /#([^)]+)\)/;
    const match = str.match(regex) ?? [];
    return match[1];
};

const isBackgroundPattern = computed(() => !!extractId(avatar.value?.circleBg));

const backgrounds = [
    {
        label: "Default",
        value: "#6fb8e0",
    },
    // {
    //     label: "Diagonal",
    //     value: `url(#circles-1)`,
    // },
    // {
    //     label: "Honeycomb",
    //     value: `url(#hex-1)`,
    // },
    //  {
    //     label: "Carbon Fibre",
    //     value: `url(#carbon-fibre-1)`,
    // },
];

const avatarContainer = ref(null);

const { height } = useElementSize(avatarContainer);

const loading = ref(false);

const userStore = useUserStore();
const container = ref(null)
const {width:parentWidth} = useElementSize(useParentElement(container))

const maxWidth = computed(() => `${parentWidth.value}px`)
</script>
