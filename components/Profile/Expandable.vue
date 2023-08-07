<template>
<NuxtLayout>
    <template v-slot:header>
    <div
        class="row bg-white full-width row profile--container box-shadow--dark row no-wrap"
        ref="header"
    >
        <div class="col-3" style="max-width: min(20vw, 125px)">
            <PlayerAvatar
                :parsedAvatar="parseAvatar(avatar)"
                :player="{ ...player, profile_id_for_player: profileId }"
                hidePlayerIcon
            />
        </div>
        <div class="column justify-center q-ml-sm">
        <h1
            class=" row items-center text-bold text-black text-md "
            style="z-index: 2"
        >
            {{firstName}} {{lastName}}
        </h1>
        <h2 class="text-sm">
            @{{ username }}
        </h2>
        </div>
        <div class="col-grow row justify-end q-mr-sm items-center">
        <q-btn flat round icon="logout" @click="logout" color="deep-purple"/>
        </div>
    </div>
    </template>

        <LazyProfile />
</NuxtLayout>
</template>
<style lang="scss" scoped>
.profile--container {
    padding: var(--space-xs) var(--space-xxxs) ;
    z-index: 3;
    position: relative;
    color: black;
}
</style>
<script setup>
import { useElementSize, useSwipe, useScroll } from "@vueuse/core";
import { useUserStore } from "@/store/user";
import { parseAvatar } from "@/utils/avatar";


const {logout} = useSession();

const store = useUserStore();



const { avatar, username, player, id: profileId, firstName, lastName } = store;

const expand = () => {
    expanded.value = !expanded.value;
};

const header = ref(null);
const { height } = useElementSize(header);

// 0.75 * 1em is --var(space-sm), *2 for top and bottom padding
const top = computed(() => `calc(${height.value}px + 0.75 * 1em * 2)`);

const profileContainer = ref(null);
const { direction } = useSwipe(profileContainer, {
    onSwipe: () => {
        if (direction.value === "left") {
            expanded.value = false;
        }
    },
    threshold: 150,
});

const props = defineProps({
    modelValue: Boolean,
});
const emit = defineEmits(["update:model-value"]);
const expanded = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:model-value", val);
    },
});
</script>
