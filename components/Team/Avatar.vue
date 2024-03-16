<template>
    <div class="avatar-outer__container" :class="{ clickable: 'viewable' }" ref="el">
        <div class="hammer__container--floating" :style="{height: `calc(${hammerSize}px + 4px)`, width: `calc(${hammerSize}px + 4px)`, bottom: `${hammerMargin}px`, right: `${hammerMargin / 2}px`,}" v-if="hammer">
            <q-icon name="o_hardware" color="white" :style="{fontSize: `${hammerSize}px`}"/>
        </div>
        <div
            class="avatar-inner"
            :class="{
                viewable,
                'help--animation': highlight,
            }"
            :style="{ height: teamId === null ? '100%' : 'unset' }"
            ref="innerContainer"
        >
           
            <div
                class="ring"
                :class="{ 'help--highlight': highlight }"
                v-if="loaded"
                :style="styleObj"
            />

            <div class="ring animated" v-if="animateRing && color" />

            <div class="inner-wrap">
               
                <div>
                    <div class="uploaded-avatar__container">
                        <q-img
                            :src="pendingAvatarUrl || avatarUrl"
                            spinner-color="white"
                            height="100%"
                            v-if="pendingAvatarUrl || avatarUrl"
                            @load="loaded = true"
                        ></q-img>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>

.card-menu__container {
    width: 225px;
    @include sm {
        width: 400px;
    }
    box-shadow: $pretty-shadow;
}
.avatar-outer__container {
    position: relative;
    margin-top: -16%;
    height: 100%;

    .avatar-inner {
        transition: transform 0.2s;
        position: relative;
        padding-top: 16%;
    .inner-wrap {
        position: relative;
    }
        @include sm {
            &.viewable {
                &:hover {
                    transform: scale(1.1);
                }
            }
            .inner-wrap {
                z-index: 1;
            }
        }
        .ring {
            aspect-ratio: 1/1;
            z-index: 0;
            width: 100%;
            box-sizing: border-box;
            position: absolute;
            border: 0px solid rgba(0, 0, 0, 0.1);
            bottom: 0;
            border-radius: 50%;
            opacity: 1;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            transition: transform 0.3s ease, border 0.1s ease;

            &.animated {
                -webkit-animation: 20s rotation infinite linear;
                border-width: 9px !important;
                border-color: rgba(0, 0, 0, 0.2) !important;
                animation: 20s rotation infinite linear;
                border-style: dashed !important;
            }
            &:not(.animated) {
                transform: scale(1.02);
            }
        }
    }
    .hammer__container--floating {
        position: absolute;
 
        background-color: $app-mint;
        // border-radius: 50%;
        z-index: 1;
        // aspect-ratio: 1/1;
        padding: 2px;
        border-radius: 50%;
        // padding-top: 3px;

        .q-icon {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: fit-content;
            height: fit-content;
            margin: auto;
        }
    }
}

.uploaded-avatar__container {
    aspect-ratio: 1/1;
    width: 100%;
    margin-top: -0.1em;
    border-radius: 50%;
    overflow: hidden;
    margin: auto;
}
.overlay {
    aspect-ratio: 1/1;
    z-index: 1;
    width: 100%;
    box-sizing: content-box;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.3);
    bottom: 0;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s;
    &.desktop {
        &.visible {
            &:hover {
                opacity: 1;
                cursor: pointer;
            }
        }
        &.editable {
            opacity: 1;
            cursor: pointer;
        }
    }
    &:not(.desktop) {
        &.visible {
            opacity: 1 !important;
        }
    }
}

@keyframes rotation {
    0% {
        transform: rotateZ(0deg) scale(1.2);
    }
    100% {
        transform: rotateZ(360deg) scale(1.2);
    }
}
</style>
<script setup>
import { onClickOutside, useElementHover, useImage, useElementSize } from "@vueuse/core";



import Team from "@/store/models/team";
const props = defineProps({
    animateRing: Boolean,
    color: String,
    create: Boolean,
    disableMenu: Boolean,
    hammer: Boolean,
    highlight: Boolean,
    invitable: Boolean,
    teamId: Number,
    viewable: Boolean,
});

const route = useRoute();
const el = ref(null)

const emit = defineEmits(["edit", "invite", "update"]);

const team = computed(
    () => useRepo(Team).where("id", props.teamId).first() ?? {}
);

const avatarUploading = ref(false)

const pendingAvatarUrl = ref(null);

const setPendingAvatar = (event) => {
    emit("update", event);
    const { file } = event;
    pendingAvatarUrl.value = URL.createObjectURL(file);
};

const enabled = computed(
    () => !!team.value?.avatar_url
);


const $q = useQuasar();

const visible = ref(false);




const avatar_url = computed(() => team.value.avatar_url)
const {teamId} = toRefs(props)

const {$api} = useNuxtApp();

const { isLoading,  data: avatarUrl } =  $api.getTeamAvatar(teamId.value)

const avatar = ref(null);
const loaded = ref(true);

const innerContainer = ref(null);
onClickOutside(innerContainer, () => (visible.value = false));

const hovered = useElementHover(innerContainer);

watch(hovered, (val) => {
    if ($q.platform.is.mobile) return;
    visible.value = val;
});


const { getColor } = useColor();

const avatarColor = computed(() => getColor(props.color));
const styleObj = computed(() => {
    if (!props.color) return {};
    return {
        border: `${props.animateRing ? "10" : "6"}px solid ${getColor(
            props.color
        )}`,
        transform: `scale(${props.animateRing ? "1.2" : "1.08"})`,
        "box-shadow": "unset",
        left: "0",
    };
});

const {width: elSize} = useElementSize(el);

const MAX_HAMMER_SIZE = 24

const hammerSize = computed(() => Math.min(elSize.value / 2, MAX_HAMMER_SIZE))

const hammerMargin = computed(() => (hammerSize.value / 2) * -1)
</script>
<script>
export default {
    name: "TeamAvatar",
};
</script>
