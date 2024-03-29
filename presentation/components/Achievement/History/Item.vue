<template>
    <q-item
        class="achievement-history__item"
        :class="{ unread }"
        v-ripple
        clickable
        style="border-radius: inherit"
        @click="navigate"
    >
        <q-item-section avatar class="relative-position">
            <Badge
                :badge="item"
                :iconHeight="$q.screen.xs ? '45px' : '50px'"
                iconOnly
                @click.stop
                v-if="isBadge"
            />
            <div style="width: 40px" v-else-if="isPlayer">
                <Avataaar
                    v-bind="
                        parseAvatar(item.profile?.avatar ?? item.info?.avatar)
                    "
                />
            </div>

            <div style="width: 40px" v-else-if="isTeam">
                <TeamAvatar
                    :teamId="
                        item.info?.requester_id ||
                        item.team?.id ||
                        item.info?.id
                    "
                />
            </div>

            <div v-else>
                <div class="row no-wrap justify-center game-result__icon">
                    <div
                        class="game-result--border"
                        :class="{
                            win: item.name === 'game_win',
                            loss: item.name === 'game_loss',
                            tie: item.name === 'game_tie',
                        }"
                    />
                    <div v-if="item.name === 'game_win'" class="result-text">
                        W
                    </div>
                    <div v-if="item.name === 'game_loss'" class="result-text">
                        L
                    </div>
                    <div v-if="item.name === 'game_tie'" class="result-text">
                        T
                    </div>
                </div>
            </div>
        </q-item-section>
        <q-item-section>
            <q-item-label caption>
                {{ getBadgeType(item.type, item.name) }}
            </q-item-label>
            <q-item-label>
                <AchievementHistoryItemText :item="item" />
            </q-item-label>
        </q-item-section>
        <div class="date--floating">
            <q-item-label caption>
                {{ getAchievementDate(item.created_at) }}
            </q-item-label>
        </div>
    </q-item>
</template>
<style lang="scss" scoped>
$append-icon-size: 1.7em;
.achievement-history__item {
    position: relative;

    .date--floating {
        position: absolute;
        top: 8px;
        right: 16px;
        color: rgba(0, 0, 0, 0.5);
    }
    &.unread {
        background-color: #ecf8fe;
        &:before {
            background-color: #00a4f6;
            content: "";
            bottom: 0;
            width: 5px;
            left: 0;
            top: 0;
            position: absolute;
            background-color: transparent;
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
        }
    }

    .game-result__icon {
        border: 1px solid black;
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
            height: calc(100% + 4px);
            width: calc(100% + 4px);
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background-color: white;
            border-radius: inherit;
            z-index: 0;
            &:before {
                content: "";
                position: absolute;
                border-radius: inherit;
                height: calc(100% - 5px);
                width: calc(100% - 5px);
                top: 0px;
                left: 0px;
                right: 0px;
                bottom: 0px;
                margin: auto;
                background-color: white;
                border: 1px solid rgba(0, 0, 0, 0.05);
                z-index: 0;
            }
            &.tie {
                &:before {
                    background: $bg-badge--baby-blue;
                }
            }
            &.win {
                &:before {
                    background: $bg-badge--green;
                }
            }
            &.loss {
                &:before {
                    background: $bg-badge--pale-red;
                }
            }
        }

        border-radius: 50%;
        border: 3px solid white;
        .result-text {
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
}
</style>
<script setup>
import { parseAvatar } from "@/utils/avatar";
import {
    ACHIEVEMENT_TITLES,
    ACHIEVEMENT_TYPES,
} from "@/presentation/constants/achievements";
const props = defineProps({
    animated: Boolean,
    item: Object,
});
const { toTimezone } = useTime();
const $q = useQuasar();

const unread = computed(
    () =>
        props.item.read !== null &&
        props.item.read !== undefined &&
        !props.item.read
);

const getAchievementDate = (d) => {
    return toTimezone(d, null, false, true).fromNow();
};

const { user: userId } = useUser();

const getBadgeType = (type, name) => {
    const badgeTitle = ACHIEVEMENT_TITLES[type] ?? "Update";
    if (typeof badgeTitle === "function") return badgeTitle(name);
    return badgeTitle;
};

const isBadge = computed(() =>
    [
        ACHIEVEMENT_TYPES.BADGE_EARNED,
        ACHIEVEMENT_TYPES.BADGE_UPDATED,
        ACHIEVEMENT_TYPES.BADGE_LOST,
    ].includes(props.item.type)
);

const isPlayer = computed(() =>
    [ACHIEVEMENT_TYPES.TEAM_CHANGE, ACHIEVEMENT_TYPES.TEAM_REQUEST].includes(
        props.item.type
    )
);

const isTeam = computed(() =>
    [
        ACHIEVEMENT_TYPES.GAME_REQUEST,
        ACHIEVEMENT_TYPES.TEAM_INVITATION,
    ].includes(props.item.type)
);


const navigate = () => {
    if (!!props.item.team &&
            (props.item.info && props.item.type === ACHIEVEMENT_TYPES.TEAM_INVITATION)) return navigateTo(`/teams/${props.item.team.id ?? props.item.info?.id}`, {replace: true,})
    if (props.item.type === ACHIEVEMENT_TYPES.GAME_REQUEST)return navigateTo(`/games/view/${props.item.game_id}`, { replace: true })
    if (props.item.type === ACHIEVEMENT_TYPES.TEAM_REQUEST || props.item.type === ACHIEVEMENT_TYPES.TEAM_CHANGE)  return navigateTo(`/teams/${props.item.team.id}`, {replace: true,})
     return navigateTo(`/player/${props.item.profile.id}`, { replace: true })
}
</script>
<script>
export default {
    name: "AchievementItem",
};
</script>
