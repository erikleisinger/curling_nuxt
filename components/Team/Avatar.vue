<template>
    <div class="avatar-outer__container " :class="{clickable: 'viewable'}" >
        <div
            class="avatar-inner"
            :class="{
                upload: avatarType === 'upload',

                viewable,
            }"
            :style="{height: teamId === null ? '100%' : 'unset'}"
            @click="clickAvatar"
            ref="innerContainer"
        >
            <div
                class="overlay row justify-center items-center"
                :class="{
                    desktop: $q.platform.is.desktop,
                    visible: (viewable || invitable || editable) && ($q.platform.is.desktop || visible),
                }"
            >
                <div class="text-white text-bold" v-if="!editable">
                    {{invitable ? 'Invite' : 'View'}}
                </div>
                
                <q-icon v-else name="edit" color="white" size="md"/>
            </div>
            <div
                class="ring"
                :class="className"
                v-if="loaded"
                :style="{ left: avatarType === 'upload' ? '0' : '0', ...styleObj }"
            />
           
            <div class="inner-wrap">

                <UploaderDraft v-if="editable && visible" style="z-index: 10" @upload="emit('update', $event)" :emitOnly="create"/>
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
                    v-bind="team.team_avatar
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
    height: 100%;

    .avatar-inner {
        transition: transform 0.3s;
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
            border:3px solid rgba(0,0,0,0.1);
            box-shadow: $pretty-shadow-2;

            bottom: 0;
            transform: scale(1.02);
            border-radius: 50%;
            opacity: 1;

            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
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
import { onClickOutside, useElementHover } from "@vueuse/core";
import Team from '@/store/models/team'
const props = defineProps({
    color: String,
    create: Boolean,
    editable: Boolean,
    invitable: Boolean,
    teamId: Number,
    viewable: Boolean,
});

const emit = defineEmits(['edit', 'invite', 'update'])


const team = computed(() => useRepo(Team).where('id', props.teamId).first() ?? {})

const storage = useStorageStore();

const $q = useQuasar();

const visible = ref(false);


const avatarUrl = computed(() => storage.teamAvatars[team.value.id]);

const avatarType = computed(() => {
    if (team.value.avatar_type === 'upload') {
        return team.value.avatar_url ? 'upload' : 'avataaar'
    }
    return team.value.avatar_type ?? 'avataaar'
})

const fetchAvatar = async (path) => {
    storage.getTeamAvatar(team.value.id, path);
};

const avatar = ref(null);
const loaded = ref(true)


const getAvatar = async () => {
    if (team.value.avatar_type === "upload" ) {
        if (team.value.avatar_url) {
fetchAvatar(team.value.avatar_url);
        } else {
            team.value.avatar_type = 'avataaar';
            avatar.value = {}
        }
        
    } else {
        avatar.value = team.value.team_avatar;
    }
};

onMounted(() => {
    getAvatar();
})

const className = ref('dummy')

const innerContainer = ref(null);
onClickOutside(innerContainer, () => (visible.value = false));

const hovered = useElementHover(innerContainer)

watch(hovered, (val) => {
    if($q.platform.is.mobile) return;
    visible.value = val;
})

const clickAvatar = () => {
    if (!props.viewable && !props.invitable && !props.editable) return;
    if (!visible.value && $q.screen.xs) {
        visible.value = true;
} else if (props.viewable) {
        return navigateTo(`/teams/${team.value.id}`);
    } else if (props.invitable) {
        emit('invite')
    } 
    // else if (props.editable) {
    //     emit('edit')
    // }
};
const {getColor} = useColor()
const styleObj = computed(() => {
    if (!props.color) return {};
    return {
        border: `6px solid ${getColor(props.color)}`,
        transform: 'scale(1.08)',
        'box-shadow': 'unset'
    }
})
</script>
<script>
export default {
    name: 'TeamAvatar'
}
</script>

