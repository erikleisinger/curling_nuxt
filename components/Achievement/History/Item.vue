<template>
    <!-- BADGES -->
    <q-item v-if="item.type === 'badge_earned'" v-ripple clickable @click="navigateTo(`/teams/${item.team.id}`)">
        <q-item-section avatar
            >
            <BadgeIcon :badge="item.name" height="2.5em"/>
        </q-item-section>
        <q-item-section>
            <span
                ><strong>{{ item.team.name }}</strong> earned the 
                <strong>{{BADGE_NAMES[item.name]}}</strong> badge!</span
            >
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- TEAM ROSTER CHANGES -->

    <q-item v-if="item.type === 'team_roster_change'" v-ripple clickable @click="navigateTo(`/teams/${item.team.id}`)">
        <q-item-section avatar>
            <div style="width: 35px" class="relative-position">
                <TeamAvatar :teamId="item.team.id"> </TeamAvatar>
                <!-- LEFT TEAM BADGE -->
                <q-badge floating class="modifier_badge" color="white" v-if="item.name === 'left_team'">
                    <div class="circle-bg">
                        <q-icon color="red" name="person_remove" size="xs" />
                    </div>
                </q-badge>
                 <!-- JOINED TEAM BADGE -->
                <q-badge floating class="modifier_badge" color="white" v-else-if="item.name === 'joined_team'">
                    <div class="circle-bg">
                        <q-icon color="green" name="person_add_alt" size="xs" />
                    </div>
                </q-badge>
            </div>
        </q-item-section>
        <q-item-section>
            <span style="word-break: break-all">
                <strong>{{ getProfileName(item.profile) }}</strong>

                {{item.name === 'joined_team' ? 'joined' : 'left'}}
                
                <strong>{{ item.team.name }}</strong>
            </span>

            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>

     <!-- GAME_RESULTS -->

    <q-item v-if="item.type === 'game_result'" v-ripple clickable @click="navigateTo(`/games/view/${item.game_id}`)">
         <q-item-section avatar class="relative-position">
            <div style="width: 35px" class=" game-avatar--home">
                <TeamAvatar :teamId="item.team.id"> </TeamAvatar>
                
            </div>
            <div style="width: 35px" class="game-avatar--away">
                <TeamAvatar :teamId="item.info.opponent_id"> </TeamAvatar>
              
            </div>
        </q-item-section>
        <q-item-section v-if="item.name === 'game_win'">
            <span
                ><strong>{{ item.team.name }}</strong> won {{item.info.points_for}}-{{item.info.points_against ?? 0}} against 
                <strong>{{ item.info.opponent_name }}</strong>
                </span
            >
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
         <q-item-section v-if="item.name === 'game_loss'">
            <span
                ><strong>{{ item.team.name }}</strong> lost {{item.info.points_for}}-{{item.info.points_against ?? 0}} to
                <strong>{{ item.info.opponent_name }}</strong>
                </span
            >
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
           <q-item-section v-if="item.name === 'game_tie'">
            <span
                ><strong>{{ item.team.name }}</strong> tied {{item.info.points_for}}-{{item.info.points_against ?? 0}} against
                <strong>{{ item.info.opponent_name }}</strong>
                </span
            >
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- TEAM REQUESTS -->

    <q-item v-if="item.type === 'team_request'" v-ripple clickable @click="navigateTo(`/teams/${item.team.id}`)">
        <q-item-section avatar @click.stop>
            <div style="width: 35px" class="relative-position">
                <TeamAvatar :teamId="item.team.id" viewable> </TeamAvatar>
                
            </div>
        </q-item-section>
        <q-item-section>
            <span style="word-break: break-all">
                You were invited to join
                
                <strong>{{ item.team.name }}</strong>
            </span>

            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- GAME REQUESTS -->

    <q-item v-if="item.type === 'game_request'" v-ripple clickable  @click="navigateTo(`/games/view/${item.game_id}`)">
        <q-item-section avatar @click.stop>
            <div style="width: 35px" class="relative-position">
                <TeamAvatar :teamId="item.info.requester_id" viewable> </TeamAvatar>
                
            </div>
        </q-item-section>
        <q-item-section>
            <span >
                 <strong style="word-break: break-all">{{ item.info.requester_name }}</strong>
                asked you to verify a game
                
               
            </span>

            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>
</template>
<style lang="scss" scoped>
.modifier_badge {
    top: unset !important;
    bottom: -4px !important;
    &.left {
        left: -8px !important;
        right: unset !important;
    }
    &:not(.left) {
        right: -8px !important;
    }

    background: transparent !important;
    .circle-bg {
        padding: 0px 2px;
        background-color: white;
        border-radius: 50%;
    }
}
.game-avatar--home,
.game-avatar--away {
    position: absolute;
}

.game-avatar--home {
    // top: 0;
    left: -8px;
}
.game-avatar--away {
    // bottom: 12px;
    right: 8px;
}
</style>
<script setup>
import { parseAvatar } from "@/utils/avatar";
import { BADGE_NAMES, BADGE_DESCRIPTIONS } from "@/constants/badges";
const props = defineProps({
    item: Object,
});
const { toTimezone } = useTime();

const getAchievementDate = (d) => {
    return toTimezone(d, null, false, true).fromNow();
};

const { user: userId } = useUser();

const getProfileName = (profile) => {
    if (profile.id === userId.value) return "You";
    return `${profile.first_name} ${profile.last_name}`;
};


</script>
<script>
export default {
    name: 'AchievementItem'
}
</script>

