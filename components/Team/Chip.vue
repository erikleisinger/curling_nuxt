<template>
        <TeamAvatar :teamId="teamId" class="team-chip__avatar" style="width: 18px" />
       <strong>{{ team.name }}</strong>
</template>
<style lang="scss" scoped>
 .team-chip__avatar {
        display: inline-block;
        height: min-content; 
        transform: translateY(4px); 
        margin-right: 4px
    }
</style>
<script setup>
import Team from "@/store/models/team";
const props = defineProps({
    teamId: Number,
    teamName: String,
    teamAvatar: String,
});

const team = computed(() => useRepo(Team).where("id", props.teamId).first() ?? {
    id: props.teamId,
    name: props.teamName,
    avatar_url: props.teamAvatar
});


</script>
