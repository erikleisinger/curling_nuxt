<template>
    <div>
        <div class="full-width row justify-between items-center ">
            <q-input
                dense
                class="col-grow q-pl-sm"
                label="Search by opponent, rink, or date"
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
            <q-inner-loading :showing="true"  />
        </div>
        <div v-if="gamesPaginated.length" class="q-mt-md">
            <div
                v-for="(game, index) in gamesPaginated"
                :key="game.id"
                class="result__container"
            >
            <div class="text-caption full-width text-center row items-center justify-center" style="padding: 0px 20px">
                <!-- <div/> -->
                <div>{{ toTimezone(game.start_time, "MMM D, YYYY") }}</div>
                <!-- <div  ><q-chip dense color="blue" text-color="white">
                    RCC
                    </q-chip>
                </div> -->
            </div>
                <TeamGameResult2
                    :gameId="game.id"
                    :home="teamId"
                    :search="searchInput"
                    :viewHome="false"
              />
            </div>
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
:deep(.q-inner-loading) {
    .q-spinner {
        color: $app-mint!important;
    }
}
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
    // padding-top: var(--space-xs);
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

const getGames = async () => {
    const client = useSupabaseClient();
    const {data} = await client.from('game_scores').select(`
        team:team_id(
            id,
            name,
            avatar_url
        ),
        pending,
        game_id,
        color,
        placeholder,
        points_scored

    `).eq('team_id', props.teamId)

    data.forEach((gameTeam) => {
        const {team, game_id, points_scored, color, placeholder} = gameTeam;
        useRepo(Game).save({
            id: game_id
        })
        useRepo(Team).save(team)
        useRepo(GameTeam).save({
            team_id: team?.id,
            game_id,
            points_scored,
            color,
            placeholder

        })

    })
    return data;
}

const { isLoading } = useQuery({
    queryKey: ["team", "games", props.teamId],
    queryFn: getGames,
        
    refetchOnWindowFocus: false,
});

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
