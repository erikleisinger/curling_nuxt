<template>
    <TeamChip :teamId="item.team?.id ?? item.info?.team?.id ?? item.info?.id" v-if="teamFirst && item.type !== ACHIEVEMENT_TYPES.GAME_REQUEST" />
    <TeamChip v-else-if="item.type == ACHIEVEMENT_TYPES.GAME_REQUEST" :teamId="item.info?.requester_id"/> 

    <!-- BADGE RESULT -->

    <span v-if="item.type === ACHIEVEMENT_TYPES.BADGE_EARNED">
        earned the <strong>{{ BADGE_NAMES[item.name] }}</strong> badge!</span
    >

    <!-- GAME RESULT -->

    <span v-if="item.type === ACHIEVEMENT_TYPES.GAME_RESULT">
        {{ ` ${getGameResultVerb()}` }}

        <TeamChip
            :teamId="item.info.opponent_id"
            :teamName="item.info.opponent_name"
        />
        <span v-if="getGameResultVerb() === 'defeated'">{{
            ` ${item.info.points_for ?? 0} - ${item.info.points_against ?? 0}`
        }}</span
        >.
    </span>

    <span v-if="item.type === ACHIEVEMENT_TYPES.GAME_REQUEST">
        has asked you to verify a game result.
        </span>

        <span v-if="item.type === ACHIEVEMENT_TYPES.TEAM_INVITATION">
        has invited you to join their team.
        </span>

    <!-- WIN STREAK -->

    <span v-if="item.type === ACHIEVEMENT_TYPES.WIN_STREAK">is on a roll!</span>

    <span v-if="playerFirst">
        <span v-if="item.type === 'team_invitation'">You</span>

        <strong v-else
            >{{ item.profile.first_name ?? item.info?.first_name ?? "Someone" }}
            {{ item.profile.last_name ?? item.info?.last_name ?? "" }}
        </strong>
    </span>

    <!-- WIN STREAK END -->

    <span v-if="item.type === 'badge_lost' && item.name === 'win_streak'">'s winning streak has ended after {{item.info.value}} games.</span>
    <span v-if="item.type === 'badge_updated' && item.name === 'win_streak'">'s winning streak continues!</span>

    <!-- TEAM ROSTER CHANGE -->

    <span v-if="item.type === 'team_roster_change'">
        {{ item.name === "left_team" ? " left " : " joined " }}</span
    >

    <!-- TEAM REQUEST -->
    <span v-else-if="item.type === 'team_request'">{{
        ` requested to join `
    }}</span>
    <TeamChip
        v-if="playerFirst"
        :teamId="item.info.team?.id || item.team?.id"
    />
</template>
<script setup>
import {
    ACHIEVEMENT_TITLES,
    ACHIEVEMENT_TYPES,
} from "@/presentation/constants/achievements";
import { BADGE_NAMES, BADGE_DESCRIPTIONS } from "@/presentation/constants/badges";
const props = defineProps({
    item: Object,
});
const teamFirst = computed(() =>
    [
        ACHIEVEMENT_TYPES.BADGE_EARNED,
        ACHIEVEMENT_TYPES.BADGE_UPDATED,
        ACHIEVEMENT_TYPES.BADGE_LOST,
        ACHIEVEMENT_TYPES.GAME_RESULT,
        ACHIEVEMENT_TYPES.GAME_REQUEST,
        ACHIEVEMENT_TYPES.TEAM_INVITATION,
        ACHIEVEMENT_TYPES.WIN_STREAK,
    ].includes(props.item.type)
);

const playerFirst = computed(() =>
    [ACHIEVEMENT_TYPES.TEAM_CHANGE, ACHIEVEMENT_TYPES.TEAM_REQUEST].includes(
        props.item.type
    )
);
const getGameResultVerb = () => {
    const { info } = props.item;
    const { points_for, points_against } = info;

    return points_for > points_against
        ? "defeated"
        : points_against > points_for
        ? `lost ${points_for ?? 0} - ${points_against ?? 0} to`
        : `tied ${points_for ?? 0} - ${points_against ?? 0} against`;
};
</script>
<script>
export default {
    name: "AchievementText",
};
</script>
