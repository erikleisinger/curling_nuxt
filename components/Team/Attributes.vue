<template>
    <div class="row justify-between">
        <TeamAttribute
            title="Games played"
            color="primary"
            class="col-5"
            v-memo="[team?.games_played, team.games_played, loading]"
            :loading="loading"
        >
            <div class="row no-wrap items-center">
                <div>
                    {{ team.games_played }}
                </div>
                <!-- <h2
                    class="text-xs text-underline clickable q-pl-sm"
                    style="margin-top: 1px"
                >
                    Browse
                </h2> -->
            </div>
        </TeamAttribute>
        <TeamAttribute
            title="Win %"
            color="amber"
            class="col-5"
            showPercent
            :percent="getStatPercent(team.win, team.games_played)"
            :loading="loading"
        >
            <span v-if="team.games_played">
                {{ getStatPercent(team.win, team.games_played) }}%
            </span>
            <span v-else>-</span>
            <template v-slot:extra>
                <span class="text-regular text-grey-8" v-if="team.tie"
                    >({{ getStatPercent(team.tie, team.games_played) }}%
                    tie)</span
                >
            </template>
        </TeamAttribute>
        <TeamAttribute title="Points per game" color="blue" class="col-5" :loading="loading">
            <span v-if="team.games_played">
                {{
                    `${
                        team.points_for / team.games_played -
                            team.points_against / team.games_played >
                        0
                            ? "+"
                            : ""
                    }${(
                        team.points_for / team.games_played -
                        team.points_against / team.games_played
                    ).toFixed(1)}`
                }}
                <!-- <span class="text-xs text-regular text-grey-8">{{
                    `(${(team.points_for / team.games_played).toFixed(1)} - ${(
                        team.points_against / team.games_played
                    ).toFixed(1)})`
                }}</span> -->
            </span>
            <span v-else>-</span>
        </TeamAttribute>
        <TeamAttribute title="Ends per game" color="blue" class="col-5" :loading="loading">
            <span v-if="team.games_played">
                {{
                    `${
                        team.ends_for / team.games_played -
                            team.ends_against / team.games_played >
                        0
                            ? "+"
                            : ""
                    }${(
                        team.ends_for / team.games_played -
                        team.ends_against / team.games_played
                    ).toFixed(1)}`
                }}
                <!-- <span class="text-xs text-regular text-grey-8">{{
                    `(${(team.ends_for / team.games_played).toFixed(1)} - ${(
                        team.ends_against / team.games_played
                    ).toFixed(1)})`
                }}</span> -->
            </span>
            <span v-else>-</span>
        </TeamAttribute>
        <!-- <TeamAttribute title="Hammer efficiency"   class="col-5" showPercent :percent="getStatPercent(team.hammer_conversion_count, (team.hammer_end_count - team.hammer_blank_count))" clickable>
            {{getStatPercent(team.hammer_conversion_count, (team.hammer_end_count - team.hammer_blank_count))}}%
        </TeamAttribute>
           <TeamAttribute title="Steal efficiency"   class="col-5" showPercent :percent="getStatPercent(team.non_hammer_steal_count, team.non_hammer_end_count)" clickable>
            {{getStatPercent(team.non_hammer_steal_count, team.non_hammer_end_count)}}%
        </TeamAttribute>
            <TeamAttribute title="Force efficiency"   class="col-5" showPercent :percent="getStatPercent(team.non_hammer_force_count, (team.non_hammer_end_count - team.non_hammer_blank_count))" clickable>
            {{getStatPercent(team.non_hammer_force_count, (team.non_hammer_end_count - team.non_hammer_blank_count))}}%
        </TeamAttribute>
                <TeamAttribute title="Steal defense"   class="col-5" showPercent :percent="getStatPercent(team.hammer_steal_count, (team.hammer_end_count - team.hammer_blank_count))" clickable>
            {{getStatPercent(team.hammer_steal_count, (team.hammer_end_count - team.hammer_blank_count))}}%
        </TeamAttribute>
                     <TeamAttribute title="Hammer in first"   class="col-5" showPercent :percent="getStatPercent(team.hammer_first_end_count, team.games_played)" clickable>
            {{getStatPercent(team.hammer_first_end_count, team.games_played)}}%
        </TeamAttribute>
                            <TeamAttribute title="Hammer in last"   class="col-5" showPercent :percent="getStatPercent(team.hammer_last_end_count, team.games_played)" clickable>
            {{getStatPercent(team.hammer_last_end_count, team.games_played)}}%
        </TeamAttribute> -->
    </div>
</template>
<script setup>
import TeamStats from "@/store/models/team-stats";
import Game from "@/store/models/game";

const { getStatPercent } = useConvert();

const props = defineProps({
    loading: Boolean,
    opponentId: Number,
    teamId: Number,
});

const $q = useQuasar();

const team = computed(() => {
    if (!props.opponentId)
        return useRepo(TeamStats)
            .where("team_id", props.teamId)
            .whereIn("game_id", 0)
            .first();

    const allStats = useRepo(TeamStats)
        .where("team_id", props.teamId)
        .where("game_id", (val) => val !== 0)
        .get();

    const games = useRepo(Game)
        .with("teams")
        .whereIn(
            "id",
            allStats.map(({ game_id }) => game_id)
        )
        .whereHas("teams", (query) => {
            query.whereIn("team_id", props.opponentId);
        })
        .get()
        .map(({ id }) => id);

    const filteredStats = useRepo(TeamStats)
        .where("team_id", props.teamId)
        .whereIn("game_id", games)
        .get();

    const stats = filteredStats.reduce((all, current) => {
        const allClone = { ...all };
        Object.keys(filteredStats[0])
            .filter((key) => {
                const exclude = ["start_time", "team_id", "color"];
                return !exclude.includes(key);
            })
            .forEach((key) => {
                if (!allClone[key]) allClone[key] = 0;
                allClone[key] += current[key];
            });
        return allClone;
    }, {});
    return {
        ...stats,
        games_played: filteredStats.length,
    };
});
</script>
