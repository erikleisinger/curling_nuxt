<template>
    <header class="header__container" ref="header">
        <div class="underlay" ref="underlay">
            <q-img
                :src="avatar"
                spinner-color="white"
                v-if="avatar"
                class="avatar"
                position="50% 50%"
                fit="cover"
                :style="{height: `${headerHeight}px`}"
            ></q-img>
            <div class="mid-underlay" />
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
    padding-bottom: calc(var(--space-lg) + var(--space-sm));
    position: relative;
    width: 100%;
    @include sm {
        min-height: 250px;
    }
    @include md {
        min-height: 300px;
    }
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
            margin-left: var(--space-xs);
            @include sm {
                width: 40px;
            }
            @include md {
                width: 50px;
            }
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
            @include smmd-text;
            text-align: center;
            color: white;
        }
    }
    .team-name__container {
        margin-top: -4px;
        min-height: 100px;
        
        display: flex;
        align-items: center;
        justify-content: center;
        h1 {
           
            font-family: $font-family-header;
            text-align: center;
            padding: 0px var(--space-md);
            
            color: white;

            margin: auto;
            @include lg-text;
           
        }
    }

    .underlay {
        bottom: 0;
        position: absolute;
        left: -10%;
        right: 0;
        margin: auto;
        // height: 200%;
        aspect-ratio: 1/1;
        width: 150%;
        @include md {
            width: 110%;
            left: -5%;
        }

        border-radius: 50%;
        z-index: 0;
        left: -25%;
        overflow: hidden;
        .avatar {
            position: absolute;
            height: 50%;
            width: 100%;
            bottom: 0;
        }
        box-shadow: $pretty-shadow;
        .mid-underlay {
            position: absolute;
            height: 100%;
            width: 100%;

            border: 5px solid white;
            background-color: rgba(0, 0, 0, 0.3);
            top: 0;
            border-radius: inherit;
        }
        // border: 5px solid white;
    }
}
</style>

<script setup lang="ts">
import { parseAvatar } from "@/utils/avatar";
import {useElementSize, useElementBounding} from '@vueuse/core'
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

const underlay = ref(null);
const {width: underlayWidth} = useElementSize(underlay);

const header = ref(null)
const {height:headerHeight} = useElementBounding(header)
// const left = computed(() => `${-1 * (underlayWidth.value / 2)}px`)
</script>
