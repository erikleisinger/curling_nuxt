<template>
    <div
        v-if="avatarType === 'upload' && avatarUrl"
        class="uploaded-avatar__container"
    >
        <q-img :src="avatarUrl" spinner-color="white" height="100%" v-if="avatarUrl"></q-img>
    </div>
    <Avataaar
        v-else-if="avatarType === 'avataaar'"
        v-bind="typeof avatar === 'string' ? parseAvatar(avatar) : avatar"
    />
</template>
<style lang="scss" scoped>
      .uploaded-avatar__container {
        aspect-ratio: 1/1;
        width: calc(100% - 3px);
        margin-top: -0.1em;
        background-color: rgba(0,0,0,0.1);
        border-radius: 50%;
        overflow: hidden;
    }
</style>
<script setup>
import {useStorageStore} from '@/store/storage'
const props = defineProps({
    team: Object,
});

const storage = useStorageStore();

const avatarUrl = computed(() => storage.teamAvatars[props.team.id])

const fetchAvatar = async (path) => {
    storage.getTeamAvatar(props.team.id, path)
};

const avatar = ref(null);
const avatarType = ref("avataaar");

const getAvatar = async () => {
    if (props.team.avatar_type === "upload" && props.team.avatar_url) {
        avatarType.value = "upload";
        fetchAvatar(props.team.avatar_url);
    } else {
        avatar.value = props.team.team_avatar;
    }
};

watch(() => props.team, (val) => {
    if (!val?.avatar_type) return;
    getAvatar();
}, {immediate: true})
</script>
