<template>
    <div v-for="team in teams" :key="team.team_id" class="player-team__container row items-center justify-between" @click="navigateTo(`/teams/${team.team_id}`)">
        <div class="row items-center">
        <div class="player-team-avatar__container">
            <TeamAvatar :teamId="team.team_id"/>
        </div>
        <div>
            <h4>{{team?.team?.name}}</h4>
            <h5 class="text-caption">{{team?.position ? TEAM_POSITIONS[team.position].name : 'Member'}}</h5>
        </div>
        </div>

    </div>
</template>
<style lang="scss" scoped>
.player-team__container {
    cursor: pointer;
    padding: var(--space-xs);
    border-radius: 8px;
    background-color: white;
    box-shadow: $pretty-shadow;
    margin-bottom: var(--space-xs);
    transition: transform 0.2s;
    &:hover {
        background-color: $app-mint;
        color: white;
        transform: scale(1.05);
    }
  .player-team-avatar__container {
        width: 50px;
        margin-right: var(--space-sm);
    }
    h4 {
        line-height:1;
    }
    h5 {
        font-family: $font-family-secondary;
        line-height: 1;
    }
}
  
</style>
<script setup>
    import TeamPlayer from '@/store/models/team-player';
    import Team from '@/store/models/team';
    import {useQuery} from '@tanstack/vue-query'
    import {TEAM_POSITIONS} from '@/presentation/constants/team'

    const props = defineProps({
        playerId: String
    })

    const emit = defineEmits(['loaded'])

const {sortAlphabetically} = useSort()
    const teams = computed(() =>
    useRepo(TeamPlayer)
        .with("team")
        .where("player_id", props.playerId)
        .get()
        // .map(({ team }) => team)
        .sort((a, b) => sortAlphabetically(a.team?.name, b.team?.name))
);

const getPlayerTeams = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("team_profile_junction")
        .select(
            `
        id,
        team:team_id (
            id,
            name,
            avatar_url,
            rink_id
        )
        `
        )
        .eq("profile_id", props.playerId);
    const teams = data.filter(({ team }) => !!team).map(({ team }) => team);
    useRepo(Team).save(teams);
    useRepo(TeamPlayer).save(
        teams.map((t) => ({
            team_id: t.id,
            player_id: props.playerId,
        }))
    );
    return teams;
};

const { isLoading: isLoadingTeams } = useQuery({
    queryKey: ["player", "teams", props.playerId],
    queryFn: getPlayerTeams,
    select: (val) => {
        emit('loaded')
        return val
    }
});
</script>
<script>
export default {
    name: 'PlayerTeams'
}
</script>