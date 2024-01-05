<template>
    <LayoutSection title="Game Story">
        <div v-if="ends?.length">
            <div class="end__container full-width">
                <div class="row items-center">
                    <div style="width: 40px">
                        <TeamAvatar
                            :teamId="homeTeam?.team_id"
                            :color="homeTeam?.color"
                        />
                    </div>
                    <div class="q-ml-sm">{{ homeTeam.team?.name }}</div>
                </div>
                <div class="xl-text q-mx-sm font-header text-center">
                    {{ homeTeam.points_scored }}
                </div>
                <div class="xl-text q-mx-sm font-header text-center">
                    {{ awayTeam.points_scored }}
                </div>
                <div class="row items-center justify-end">
                    <div class="q-mr-sm">{{ awayTeam.team?.name }}</div>
                    <div style="width: 40px">
                        <TeamAvatar
                            :teamId="awayTeam?.team_id"
                            :color="awayTeam?.color"
                        />
                    </div>
                </div>
            </div>
            <div
                v-for="(end, index) in ends"
                :key="end.id"
                class="end__container"
            >
                <div class="lg-text font-header">   
                    {{getEndMomentum(index, 'home')}}
                    <div v-if="endMomentum[index].team === 'home'">
                        <div class="smmd-text font-header" v-if="momentumShifts[index].bigend">big end</div>
                         <div class="smmd-text font-header" v-if="momentumShifts[index].force">force</div>
                            <div class="smmd-text font-header" v-if="momentumShifts[index].steal">steal</div>
                          <div class="smmd-text font-header" v-if="momentumShifts[index].momentum">momentum shift</div>
                    </div>
                </div>
                <div class="xl-text q-mx-sm font-header text-center">
                    {{
                        end.scoring_team_id === null ||
                        end.scoring_team_id === awayTeam?.team_id
                            ? 0
                            : end.points_scored
                    }}
                </div>
                <div class="xl-text q-mx-sm font-header text-center">
                    {{
                        end.scoring_team_id === null ||
                        end.scoring_team_id === awayTeam?.team_id
                            ? end.points_scored
                            : 0
                    }}
                </div>
                <div class="lg-text font-header text-right">
                    {{getEndMomentum(index, 'away')}}
                    <div v-if="endMomentum[index].team === 'away'">
                        <div class="smmd-text font-header" v-if="momentumShifts[index].bigend">big end</div>
                          <div class="smmd-text font-header" v-if="momentumShifts[index].force">force</div>
                           <div class="smmd-text font-header" v-if="momentumShifts[index].steal">steal</div>
                          <div class="smmd-text font-header" v-if="momentumShifts[index].momentum">momentum shift</div>
                    </div>
                </div>
          
            </div>
        </div>
    </LayoutSection>
</template>
<style lang="scss" scoped>
.end__container {
    display: grid;
    grid-template-columns: 1fr 3em 3em 1fr;
    column-gap: var(--space-sm);
    padding: var(--space-sm);
}
</style>
<script setup>
import { useQuery } from "@tanstack/vue-query";
import Game from "@/store/models/game";
import Team from "@/store/models/team";
const props = defineProps({
    gameId: Number,
});

const game = computed(() =>
    useRepo(Game).withAllRecursive().where("id", props.gameId).first()
);
const homeTeam = computed(() =>
    game.value?.teams.find(({ home_team }) => !!home_team)
);
const awayTeam = computed(() =>
    game.value?.teams.find(({ home_team }) => !home_team)
);

const isHomeTeam = (id) => {
    return id === homeTeam.value?.team_id;
};

const isTeam = (id, id2) => {
    if (id > 100000000) return id2 === null || id === id2;
    return id === id2;
};

const getMomentumTeam = (homeId, awayId, hammerTeamId, scoringTeamId, pointsScored) => {
    if (isTeam(homeId, hammerTeamId)) {
        if (!isTeam(homeId, scoringTeamId)) return "away";
        return pointsScored === 1 ? "away" : "home"
    } else {
        if (!isTeam(awayId, scoringTeamId)) return "home";
        return pointsScored === 1 ? "home" : "away"
    }
};

const endMomentum = computed(() => {
    if (!ends.value) return;

    let runningMomentum = {
        home: 0,
        away: 0,
        hasMom: null,
    };

    const homeId = homeTeam?.value?.team_id;
    const awayId = awayTeam?.value?.team_id;

    return ends.value.reduce((all, end, index) => {
        const allClone = [...all];
        const { scoring_team_id, hammer_team_id, points_scored } = end;

        const momentumTeam = getMomentumTeam(
            homeId,
            awayId,
            hammer_team_id,
            scoring_team_id,
            points_scored
        );
        const momentumTeamId = momentumTeam === "home" ? homeId : awayId;

        let modifier = 1;
        let runningTotal = 0;

        const isSteal = !isTeam(momentumTeamId, scoring_team_id);

        if (isSteal) modifier = 2;
        runningTotal += modifier * points_scored;

        const hasHammer = isTeam(momentumTeamId, hammer_team_id);

        const { end_count } = game.value;
        const numEndsPlayed = ends.value?.length;
        if (
            numEndsPlayed >= end_count &&
            index + 1 === numEndsPlayed &&
            hasHammer
        ) {
            if (isTeam(momentumTeamId, hammer_team_id))
                allClone[index - 1][momentumTeam] =
                    allClone[index - 1][momentumTeam] + 2;
        }

        const running = { ...runningMomentum };

        const newMomentum = {
            team: momentumTeam,
            home:
                momentumTeam === "home"
                    ? (running[momentumTeam] += runningTotal)
                    : running.home,
            away:
                momentumTeam === "away"
                    ? (running[momentumTeam] += runningTotal)
                    : running.away,
        };

        runningMomentum = newMomentum;

        return [...allClone, newMomentum];
    }, []);
});

const momentumShifts = computed(() => {
    if (!endMomentum.value?.length) return;
    const shiftHistory = [];
    return endMomentum.value.reduce((all, current, index) => {
        const momentum = endMomentum.value[index] ?? {};
        const momentumTeam =
            momentum.home - 1 > momentum.away
                ? "home"
                : momentum.away - 1 > momentum.home
                ? "away"
                : null;
        
            shiftHistory.push(momentumTeam);

        const returnObj = {
            momentum: false,
            bigend: false,
            force: false,
            steal: false,
        };
        if (ends.value[index].points_scored > 2) returnObj.bigend = true;
        if (ends.value[index].scoring_team_id === ends.value[index].hammer_team_id && ends.value[index].points_scored === 1) returnObj.force = true;
         if (ends.value[index].scoring_team_id !== ends.value[index].hammer_team_id) returnObj.steal = true;



        const lastMomentum = shiftHistory[index - 1];
        if (!!index && !!momentumTeam && lastMomentum !== momentumTeam)
            returnObj.momentum = true;
        return [...all, returnObj];
    }, []);
});

const getEndMomentum = (index, team) => {
    if (index === 0) return 0;
    const teamId =
        team === "home" ? homeTeam.value?.team_id : awayTeam?.value?.team_id;
    // const hasHammer = isTeam(teamId, ends.value[index].hammer_team_id);
    return endMomentum.value[index - 1][team];
};

const getGameEnds = async () => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("ends")
        .select("*")
        .eq("game_id", props.gameId);
    return data;
};

const { isLoading, data: ends } = useQuery({
    queryKey: ["game", "ends", props.gameId],
    queryFn: getGameEnds,
    refetchOnWindowFocus: false,
});
</script>
<script>
export default {
    name: "GameStory",
};
</script>
