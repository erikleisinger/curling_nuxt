<template>
    <div class="avatar-outer__container" :class="{ clickable: 'viewable' }">
        <div
            class="avatar-inner "
            :class="{
                upload: avatarType === 'upload',

                viewable,
                'help--animation': highlight
            }"
            :style="{ height: teamId === null ? '100%' : 'unset' }"
            @click="clickAvatar"
            ref="innerContainer"
        >
            <div
                class="overlay row justify-center items-center "
                :class="{
                    desktop: $q.platform.is.desktop,
                    visible: editable || visible
                }"
            >
                <div class="text-white text-bold" v-if="!editable">
                    {{ invitable ? "Invite" : "View" }}
                </div>

                <q-icon v-else name="edit" color="white" size="md" />
            </div>
            <div
                class="ring "
                :class="{'help--highlight': highlight}"
                v-if="loaded"
                :style="{
                    left: avatarType === 'upload' ? '0' : '0',
                    ...styleObj,
                }"
              
            />
            <!-- <transition appear enter-active-class="animated zoomIn" leave-active-class="animated zoomOut"> -->
               
            <div class="ring animated" v-if="animateRing && color" />
            
            <!-- </transition> -->

            <div class="inner-wrap ">
                <UploaderDraft
                    v-if="editable && visible"
                    style="z-index: 10"
                    @upload="setPendingAvatar"
                    :emitOnly="create"
                    resourceType="team"
                    :resourceId="teamId"
                />
                <div v-if="avatarType === 'upload' && (avatarUrl || pendingAvatarUrl)">
                    <div
                     
                        class="uploaded-avatar__container"
                    >
                        <q-img
                            :src="pendingAvatarUrl || avatarUrl"
                            spinner-color="white"
                            height="100%"
                            v-if="pendingAvatarUrl || avatarUrl"
                            @load="loaded = true"
                        ></q-img>
                    </div>
                </div>
                <Avataaar
                    v-else-if="avatarType === 'avataaar'"
                    v-bind="team.team_avatar"
                />
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>

.avatar-outer__container {
    position: relative;
    margin-top: -16%;
    height: 100%;

    .avatar-inner {
        transition: transform 0.2s;
        position: relative;
        // height: 100%;

        &.upload {
            padding-top: 16%;
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
        border-color: rgba(0,0,0,0.2)!important;
        animation: 20s rotation infinite linear;
        border-style: dashed !important;
    }
    &:not(.animated) {
        transform: scale(1.02);
    }
   
        }
    }
}

.uploaded-avatar__container {
    aspect-ratio: 1/1;
    width: 100%;
    margin-top: -0.1em;
    // background-color: rgba(0, 0, 0, 0.1);
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
        // opacity: 0;
    }
    100% {
        transform: rotateZ(360deg) scale(1.2);
        // opacity: 1;
    }
}
</style>
<script setup>
import { useStorageStore } from "@/store/storage";
import { onClickOutside, useElementHover, useImage } from "@vueuse/core";
import { useQuery} from '@tanstack/vue-query'

import Team from "@/store/models/team";
const props = defineProps({
    animateRing: Boolean,
    color: String,
    create: Boolean,
    editable: Boolean,
    highlight: Boolean,
    invitable: Boolean,
    teamId: Number,
    viewable: Boolean,
});

const emit = defineEmits(["edit", "invite", "update"]);

const team = computed(
    () => useRepo(Team).where("id", props.teamId).first() ?? {}
    
);

const pendingAvatarUrl = ref(null)

const setPendingAvatar = (event) => {
    emit('update', event)
    const {file} = event;
    console.log(file)
    pendingAvatarUrl.value = URL.createObjectURL(file)
}

const teamAvatarKey = computed(() => team.value.avatar_url);

const enabled = computed(() => team.value.avatar_type === 'upload' && !!team.value.avatar_url)
const {isLoading, data: avatarUrl} = useQuery({
    queryKey: ['avatar', 'team', teamAvatarKey],
    queryFn:  async () => {
        const {data, error} = await useSupabaseClient().storage.from("Avatars").download(team.value.avatar_url)
        return URL.createObjectURL(data);
    },
    enabled: enabled.value,
    refetchOnWindowFocus: false,
    cacheTime: Infinity,
})



const storage = useStorageStore();

const $q = useQuasar();

const visible = ref(false);

// const avatarUrl = computed(() => data?.data);

const avatarType = computed(() => {
    if (team.value.avatar_type === "upload") {
        return team.value.avatar_url ? "upload" : "avataaar";
    }
    return team.value.avatar_type ?? "avataaar";
});

// const fetchAvatar = async (path) => {
//     console.log('fetching avatar: ', path)
//     storage.getTeamAvatar(team.value.id, path);
// };

const avatar = ref(null);
const loaded = ref(true);

// const getAvatar = async () => {
//     if (team.value.avatar_type === "upload") {
//         if (team.value.avatar_url) {
//             fetchAvatar(team.value.avatar_url);
//         } else {
//             team.value.avatar_type = "avataaar";
//             avatar.value = {};
//         }
//     } else {
//         avatar.value = team.value.team_avatar;
//     }
// };

// onMounted(() => {
//     getAvatar();
// });

// watch(() => team.value.avatar_url, () => {
//     console.log('team avatar changed: ', team.value.avatar_url)
//     getAvatar();
// }, {deep: true})

const innerContainer = ref(null);
onClickOutside(innerContainer, () => (visible.value = false));

const hovered = useElementHover(innerContainer);

watch(hovered, (val) => {
    if ($q.platform.is.mobile) return;
    visible.value = val;
});

const clickAvatar = () => {
    if (!props.viewable && !props.invitable && !props.editable) return;
    if (!visible.value && $q.screen.xs) {
        visible.value = true;
    } else if (props.viewable) {
        return navigateTo(`/teams/${team.value.id}`);
    } else if (props.invitable) {
        emit("invite");
    }
    // else if (props.editable) {
    //     emit('edit')
    // }
};
const { getColor } = useColor();

const avatarColor = computed(() => getColor(props.color));
const styleObj = computed(() => {
    if (!props.color) return {};
    return {
        border: `${props.animateRing ? '10' : '6'}px solid ${getColor(props.color)}`,
        transform: `scale(${props.animateRing ? '1.2' : '1.08'})`,
        "box-shadow": "unset",
    };
});
</script>
<script>
export default {
    name: "TeamAvatar",
};
</script>
