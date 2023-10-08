<template>
<div class="profile__generator--wrap row ">
        <div
            class="row justify-center items-center avatar__container col-12 col-sm-6"
            ref="avatarContainer"
        >
            <div class="avatar__wrap">
                <Avataaar
                    v-if="!loading"
                    v-bind="avatar"
                />
            </div>
        </div>
        <div
            class="row q-py-md  col-12 col-sm-6"
        >
    
          
            <AvataaarFeatureSelector
                :features="accessoriesTypes"
                v-model="avatar.accessoriesType"
                title="Accessory"
                class="col-12"
                :disabled="readOnly"
            />
            <AvataaarFeatureSelector
                :features="clothesType"
                v-model="avatar.clotheType"
                title="Clothing"
                class="col-12"
                :disabled="readOnly"
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
            />
            <AvataaarFeatureSelector
                :features="eyebrowTypes"
                v-model="avatar.eyebrowType"
                title="Eyebrows"
                class="col-12"
                :disabled="readOnly"
            />
            <AvataaarFeatureSelector
                :features="eyeTypes"
                v-model="avatar.eyeType"
                title="Eyes"
                class="col-12"
                :disabled="readOnly"
            />
            <AvataaarFeatureSelector
                :features="topTypes"
                v-model="avatar.topType"
                title="Hair / Hats"
                class="col-12"
                :disabled="readOnly"
            />




            <AvataaarFeatureSelector
                :features="hairColors"
                v-model="avatar.hairColor"
                title="Hair color"
                class="col-12"
                :disabled="readOnly"
            />
            <AvataaarFeatureSelector
                :features="hairColors"
                v-model="avatar.facialHairColor"
                title="Facial hair color"
                class="col-12"
                :disabled="readOnly"
            />
            <AvataaarFeatureSelector
                :features="facialHairTypes"
                v-model="avatar.facialHairType"
                title="Facial hair"
                class="col-12"
                :disabled="readOnly"
            />
            <AvataaarFeatureSelector
                :features="GraphicShirtTypes"
                v-model="avatar.graphicType"
                title="Logo"
                class="col-12"
                :disabled="readOnly || avatar.clotheType !== 'GraphicShirt'"
            />
            <AvataaarFeatureSelector
                :features="mouthTypes"
                v-model="avatar.mouthType"
                title="Mouth"
                class="col-12"
                :disabled="readOnly"
            />
            <AvataaarFeatureSelector
                :features="skinColors"
                v-model="avatar.skinColor"
                title="Skin color"
                class="col-12"
                :disabled="readOnly"
            />

            <AvataaarFeatureSelector
                :features="hatAndShirtColors"
                v-model="avatar.topColor"
                title="Hat color"
                class="col-12 "
                :disabled="readOnly"
            />
          
        </div>
           <div class="col-12 row justify-between">
                <q-btn
                class="q-ma-sm col-grow q-mb-md"
                    @click="randomize"
                    :disable="readOnly || saving"
                    color="deep-purple"
                    >Random</q-btn
                >
                
       </div>
         <div class="col-12 row justify-between">
               <q-btn
                class="col-grow q-ma-sm q-mb-md"
                    @click="emit('close')"
                    :disable="readOnly || saving"
                    
                    >Discard</q-btn
                >
         <q-btn
                class="col-grow q-ma-sm q-mb-md"
                    @click="handleSave"
                    :disable="readOnly || saving"
                    color="positive"
                    :loading="saving"
                    >Save</q-btn
                >
         </div>

</div>
</template>
<style lang="scss" scoped>
.profile__generator--wrap {
    height: inherit;
    .avatar__container {
        padding: var(--space-xl);
        padding-bottom: var(--space-xs);
        padding-top: 0px;
        height: max-content;
        @include sm {
            margin-top: 20vh;
            background-color: unset;
        }
        margin: auto;
        position: sticky;
        top: 0;
        background-color:white;

        z-index: 1;

.avatar__wrap {
    width: min(275px, 50vw);
}
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

import { useElementSize, useDebounceFn } from "@vueuse/core";

const props = defineProps<{
    modelValue: Object | String,
    readOnly?: boolean
}>();

const saving = ref(false)
const handleSave = async () => {
    saving.value = true;
   await useUserStore().updateUserAvatar(avatar.value)
   saving.value = false;
   emit('close')
}

const emit = defineEmits(['update:modelValue', 'close'])

const avatar = ref({...props.modelValue});

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


const avatarContainer = ref(null);

const { height } = useElementSize(avatarContainer);

const loading = ref(false);

const userStore = useUserStore();
</script>
