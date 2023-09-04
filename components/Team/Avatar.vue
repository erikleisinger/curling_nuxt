<template>
    <div class="avatar-outer__container">
        <div
            class="avatar-inner"
            :class="{
                upload: avatarType === 'upload' && avatarUrl,
              
                viewable,
            }"
            @touchstart="clickAvatar"
            ref="innerContainer"
        >
            <div
                class="overlay row justify-center items-center"
                :class="{
                    desktop: $q.platform.is.desktop,
                    visible: viewable && ($q.platform.is.desktop  || visible),
                }"
            >
                <div class="text-white text-bold">View</div>
            </div>
            <div class="ring" :class="className" v-if="loaded" :style="{left: avatarType === 'upload' ? '0' : '0'}"/>
            <div class="ring inner"/>
            <div class="inner-wrap">
                <div v-if="avatarType === 'upload' && avatarUrl">
                    <div
                        v-if="avatarType === 'upload' && avatarUrl"
                        class="uploaded-avatar__container"
                    >
                        <q-img
                            :src="avatarUrl"
                            spinner-color="white"
                            height="100%"
                            v-if="avatarUrl"
                            @load="loaded = true"
                        ></q-img>
                    </div>
                </div>
                <Avataaar
                    v-else-if="avatarType === 'avataaar'"
                    v-bind="
                        typeof avatar === 'string'
                            ? parseAvatar(avatar)
                            : avatar ?? {}
                    "
                />
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.avatar-outer__container {
    position: relative;
    margin-top: -16%;

    .avatar-inner {
        transition: transform 0.3s;
        position: relative;

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
                // opacity: 0;
            }
        }
        .ring {
            aspect-ratio: 1/1;
            z-index: 0;
            width: 100%;
            box-sizing: border-box;
            position: absolute;
            border: 8px solid;
          
            bottom: 0;
            transform: scale(1.1);
            border-radius: 50%;
            opacity: 1;

            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            &.inner {
                transform: scale(1.02);
                border:1px solid rgba(255,255,255,0.0);
            }

            &.dummy {
                border-color: $grey-5;
                background-color: $grey-5;
            }
            &.user-team {
                border-color: $blue-6;
                background-color: $blue-6;
            }
            &.non-user-team {
                border-color: $amber;
                background-color: $amber;
            }
        }
    }
}
.uploaded-avatar__container {
    aspect-ratio: 1/1;
    width: 100%;
    margin-top: -0.1em;
    background-color: rgba(0, 0, 0, 0.1);
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
</style>
<script setup>
import { useStorageStore } from "@/store/storage";
import { useUserTeamStore } from "@/store/user-teams";
import { onClickOutside } from "@vueuse/core";
const props = defineProps({
    team: Object,
    viewable: {
        type: Boolean,
        default: true,
    },
});

const storage = useStorageStore();

const $q = useQuasar();

const visible = ref(false);


const avatarUrl = computed(() => storage.teamAvatars[props.team.id]);

const fetchAvatar = async (path) => {
    storage.getTeamAvatar(props.team.id, path);
};

const avatar = ref(null);
const avatarType = ref(props.team.avatar_type || 'avataaar');
const loaded = ref(avatarType.value === 'avataaar')

const getAvatar = async () => {
    if (avatarType.value === "upload" && props.team.avatar_url) {
      
        fetchAvatar(props.team.avatar_url);
    } else {
        avatar.value = props.team.team_avatar;
    }
};

let className;

watch(
    () => props.team,
    (val) => {
        if (!val?.avatar_type) {
            avatar.value = null;
            avatarType.value = "avataaar";
            
        } else {
            avatarType.value = val.avatar_type
   getAvatar();
        }
     
        className = !props.team?.id
    ? "dummy"
    : useUserTeamStore().userTeams.some(({ id }) => props.team.id === id)
    ? "user-team"
    : "non-user-team";

        
    },
    { immediate: true }
);



const innerContainer = ref(null);
onClickOutside(innerContainer, () => (visible.value = false));

const clickAvatar = () => {
    if (!props.viewable) return;
    if (!visible.value) {
        visible.value = true;
    } else {
        return navigateTo(`/teams/${props.team.id}`);
    }
};
</script>
