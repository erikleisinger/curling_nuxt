<template>
    <span
        class="team-chip__container"
        color="transparent"
        dense
        clickable
    >
        <TeamAvatar :teamId="teamId" class="team-chip__avatar" />
        <span>{{ team.name }}</span>


    </span>
</template>
<style lang="scss" scoped>
.team-chip__container {
    // border: 1px solid black;
    width: min-content;
    white-space: nowrap;
    display: inline-flex;
    flex-wrap: nowrap;
    align-items: center;
   
    border-radius: 12px;
    font-size: 1em;
    font-weight: bold;
    margin-bottom: -12px;
    transform: translateY(5px);
    .team-chip__avatar {
        width: 18px;
        margin-top: -2px;
        margin-right: 4px;
    }
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
