<template>
    <div style="position: relative" class="floating-dialog__container">


        <div class="row justify-center items-center" style="height: 40%; position: relative"     ref="avatarContainer">
            <div
                :style="`width:50%; max-width: calc(${height}px * 0.7)`"
            
            >
                <Avataaar
                v-if="!loading"
                    :accessoriesType="accessoriesType"
                    :clotheType="clotheType"
                    :clotheColor="clotheColor"
                    :eyebrowType="eyebrowType"
                    :eyeType="eyeType"
                    :facialHairColor="facialHairColor"
                    :facialHairType="facialHairType"
                    :graphicType="graphicType"
                    :hairColor="hairColor"
                    :mouthType="mouthType"
                    :skinColor="skinColor"
                    :topType="topType"
                    :topColor="topColor"
                />
            </div>
        </div>

        <InputName :name="player.name" @save="saveName" class="q-mb-lg justify-center" :disabled="readOnly">
    <template v-slot:text>
        <h2 class="text-md text-bold truncate-text">{{ name }}</h2>
    </template>
        </InputName>
        <div class=" toolbar row justify-between q-ma-md" style="position: absolute; top: 0; right:0"> 
             <q-fab
             color="deep-purple"
                        direction="down"
                        dense
                        padding="12px"
                        :persistent="false"
                        icon="build"
                   
                    >
    <q-btn  round icon="save" size="md" color="deep-purple" :disable="readOnly"/>
             </q-fab>
            
            
            
          </div>
        <div
            class="row q-py-md"
            style="height: 50%; overflow: auto; border-top: 1px solid gray"
        >
            <AvatarFeatureSelector
                :features="accessoriesTypes"
                v-model="accessoriesType"
                title="Accessory"
                class="col-12 col-sm-6"
                :disabled="readOnly" 
            />
            <AvatarFeatureSelector
                :features="clothesType"
                v-model="clotheType"
                title="Clothing"
                class="col-12 col-sm-6"
                :disabled="readOnly" 
            />
            <AvatarFeatureSelector
                :features="hatAndShirtColors"
                v-model="clotheColor"
                title="Shirt color"
                class="col-12 col-sm-6"
                :disabled="readOnly || clotheType === 'BlazerSweater' || clotheType === 'BlazerShirt'"

            />
            <AvatarFeatureSelector
                :features="eyebrowTypes"
                v-model="eyebrowType"
                title="Eyebrows"
                class="col-12 col-sm-6"
                :disabled="readOnly" 
            />
            <AvatarFeatureSelector
                :features="eyeTypes"
                v-model="eyeType"
                title="Eyes"
                class="col-12 col-sm-6"
                :disabled="readOnly" 
            />
            <AvatarFeatureSelector
                :features="topTypes"
                v-model="topType"
                title="Hair / Hats"
                class="col-12 col-sm-6"
                :disabled="readOnly" 
            />
            <AvatarFeatureSelector
                :features="hairColors"
                v-model="hairColor"
                title="Hair color"
                class="col-12 col-sm-6"
                :disabled="readOnly" 
            />
            <AvatarFeatureSelector
                :features="hairColors"
                v-model="facialHairColor"
                title="Facial hair color"
                class="col-12 col-sm-6"
                :disabled="readOnly" 
            />
            <AvatarFeatureSelector
                :features="facialHairTypes"
                v-model="facialHairType"
                title="Facial hair"
                class="col-12 col-sm-6"
                :disabled="readOnly" 
            />
            <AvatarFeatureSelector
                :features="GraphicShirtTypes"
                v-model="graphicType"
                title="Logo"
                class="col-12 col-sm-6"
                :disabled="readOnly || clotheType !== 'GraphicShirt'"
            />
            <AvatarFeatureSelector
                :features="mouthTypes"
                v-model="mouthType"
                title="Mouth"
                class="col-12 col-sm-6"
                :disabled="readOnly" 
            />
            <AvatarFeatureSelector
                :features="skinColors"
                v-model="skinColor"
                title="Skin color"
                class="col-12 col-sm-6"
                :disabled="readOnly" 
            />

            <AvatarFeatureSelector
                :features="hatAndShirtColors"
                v-model="topColor"
                title="Hat color"
                class="col-12 col-sm-6"
                :disabled="readOnly" 
            />
            <div class="col-12 row justify-center q-mt-sm">
            <q-btn @click="randomize" :disable="readOnly" color="deep-purple">Random</q-btn>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
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
import { useUserStore } from "@/store/user";

import { useElementSize, useDebounceFn } from "@vueuse/core";

const props = defineProps<{
    player: Player | null;
}>();

 function getRandomChoice (items: object) {
            const itemsLength = Object.entries(items).length
            return Object.entries(items)[Math.floor((Math.random()*(itemsLength)))][0]
        }

const randomize = useDebounceFn(() => {
    accessoriesType.value = getRandomChoice(accessoriesTypes);
    clotheType.value = getRandomChoice(clothesType);
    clotheColor.value = getRandomChoice(hatAndShirtColors);
    eyebrowType.value = getRandomChoice(eyebrowTypes);
    eyeType.value = getRandomChoice(eyeTypes);
    facialHairColor.value = getRandomChoice(hairColors)
    facialHairType.value = getRandomChoice(facialHairTypes);
    graphicType.value = getRandomChoice(GraphicShirtTypes);
    hairColor.value = getRandomChoice(hairColors);
    mouthType.value = getRandomChoice(mouthTypes);
    skinColor.value = getRandomChoice(skinColors);
    topColor.value = getRandomChoice(hatAndShirtColors);
    topType.value = getRandomChoice(topTypes)
}, 100)

const accessoriesType = ref("Blank");
const clotheType = ref("BlazerShirt");
const clotheColor = ref("Black");
const eyebrowType = ref("Default");
const eyeType = ref("Default");
const facialHairColor = ref("Auburn");
const facialHairType = ref("Blank");
const graphicType = ref("Skull");
const hairColor = ref("Auburn");
const mouthType = ref("Default");
const skinColor = ref("Pale");
const topColor = ref("Black");
const topType = ref("LongHairFrida");

const avatarContainer = ref(null);

const { height } = useElementSize(avatarContainer);

const parseAvatarInfo = (avatar: Json) => {
    try {
        const parsedAvatar = JSON.parse(avatar);
        const {
            accessoriesType:at,
            clotheType:ct,
            clotheColor:cc,
            eyebrowType:et,
            eyeType:eyt,
            facialHairColor:fhc,
            facialHairType:fht,
            graphicType:gt,
            hairColor:hc,
            hairType:ht,
            mouthType:mt,
            skinColor:sc,
            topColor:tc,
            topType:tt,
        } = parsedAvatar;
        accessoriesType.value = at;
        clotheType.value = ct;
        clotheColor.value = cc;
        eyebrowType.value = et;
        eyeType.value = eyt;
        facialHairColor.value = fhc;
        facialHairType.value = fht;
        graphicType.value = gt;
        hairColor.value = hc;
        mouthType.value = mt;
        skinColor.value = sc;
        topColor.value = tc;
        topType.value = tt;
    } catch (e) {
        console.error(e);
    }
};

const loading = ref(false)

    const playerStore = usePlayerStore();
const name = computed(() => {
    return playerStore.players.find((p) => p.id === props.player?.id)?.name || 'Unnamed player'
})

onMounted(() => {
    loading.value = true;
    const { avatar = null } = props.player || {};

    if (avatar) {
        parseAvatarInfo(avatar);
    } else {
        randomize();
    }
     loading.value = false;
});

const savePlayer = () => {
    const newAvatar = {
        accessoriesType: accessoriesType.value,
        clotheType: clotheType.value,
        clotheColor: clotheColor.value,
        eyebrowType: eyebrowType.value,
        eyeType: eyeType.value,
        facialHairColor: facialHairColor.value,
        facialHairType: facialHairType.value,
        graphicType: graphicType.value,
        hairColor: hairColor.value,
        mouthType: mouthType.value,
        skinColor: skinColor.value,
        topColor: topColor.value,
        topType: topType.value,
    };


    const updatedPlayer = {
        id: props.player?.id,
        name: name.value,
        avatar: JSON.stringify(newAvatar),
    }
    playerStore.insertPlayer(updatedPlayer);    

    emit("close");
};

const emit = defineEmits(["close"]);

const saveName = (name: string) => {
     playerStore.insertPlayer({id: props.player?.id, name});   
}

const userStore = useUserStore();
const readOnly = computed(() => props.player?.profile_id !== userStore.id)
</script>
