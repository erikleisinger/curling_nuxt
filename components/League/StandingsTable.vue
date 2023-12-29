<template>
<section
            class="pool-section"
        >
        <div class="row justify-between  pool-header">
            <h2 class="text-md text-bold">{{ pool?.name }}</h2>
            <q-btn  flat dense @click="addTeamToLeague(pool?.id)" v-if="league.public">
                Join pool
            </q-btn>
    
        </div>
    <table class="full-width standings__table">
                <thead>
                    <th class="text-left" style="width: 50px">Rank</th>
                    <th style="width: 50px"></th>
                    <th class="text-left">Team</th>
                    <th style="width: 60px" class="text-left">W L T</th>
                    <th style="width: 40px"></th>
                </thead>
                <tbody>
                    <tr
                        v-for="({ team }, index) in pool.teams.sort(
                            (a, b) =>
                                rankOrder.indexOf(a.team?.id) -
                                rankOrder.indexOf(b.team?.id)
                        )"
                        :key="team.id"
                    >
                        <td class="text-lg text-bold q-pl-md text-center">
                            <span>
                                {{ index + 1 }}
                            </span>
                        </td>
                        <td class="relative-position">
                            <div style="width: 30px">
                                <TeamAvatar :teamId="team.id" viewable />
                            </div>
                        </td>
                        <td>
                            {{ team?.name }}
                        </td>
                        <td>
                            <div class="row" v-if="standings">
                                {{ standings[team.id]?.win }}
                                {{ standings[team.id]?.loss }}
                                {{ standings[team.id]?.tie }}
                            </div>
                        </td>
                        <td>
                                <LeagueStandingsMenu v-if="isOnTeam(team.id)" :teamId="team.id" :leagueId="league?.id" />
                        </td>
                    </tr>
                </tbody>
            </table>
</section>
</template>