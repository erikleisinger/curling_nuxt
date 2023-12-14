<template>
    <div>
        <div class="full-width row justify-between items-center">
            <q-input
                dense
                class="col-grow q-pl-sm"
                label="Search by opposition, rink, or date"
                v-model="searchInput"
                clearable
            >
                <template v-slot:prepend>
                    <q-icon name="search"></q-icon>
                </template>
            </q-input>
            <q-btn flat round icon="sort">
                <q-menu>
                    <q-item
                        clickable
                        v-ripple
                        @click="onClickSort('Date')"
                        :active="!!sortDateOrder"
                    >
                        <q-item-section no-wrap>Sort by date</q-item-section>
                        <q-item-section avatar>
                            <q-icon
                                :name="
                                    sortDateOrder === 'asc'
                                        ? 'keyboard_arrow_up'
                                        : 'keyboard_arrow_down'
                                "
                            ></q-icon>
                        </q-item-section>
                    </q-item>
                    <q-item
                        clickable
                        v-ripple
                        @click="onClickSort('Opponent')"
                        :active="!!sortOpponentOrder"
                    >
                        <q-item-section no-wrap
                            >Sort by opponent</q-item-section
                        >
                        <q-item-section avatar>
                            <q-icon
                                :name="
                                    sortOpponentOrder === 'asc'
                                        ? 'keyboard_arrow_up'
                                        : 'keyboard_arrow_down'
                                "
                            ></q-icon>
                        </q-item-section>
                    </q-item>
                </q-menu>
            </q-btn>
            <q-btn flat round icon="o_filter_alt">
                <q-badge floating left class="filter-badge" v-if="colorFilter.length" rounded color="blue">
                    {{colorFilter.length}}
                </q-badge>
                <q-menu>
                    <q-item
                        clickable
                        v-ripple
                        @click="toggleColorFilter('yellow')"
                        :active="colorFilter.includes('yellow')"
                       
                    >
                        <q-item-section no-wrap avatar>
                            <RockDraggable
                                :draggable="false"
                                color="yellow"
                                width="1.5em"
                        /></q-item-section>
                        <q-item-section no-wrap>
                            Filter by yellow
                        </q-item-section>
                    </q-item>
                    <q-item
                        clickable
                        v-ripple
                        @click="toggleColorFilter('blue')"
                        :active="colorFilter.includes('blue')"
                      
                    >
                        <q-item-section no-wrap avatar>
                            <RockDraggable
                                :draggable="false"
                                color="blue"
                                width="1.5em"
                        /></q-item-section>
                        <q-item-section no-wrap>
                            Filter by blue
                        </q-item-section>
                    </q-item>
                    <q-item
                        clickable
                        v-ripple
                    @click="toggleColorFilter('red')"
                        :active="colorFilter.includes('red')"
                      
                    >
                        <q-item-section no-wrap avatar>
                            <RockDraggable
                                :draggable="false"
                                color="red"
                                width="1.5em"
                        /></q-item-section>
                        <q-item-section no-wrap>
                            Filter by red
                        </q-item-section>
                    </q-item>
                </q-menu>
            </q-btn>
        </div>
        <div class="loading-container" v-if="isLoading">
            <q-inner-loading :showing="true" color="primary" />
        </div>
        <div v-if="gamesPaginated.length">
            <div
                v-for="(game, index) in gamesPaginated"
                :key="game.id"
                class="result__container"
            >
                <TeamGameResult
                    :gameId="game.id"
                    :notify="canVerify(game)"
                    :authorized="
                        !!isAuthorized(
                            game.teams.find(({ team_id }) => team_id === teamId)
                                ?.team_id
                        )
                    "
                    @invite="inviteTeam($event, game)"
                    :home="teamId"
                    :search="searchInput"
                    :viewHome="false"
                >
                    <!-- Verification -->
                    <template
                        v-slot:actions
                        v-if="
                            canVerify(game) ||
                            isAuthorized(game.teams[0]?.team_id)
                        "
                    >
                        <q-fab-action
                            v-if="canVerify(game)"
                            color="white"
                            text-color="primary"
                            icon="verified"
                            @click="
                                respondToRequest(
                                    game.id,
                                    true,
                                    index,
                                    game.teams[1]?.team_id
                                )
                            "
                            >Verify game</q-fab-action
                        >
                        <q-fab-action
                            v-if="canVerify(game)"
                            color="white"
                            text-color="red"
                            icon="new_releases"
                            @click="respondToRequest(game.id, false, index)"
                            >Reject game</q-fab-action
                        >
                        <q-fab-action
                            v-if="
                                isAuthorized(game.home_id) &&
                                requiresVerification(game)
                            "
                            color="white"
                            text-color="red"
                            icon="new_releases"
                            @click="cancelRequest(game)"
                            >Cancel verification request</q-fab-action
                        >
                    </template>
                    <template v-slot:before>
                        <div
                            class="game-request-response__container row items-center no-wrap"
                        ></div>
                    </template>
                </TeamGameResult>
            </div>
        </div>
        <div v-if="!gamesPaginated.length" class="no-games__container">
            No games were found.
        </div>
        <div
            class="show-more__container row justify-center items-center"
            v-if="cursor < gamesFiltered.length"
        >
            <q-btn
                text
                outline
                flat
                color="blue"
                @click="showMore"
                :loading="loadingMore"
                v-ripple
                >Show more</q-btn
            >
        </div>
    </div>
</template>
<style lang="scss" scoped>
.filter-badge {
    right: 4px;
    bottom: 0;
    top: unset;
}
.no-games__container {
    padding: var(--space-md);
    margin-right: auto;
    margin-left: auto;
    text-align: center;
}
.loading-container {
    min-height: 100px;
    position: relative;
}
.show-more__container {
    padding: var(--space-sm);
}
.result__container {
    padding-top: var(--space-xs);
}
</style>
<script setup>
import { useUserTeamStore } from "@/store/user-teams";
import { useNotificationStore } from "@/store/notification";
import { useThrottleFn } from "@vueuse/core";
import { vElementVisibility } from "@vueuse/components";
import { isPlaceholder } from "@/utils/team";
import GameTeam from "@/store/models/game-team";
import Game from "@/store/models/game";
import Team from "@/store/models/team";
import Rink from "@/store/models/rink";
import { useQuery } from "@tanstack/vue-query";

const props = defineProps({
    teamId: Number,
    filterOpposition: {
        type: Array,
        default: [],
    },
});

const initialized = ref(false);

const totalGames = computed(() => games.value.length);

const cursor = ref(3);

const loadingMore = ref(false);

const showMore = async () => {
    loadingMore.value = true;
    setTimeout(() => {
        if (cursor.value + 3 > totalGames.length) {
            cursor.value = totalGames.length;
        } else {
            cursor.value += 3;
        }
        loadingMore.value = false;
    }, 20);
};

// order functions

const { sortAlphabetically } = useSort();
const orderByOpponent = (a, b) => {
    const aName = a.teams.find((t) => t.team.id !== props.teamId)?.team.name;
    const bName = b.teams.find(({ team }) => team.id !== props.teamId)?.team
        .name;
    return sortAlphabetically(aName, bName, sortOpponentOrder.value === "asc");
};

const orderByDate = (a, b) => {
    if (a.start_time > b.start_time) {
        return sortDateOrder.value === "asc" ? 1 : -1;
    } else if (b.start_time > a.start_time) {
        return sortDateOrder.value === "asc" ? -1 : 1;
    }
    return 0;
};

const searchInput = ref(null);
const { toTimezone } = useTime();

const gamesFiltered = computed(() => {
    return [...games.value].filter((game) => {
        if (searchInput.value) {
        const regex = new RegExp(searchInput.value.toLowerCase());
        const searched = (
            regex.test(game.teams[0].team.name.toLowerCase()) ||
            regex.test(game.teams[1]?.team?.name?.toLowerCase()) ||
            regex.test(game.rink?.name?.toLowerCase()) ||
            regex.test(toTimezone(game.start_time).toLowerCase())
        );
        if (!searched) return false;
        }

        if (colorFilter.value.length) {
            const {teams} = game;
            const myTeam = teams.find(({team_id}) => team_id === props.teamId)
            return colorFilter.value.includes(myTeam.color)
        }
        return true;

        
    });
});
const gamesPaginated = computed(() =>
    [...gamesFiltered.value].splice(0, cursor.value)
);

const games = computed(() => {
    if (isLoading.value) return [];

    const t =
        useRepo(Game)
            .query()
            .withAllRecursive()

            .whereHas("teams", (q) => {
                return q.whereIn("team_id", [props.teamId]);
            })
            .whereHas("teams", (q) => {
                return q.whereIn("team_id", [
                    ...(props.filterOpposition?.length ? [] : [props.teamId]),
                    ...props.filterOpposition,
                ]);
            })
            .orderBy("start_time", "desc")
            .get() ?? [];
    return t
        .map((game) => ({
            ...game,
            rink: useRepo(Rink).where("id", game.rink_id).first(),
        }))
        .sort(
            sortOpponentOrder.value
                ? orderByOpponent
                : sortDateOrder.value
                ? orderByDate
                : () => 1
        );
});

const { getGames } = useGame();

const { isLoading } = useQuery({
    queryKey: ["team", "games", props.teamId],
    queryFn: () =>
        getGames({
            team_id_param: props.teamId,
            game_id_param: null,
        }),
    refetchOnWindowFocus: false,
});

const confirmUnsaved = ref(false);

const requiresVerification = (game) => {
    const awayTeam =
        game.teams.find(({ team_id }) => team_id !== props.teamId) ?? {};
    if (awayTeam.pending) return true;
    return isPlaceholder(awayTeam.team_id, game.id);
};

const canVerify = (game) => {
    return (
        requiresVerification(game) &&
        isAuthorized(
            game.teams.find(({ team_id }) => team_id !== props.teamId)?.team_id
        )
    );
};

const responding = ref(false);

const respondToRequest = useThrottleFn(
    async (gameId, accepted, index, teamId) => {
        const notStore = useNotificationStore();
        const notId = notStore.addNotification({
            text: accepted ? "Verifying game..." : "Rejecting game...",
            state: "pending",
        });
        responding.value = true;
        let updates;
        try {
            if (accepted) {
                await acceptRequest(gameId, teamId);
                // updates = {
                //     verified: true,
                //     away: teamId,
                // };
            } else {
                await declineRequest(gameId, teamId);
                // updates = {
                //     away: null,
                //     verified: false,
                // };
            }
        } catch (e) {
            notStore.updateNotification(notId, {
                state: "failed",
                text: `Error occured when ${
                    accepted ? "verifying" : "rejecting"
                } game (code: ${e.code})`,
            });
        }

        // const { data: updated } = await useSupabaseClient()
        //     .from("game_team_junction")
        //     .update(updates)
        //     .eq("id", gameId)
        //     .select("verified,away")
        //     .single();
        // const newGame = {
        //     ...games.value[index],
        //     verified: updated.verified,
        //     away_id: updated.away,
        // };
        // games.value[index] = newGame;
        responding.value = false;
        notStore.updateNotification(notId, {
            state: "completed",
            text: `Game result ${accepted ? "verified!" : "rejected."}`,
        });
    },
    1000
);

const acceptRequest = async (game_id, team_id) => {
    const { data, errors } = await useSupabaseClient()
        .from("game_team_junction")
        .update({
            team_id,
            game_id,
            pending: false,
        })
        .eq("game_id", game_id)
        .eq("team_id", team_id)
        .select("pending");
    if (errors) throw new Error(errors);

    const [updates] = data;
    useRepo(GameTeam)
        .where("team_id", team_id)
        .where("game_id", game_id)
        .update(updates);
};

const declineRequest = async (game_id, team_id) => {
    await useSupabaseClient()
        .from("game_team_junction")
        .delete()
        .eq("game_id", game_id)
        .eq("team_id", team_id);
};

const isAuthorized = (teamId) => {
    return useUserTeamStore().userTeams.some(
        ({ id, is_admin }) => id === teamId
    );
};

const inviteTeam = async (team, game) => {
    if (!team?.id || !game?.id || !isAuthorized(team?.id)) return;
    const notStore = useNotificationStore();

    const notId = notStore.addNotification({
        text: "Inviting team to verify game...",
        state: "pending",
    });
    const homeId = game.teams.find(
        ({ team_id }) => team_id === props.teamId
    )?.team_id;
    const { data, errors } = await useSupabaseClient()
        .from("game_team_junction")
        .update({ team_id: team.id, game_id: game.id, pending: true })
        .eq("game_id", game.id)
        .is("team_id", null)
        .select(`*`);
    if (errors) return;
    const [updates] = data;
    const { created_at, ...newGameTeam } = updates;
    useRepo(GameTeam)
        .where("team_id", updates.game_id + 100000000)
        .delete();
    useRepo(GameTeam).save(newGameTeam);

    if (errors) {
        notStore.updateNotification(notId, {
            text: `Error inviting ${team.name} (code ${errors.code})`,
            state: "failed",
        });
        return;
    }

    useRepo(GameTeam).where("id", 20).update({ avatar_type: "avataaar" });

    notStore.updateNotification(notId, {
        text: `${team.name} was invited to verify the game.`,
        state: "completed",
    });
};

const cancelRequest = async (game) => {
    if (!game?.id) return;
    const notStore = useNotificationStore();

    const notId = notStore.addNotification({
        text: `Cancelling invitation to ${game.away_name}...`,
        state: "pending",
    });
    const { data, error } = await useSupabaseClient()
        .from("games")
        .update({ away: null })
        .eq("id", game.id).select(`
    placeholder_away,
    verified
    `);

    const [updatedGame] = data;

    if (error || !updatedGame) {
        notStore.updateNotification(notId, {
            text: `Error cancelling invitation to ${game.away_name} (code ${error.code})`,
            state: "failed",
        });
        return;
    }

    const index = games.value.findIndex(({ id }) => id === game.id);
    if (index !== -1)
        games.value.splice(index, 1, {
            ...games.value[index],
            away_id: updatedGame.away?.id,
            away_avatar_type: null,
            away_avatar_url: null,
            away_avatar: null,
            away_name: updatedGame.placeholder_away,
            verified: updatedGame.verified,
        });
    notStore.updateNotification(notId, {
        text: `Invitation to ${game.away_name} was cancelled.`,
        state: "completed",
    });
};

const sortDateOrder = ref(null);
const sortOpponentOrder = ref(null);

const onClickSort = (type) => {
    const typeKey = `sort${type}Order`;
    const sortTypes = {
        sortDateOrder: sortDateOrder,
        sortOpponentOrder: sortOpponentOrder,
    };
    Object.keys(sortTypes)
        .filter((key) => key !== typeKey)
        .forEach((key) => {
            sortTypes[key].value = null;
        });

    const steps = [null, "desc", "asc"];

    if (sortTypes[typeKey].value === "asc") {
        sortTypes[typeKey].value = null;
    } else {
        const index = steps.indexOf(sortTypes[typeKey].value);
        sortTypes[typeKey].value = steps[index + 1];
    }
};

const colorFilter = ref([]);
const toggleColorFilter = (color) => {
    const index = colorFilter.value.indexOf(color)
    if (index !== -1) {
        colorFilter.value.splice(index, 1)
    } else {
        colorFilter.value.push(color)
    }
}
</script>
