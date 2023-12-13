<template>
<div class="team-avatar--badge">
    <q-img
                :src="avatar"
                spinner-color="white"
                height="100%"
                v-if="avatar"
              
            ></q-img>
</div>
</template>
<style lang="scss" scoped>
    .team-avatar--badge {
        border-radius: 12px;
        max-width: 100px;
        width: 100px;
        overflow: hidden;
        aspect-ratio: 2/1;
    }
</style>

<script setup>
const props = defineProps({
    teamId: Number
})
    const { getTeamAvatar } = useAvatar();


const { data: avatar } = getTeamAvatar(props.teamId)
</script>