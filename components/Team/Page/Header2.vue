<template>
    <header class="header__container">
        <div class="underlay">
<q-img
                :src="avatar"
                spinner-color="white"
                height="100%"
                v-if="avatar"
                class="avatar"
              
            ></q-img>
            <div class="mid-underlay"/>
        </div>
        <div class="header--content">
        <div class="full-width players__header">
            <!-- <div class="row justify-start players__container">
                <div
                    class="player-avatar__container"
                    v-for="player in players"
                    :key="player.id"
                >
                    <Avataaar v-bind="parseAvatar(player.avatar)" />
                   
                </div>
               
            </div> -->
            <div />

            <h2>Team</h2>
            <div class="row justify-start players__container reverse">
                <div
                    class="player-avatar__container"
                    v-for="player in players"
                    :key="player.id"
                >
                    <Avataaar v-bind="parseAvatar(player.avatar)" />
                </div>
            </div>
        </div>
        <div class="team-name__container">
            <h1>{{ team.name }}</h1>
        </div>
        </div>
    </header>
</template>
<style lang="scss" scoped>
.header__container {
    padding-bottom: calc(var(--space-lg) + var(--space-sm)) ;
    position: relative;
    overflow: hidden;
    width: 100%;
    .header--content {
        z-index: 1;
        position: relative;
    }
    .players__header {
        display: grid;
        grid-template-columns: 1fr 50px 1fr;
        position: relative;
        .player-avatar__container {
            width: 25px;
            min-width: 25px;
            margin-left: var(--space-xs);
        }
        .players__container {
            position: absolute;
            top: 2px;
            left: 12px;
            flex-wrap: wrap;
            max-width: 42vw;
            &.reverse {
                flex-wrap: wrap;
                right: 12px;
                left: unset;
            }
        }

        h2 {
            font-family: $font-family-header;
            font-size: 24px;
            text-align: center;
            color: white;
        }
    }
    .team-name__container {
        margin-top: -4px;
        h1 {
            font-size: 48px;
            font-family: $font-family-header;
            text-align: center;
            padding: 0px var(--space-md);
            line-height: 44px;
            color: white;
        }
    }

    .underlay {
        bottom: 0;
        position: absolute;
        left: -10%;
        right:0;
        margin: auto;
        height: 175%;
        width: 125%;
        border-radius: 50%;
        z-index: 0;
        left: -12.5%;
        .avatar {
            border-radius: inherit;
        }
        box-shadow: $pretty-shadow;
        .mid-underlay {
            position:absolute;
            height: 100%;
            width: 100%;
            border: 1px solid rgba(0,0,0,0.01);
            background-color: rgba(0,0,0,0.2);
            top: 0;
            border-radius: inherit;;
        }
        border: 4px solid white;
    }
}
</style>

<script setup lang="ts">
import { parseAvatar } from "@/utils/avatar";
import Team from "@/store/models/team";
import TP from "@/store/models/team-player";
import { TEAM_POSITIONS } from "@/constants/team";
import { useQuery } from "@tanstack/vue-query";
const props = defineProps<{
    teamId: number | string;
}>();

const emit = defineEmits(["loaded"]);

const $q = useQuasar();

const { truncateWords } = useText();

const team = computed(() => {
    const t = useRepo(Team).with("players").where("id", props.teamId).first();
    return {
        ...t,
        players: t.players?.filter(({ pivot }) => !pivot.status) ?? [],
    };
});

const { getTeamAvatar } = useAvatar();

const { data: avatar } = getTeamAvatar(props.teamId, {
    enabled: !!team.value,
    select: (val) => {
        emit("loaded");
        return val;
    },
});

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

const requests = computed(() =>
    players.value?.filter(({ status }) => status === "requested")
);

const { user: userId } = useUser();

const hasRequestedToJoin = computed(() =>
    requests.value?.some(({ id }) => id === userId.value)
);

const { getTeamPlayers, isOnTeam } = useTeam();

const { isLoading: isLoadingPlayers } = useQuery({
    queryKey: ["team", "players", props.teamId],
    queryFn: () => getTeamPlayers(props.teamId),
    refetchOnWindowFocus: false,
});
</script>
