<template>
    <header class="team-profile__header">
      
        <div class="team-profile-picture--shadow" />
        <div class="team-profile-picture">
            
            <div class="team-players__wrap row justify-end">
                <Avataaar
                    v-for="player in team.players"
                    :key="player.id"
                    v-bind="player.avatar"
                    class="player-avatar"
                />
            </div>
            <q-img
                :src="avatar"
                spinner-color="white"
                height="100%"
                v-if="avatar"
            ></q-img>
            <h1 class="team-name">
                <span>{{ team.name }}</span>
            </h1>
        </div>

    </header>
</template>
<style lang="scss">
$offset: var(--space-sm);
$border-radius: 16px;
.team-profile__header {
    margin-right: auto;
    margin-left: auto;

    aspect-ratio: 3/2;
    position: relative;

    margin-top: var(--space-xs);

    @include sm {
        aspect-ratio: 3/1;
        margin: var(--space-sm);
        margin-top: var(--space-md);
    }



    .team-profile-picture,
    .team-profile-picture--shadow {
        width: calc(100% - $offset * 2);
        aspect-ratio: 3/2;
        @include sm {
            aspect-ratio: 3/1;
        }

        border-radius: $border-radius;
    }
    .team-profile-picture {
        margin-left: calc($offset * 1.5);
        position: relative;
        z-index: 1;
        position: relative;
        box-shadow: $pretty-shadow;
        .q-img {
            border-radius: inherit;
        }
        .team-name {
            position: absolute;
            bottom: 0;
            font-weight: bold;
            background-color: rgba(0, 0, 0, 0.5);
            border-bottom-left-radius: $border-radius;
            border-top-right-radius: $border-radius;
            padding: 0px var(--space-xs);
            span {
                color: #fff;
            }
        }

        .team-players__wrap {
            position: absolute;
            top: 0;
            right: 0;
            height: 50px;
            width: 100%;
            z-index: 2;
            padding: 0px var(--space-sm);
            .player-avatar {
                width: 30px;
                margin-left: var(--space-sm);
            }
        }
    }
    .team-profile-picture--shadow {
        background-color: rgba(0, 0, 0, 0.1);
        position: absolute;
        top: $offset;
        z-index: 0;
        left: calc($offset * 0.5);
        box-sizing: border-box;
        box-shadow: $pretty-shadow;
    }
}
</style>
<script setup lang="ts">
import Team from "@/store/models/team";
import TP from "@/store/models/team-player";
import { TEAM_POSITIONS } from "@/constants/team";
import { useQuery} from '@tanstack/vue-query'
const props = defineProps<{
    teamId: number | string;
}>();



const team = computed(() => {
    const t = useRepo(Team).with("players").where("id", props.teamId).first()
    return {
        ...t,
        players: t.players?.filter(({pivot}) => !pivot.status) ?? []
    };
});

const { getTeamAvatar } = useAvatar();


const { data: avatar } = getTeamAvatar(props.teamId, {
    enabled: !!team.value
})



const players = computed(() => {
    const p = useRepo(TP).with("player").where("team_id", props.teamId).get();
    return p
        .map(({ player, status, position }) => ({
            ...player,
            status,
            position,
        }))
        .sort((a, b) => {
            return (
                TEAM_POSITIONS[b.position]?.sortOrder ??
                -1 - TEAM_POSITIONS[a.position]?.sortOrder ??
                -1
            );
        });
});
    const { getTeamPlayers } = useTeam();
const { isOnTeam } = useTeam();
const {isLoading} = useQuery({
    queryKey: ['team', 'players', props.teamId],
    queryFn: () => getTeamPlayers(props.teamId, isOnTeam(props.teamId)),
    refetchOnWindowFocus: false,
})



</script>
<script lang="ts">
export default {
    name: "TeamHeader",
};
</script>
