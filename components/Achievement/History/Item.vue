<template>

    <!-- BADGES -->
    <q-item
        v-if="item.type === 'badge_earned'"
        class="achievement-history__item"
        :class="{ unread }"
        v-ripple
        clickable
        @click="!!item.team ? navigateTo(`/teams/${item.team.id}`, {replace: true}) : navigateTo(`/player/${item.profile.id}`, {replace: true})"
    >
        <q-item-section avatar class="relative-position">
            <Badge :badge="item" iconHeight="40px" iconOnly @click.stop />
        </q-item-section>
           <q-item-section v-if="item.name === 'win_streak'">
            <span>
                <TeamChip :teamId="item.team.id" /> is
                <strong>{{ BADGE_NAMES[item.name] }}</strong>!</span
            >
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
         <q-item-section v-else-if="item.name === 'lose_streak'">
            <span>
                <TeamChip :teamId="item.team.id" /> has lost <strong>{{item.info.value}} games in a row.</strong>
                That's... some kind of accomplishment!</span
            >
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
        <q-item-section v-else>
        <span>
                <TeamChip :teamId="item.team.id" v-if="item.team" /> <span v-else>You</span> earned the
                <strong>{{ BADGE_NAMES[item.name] }}</strong> badge!</span>
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>
      <q-item
        v-if="item.type === 'badge_updated'"
        class="achievement-history__item"
        :class="{ unread }"
        v-ripple
        clickable
        @click="navigateTo(`/teams/${item.team.id}`, {replace: true})"
    >
        <q-item-section avatar class="relative-position">
            <Badge :badge="item" iconHeight="40px" iconOnly @click.stop />
        </q-item-section>
        <q-item-section v-if="item.name === 'win_streak'">
            <span>
                <TeamChip :teamId="item.team.id" />'s winning streak continues!</span
            >
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
          <q-item-section v-else-if="item.name === 'lose_streak'">
            <span>
                <TeamChip :teamId="item.team.id" />'s losing streak continues.</span
            >
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>
     <q-item
        v-if="item.type === 'badge_lost'"
        class="achievement-history__item"
        :class="{ unread }"
        v-ripple
        clickable
        @click="navigateTo(`/teams/${item.team.id}`, {replace: true})"
    >
        <q-item-section avatar class="relative-position overlay">
            <Badge :badge="item" iconHeight="40px" iconOnly @click.stop />
        </q-item-section>
        <q-item-section v-if="item.name === 'win_streak'">
            <span>
                <TeamChip :teamId="item.team.id" />'s winning streak has ended. All good things...</span
            >
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
         <q-item-section v-if="item.name === 'lose_streak'">
            <span>
                <TeamChip :teamId="item.team.id" />'s {{item.info.value}}-game losing streak has ended! </span
            >
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- TEAM ROSTER CHANGES -->

    <q-item
        v-if="item.type === 'team_roster_change'"
        class="achievement-history__item"
        :class="{ unread }"
        v-ripple
        clickable
        @click="navigateTo(`/teams/${item.team.id}`, {replace: true})"
    >
        <q-item-section avatar>
            <div style="width: 42px" class="relative-position">
                <TeamAvatar :teamId="item.team.id"> </TeamAvatar>
                <!-- LEFT TEAM BADGE -->
                <q-badge
                    floating
                    class="modifier_badge"
                    color="white"
                    v-if="item.name === 'left_team'"
                >
                    <div class="circle-bg">
                        <q-icon color="red" name="person_remove"  />
                    </div>
                </q-badge>
                <!-- JOINED TEAM BADGE -->
                <q-badge
                    floating
                    class="modifier_badge"
                    color="white"
                    v-else-if="item.name === 'joined_team'"
                >
                    <div class="circle-bg">
                        <q-icon color="green" name="person_add_alt"  />
                    </div>
                </q-badge>
            </div>
        </q-item-section>
        <q-item-section>
            <span >
                <strong>{{ getProfileName(item.profile) }}</strong>

                {{ item.name === "joined_team" ? "joined" : "left" }}

               <strong>{{item.team.name}}</strong>
            </span>

            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- GAME_RESULTS -->

    <q-item
        v-if="item.type === 'game_result'"
        class="achievement-history__item"
        :class="{ unread }"
        v-ripple
        clickable
        @click="navigateTo(`/games/view/${item.game_id}`, {replace: true})"
    >
        <q-item-section avatar class="relative-position">
            
            <div
                class="row no-wrap justify-center  game-result__icon"
               
            >
            <div class="game-result--border"  :class="{win: item.name === 'game_win', loss: item.name === 'game_loss', tie: item.name === 'game_tie'}"/>
          <div v-if="item.name === 'game_win'" class="result-text">W</div>
           <div v-if="item.name === 'game_loss'" class="result-text">L</div>
             <div v-if="item.name === 'game_tie'" class="result-text">T</div>
               
            </div>
        </q-item-section>
        <q-item-section v-if="item.name === 'game_win'">
            <span
                ><TeamChip :teamId="item.team.id" /> won
                {{ item.info.points_for ?? 0 }}-{{
                    item.info.points_against ?? 0
                }}
                against
                <TeamChip
                    :teamId="item.info.opponent_id"
                    :teamName="item.info.opponent_name"
                />
            </span>
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="item.name === 'game_loss'">
            <span
                ><TeamChip :teamId="item.team.id" /> lost
                {{ item.info.points_for ?? 0 }}-{{
                    item.info.points_against ?? 0
                }}
                to

                <TeamChip
                    :teamId="item.info.opponent_id"
                    :teamName="item.info.opponent_name"
                />
            </span>
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
        <q-item-section v-if="item.name === 'game_tie'">
            <span
                ><TeamChip :teamId="item.team.id" /> tied
                {{ item.info.points_for ?? 0 }}-{{
                    item.info.points_against ?? 0
                }}
                against
                <TeamChip
                    :teamId="item.info.opponent_id"
                />
            </span>
            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- TEAM REQUESTS -->

    <q-item
        v-if="item.type === 'team_request' && item.name === 'pending_request'"
        class="achievement-history__item"
        :class="{ unread }"
        v-ripple
        clickable
        @click="navigateTo(`/teams/${item.team.id}`, {replace: true})"
    >
        <q-item-section avatar @click.stop>
            <div style="width: 42px" class="relative-position">
                <Avataaar v-bind="parseAvatar(item.info.avatar)"/>
            </div>
        </q-item-section>
        <q-item-section>
            <span>
                {{item.info.first_name}} {{item.info.last_name}} requested to join

                <strong>{{ item.team.name }}</strong>
            </span>

            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>

    
    <q-item
        v-if="item.type === 'team_request' && item.name === 'rejected_request'"
        class="achievement-history__item"
        :class="{ unread }"
        v-ripple
        clickable
    >
        <q-item-section avatar @click.stop>
            <div style="width: 42px" class="relative-position">
                <TeamAvatar :teamId="item.info.id"/>
            </div>
        </q-item-section>
        <q-item-section>
            <span>
                Your request to join <TeamChip :teamId="item.info.id"/> was rejected.
            </span>

            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>
    <q-item
        v-if="item.type === 'team_invitation' && item.name === 'pending_request'"
        class="achievement-history__item"
        :class="{ unread }"
        v-ripple
        clickable
         @click="navigateTo(`/teams/${item.info.id}?request=true`, {replace: true})"
    >
        <q-item-section avatar @click.stop>
            <div style="width: 42px" class="relative-position">
                <TeamAvatar :teamId="item.info.id"/>
            </div>
        </q-item-section>
        <q-item-section>
            <span>
                 You were invited to join <TeamChip :teamId="item.info.id"/>.
            </span>

            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>

    <!-- GAME REQUESTS -->

    <q-item
        v-if="item.type === 'game_request'"
        class="achievement-history__item"
        :class="{ unread }"
        v-ripple
        clickable
        @click="navigateTo(`/games/view/${item.game_id}`, {replace: true})"
    >
        <q-item-section avatar @click.stop>
            <div style="width: 42px" class="relative-position">
                <TeamAvatar :teamId="item.info.requester_id" viewable>
                </TeamAvatar>
            </div>
            
        </q-item-section>
        <q-item-section>
            <span>
                <strong >{{
                    item.info.requester_name
                }}</strong>
                asked you to verify a game
            </span>

            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>

      <q-item
        v-if="item.type === 'schedule_request'"
        class="achievement-history__item"
        :class="{ unread }"
        v-ripple
        clickable
    >
        <q-item-section avatar @click.stop>
            <div style="width: 42px" class="relative-position" v-if="item.team?.id">
                <TeamAvatar :teamId="item.team.id" viewable> </TeamAvatar>
            </div>
            <div style="width: 42px" class="relative-position" v-else-if="item.profile?.id">
                <Avataaar v-bind="JSON.parse(item.profile?.avatar)"> </Avataaar>
            </div>
             
        </q-item-section>
        <q-item-section>
            <span>
                

                <span v-if="item.team?.name">
                    <strong>{{ item.team.name }} </strong>
                    has
                    </span>
                <span v-else-if="item.profile?.id">You have </span>
                a new event: <strong  :style="{color: item?.schedule?.color}">{{item?.schedule?.name}}</strong> on {{toTimezone(item?.schedule?.start_time, 'MMMM DD')}}.
            </span>

            <q-item-label caption>{{
                getAchievementDate(item.created_at)
            }}</q-item-label>
        </q-item-section>
    </q-item>

</template>
<style lang="scss" scoped>

$append-icon-size: 1.7em;
.achievement-history__item {
    .q-item__section--avatar {
        align-items: center;
    }
     &:before {
        content: '';
        bottom:0;
        width: 5px;
        left: 0;
        top: 0;
        position: absolute;
    background-color: transparent;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
      
    }
          &.unread {
              background-color: #ecf8fe;
            &:before {
            background-color: #00a4f6;
            }
      
    }
   

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
            position: relative;
            padding: 4px;
            background-color: white;
            border-radius: 50%;
            height: $append-icon-size;
            width: $append-icon-size;
            border: 1px solid rgba(0,0,0,0.1);
            .q-icon {
                position: absolute;
                font-size: calc($append-icon-size - 4px);
                top: 0;
                left: 1px;
                right: 0;
                bottom: 0;
                margin: auto;
            }
        }
    }
    .game-avatar--home,
    .game-avatar--away {
        position: absolute;
        &.loss {
            border: 1px solid red;
          
        }
        &.win {
            border: 1px solid green;
        }
    }

    .game-avatar--home {
        // top: 0;
        left: -8px;
    }
    .game-avatar--away {
        // bottom: 12px;
        right: 8px;
    }
    .badge-earned--floating {
        position: absolute;
        bottom: 0;
    }
    .game-result__icon {
        border: 1px solid black;
        // clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        border-radius: 50%;
        color: green;
        font-size: calc(var(--text-md) - 0.1em);
        width: 40px;
        aspect-ratio: 1/1;
        font-weight: bold;
        margin-left: auto;
        margin-right: auto;
        //  padding-top: 6px;
         position: relative;
         box-shadow: $pretty-shadow;
          box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
            rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
         .game-result--border {
            position: absolute;
            // margin: auto;
            height: calc(100% + 4px);
            width: calc(100% + 4px);
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background-color: white;
            border-radius: inherit;
            //  clip-path: polygon(50% 10%, 100% 50%, 50% 90%, 0% 50%);
             z-index: 0;
             &:before {
                content: '';
                position: absolute;
            // margin: auto;
            border-radius: inherit;
            height: calc(100% - 5px);
            width: calc(100% - 5px);
            top: 0px;
            left: 0px;
            right:0px;
            bottom: 0px;
            margin: auto;
            background-color: white;
            border: 1px solid rgba(0,0,0,0.05);
            //  clip-path: polygon(50% 10%, 100% 50%, 50% 90%, 0% 50%);
             z-index: 0;
             }
              &.tie {
                // box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
                // rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
                &:before {
                    background: $bg-badge--baby-blue;
                }
            }
            &.win {
                // box-shadow: rgba(0, 255, 21, 0.25) 0px 6px 12px -2px,
                // rgba(2, 69, 0, 0.3) 0px 0px 4px 1px;
                &:before {
                    background: $bg-badge--green;
                }
            }
            &.loss {
                // box-shadow: rgba(255, 0, 0, 0.25) 0px 6px 12px -2px,
                // rgba(255, 15, 15, 0.3) 0px 0px 4px 1px;
                &:before {
                    background: $bg-badge--pale-red;
                }
            }
            
         }
        &.dense {
            padding-top: 0.6em;
            font-size: var(--text-sm);
        }
        
       
     
        
          
           border-radius: 50%;
            border: 3px solid white;
            .result-text {
                // background-color: white;
                height: fit-content;
                padding-top: 4px;
                color: inherit;
                z-index: 1;
                color: white;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                width: fit-content;
                line-height: 1em;
          
            }

       
    }
    .overlay {
       filter: grayscale(100%);
    }
}
</style>
<script setup>
import { parseAvatar } from "@/utils/avatar";
import { BADGE_NAMES, BADGE_DESCRIPTIONS } from "@/constants/badges";
const props = defineProps({
    animated: Boolean,
    item: Object,
});
const { toTimezone } = useTime();

const unread = computed(() => props.item.read !== null && props.item.read !== undefined && !props.read)

const getAchievementDate = (d) => {
    return toTimezone(d, null, false, true).fromNow();
};

const { user: userId } = useUser();

const getProfileName = (profile) => {
    if (!profile) return ''
    if (profile.id === userId.value) return "You";
    return `${profile.first_name} ${profile.last_name}`;
};

</script>
<script>
export default {
    name: "AchievementItem",
};
</script>
