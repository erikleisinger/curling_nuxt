<template>
    <div>
        <div class="underlay" v-if="$q.screen.xs && open" />
        <div
            class="nav-drawer"
            :class="{ open, mobile: $q.screen.xs }"
            ref="drawer"
            @click="onDrawerClick"
        >
            <div
                :style="{ opacity: open || !$q.screen.xs ? 1 : 0 }"
                class="nav-drawer--content"
            >
                <div class="row items-center no-wrap">
                    <div
                        style="width: 50px"
                        class="clickable"
                        id="nav-drawer-player-avatar"
                        @click.stop="goTo(`/player/${user?.id}`)"
                    >
                        <AvataaarPlayer
                        v-if="user?.id"
                            :playerId="user?.id"
                        />
                    </div>
                    <div class="q-ml-md q-pt-xs" style="max-width: 68%">
                        <div
                            class="smmd-text text-bold font-header player-name__text"
                        >
                            {{ user?.first_name }} {{ user?.last_name }}
                        </div>
                        <div class="row items-center no-wrap">
                            <q-icon
                                color="red"
                                name="location_on"
                                size="1.1em"
                                class="q-mr-xs"
                            />
                            <div
                                class="text-caption"
                                style="line-height: 1; margin-top: 2px"
                            >
                                {{ rink?.name ?? "No home rink" }}
                            </div>
                        </div>
                    </div>
                </div>
                <q-separator
                    v-show="true"
                    size="3px"
                    class="separator q-mt-md"
                    :style="{ opacity: open ? 1 : 0 }"
                />
                <q-list class="nav-drawer__list">
                    <q-item clickable v-ripple class="list-item" @click.stop="goTo('/')" :disable="route.path === '/'">
                        <q-item-section avatar class="items-center">
                            <q-icon name="insights" size="2.1em" />
                        </q-item-section>
                        <q-item-section class="q-ml-md">
                            <q-item-label>Dashboard</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item
                        clickable
                        v-ripple
                        class="row items-center no-wrap list-item"
                        :style="{ width: open ? '' : 'fit-content' }"
                        v-for="team in userTeams"
                        :key="team.id"
                        @click.stop="goTo(`/teams/${team.id}`)"
                        :disable="route.path === `/teams/${team.id}`"
                    >
                        <q-item-section avatar>
                            <div
                                style="width: 40px; min-width: 40px"
                                class="clickable"
                            >
                                <TeamAvatar
                                    :teamId="team.id"
                                    :disableMenu="true"
                                />
                            </div>
                        </q-item-section>
                        <q-item-section class="q-ml-md">
                            <q-item-label>
                                {{ team.name }}
                            </q-item-label>
                            <q-item-label
                                caption
                                v-if="
                                    requests.some(
                                        ({ team_id }) => team_id === team.id
                                    )
                                "
                            >
                                Requested
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
                <q-list v-if="open" class="q-mt-xl">
                    <q-item clickable v-ripple @click="logout">
                        <q-item-section avatar>
                            <q-icon name="logout" />
                        </q-item-section>
                        <q-item-section> Logout </q-item-section>
                    </q-item>
                </q-list>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.player-name__text {
    max-width: 100%;
    white-space: pre-wrap;
    word-break: break-all;
}
.nav-drawer {
    position: absolute;
    left: 0;
    top: 0;
    width: 80px;
    transition: width 0.2s;

    padding-top: calc(4em + var(--space-sm));
    color: white;
    @include sm {
        padding-top: calc(5em + var(--space-sm));
    }
    margin-bottom: -100px;
    transform-origin: left;
    &.mobile {
        // transform: scaleX(0) translateX(-50px);
        width: 0px;
    }
    &.open {
        width: 300px;
        transform: scaleX(1);
    }
    height: calc(100 * var(--vh, 1vh));
    overflow: auto;
    overflow-x: hidden;
    z-index: 13;

    .nav-drawer--content {
        position: absolute;
        top: 0;
        left: 16px;
        top: calc(4em + var(--space-sm));
        width: 300px;
        @include sm {
            top: calc(5em + var(--space-sm));
        }
        padding-bottom: var(--space-md);
    }
    .separator {
        background-color: $app-mint;
        box-sizing: content-box;
        margin-left: 0px;
        margin-right: 36px;
    }
    .list-item {
        margin-left: -12px;
        .q-item__label--caption {
            color: rgb(227, 226, 226);
        }
        .q-item__section {
            font-family: $font-family-header;
            .q-item__label--caption {
                font-family: $font-family-secondary;
                line-height: 0.7;
                margin-top: unset;
                font-style: italic;
            }
        }

        &.disabled {
            opacity: 1!important;
            color: $app-mint;
        }
    }
    .nav-drawer__list {
        margin-top: var(--space-sm);
        :deep(.q-item) {
            border-color: rgb(246, 174, 45, 0.2);
        }
    }
    @include bg-blue-side;

    .league-icon {
        width: 40px;
        aspect-ratio: 1/1;
        border-radius: 50%;

        position: relative;
        border: 3px solid white;
        .league-icon-abbrev {
            font-weight: bold;
            color: white;
            position: absolute;
            height: 100%;
            width: 100%;
            border-radius: inherit;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            border: 1px solid rbga(0, 0, 0, 0.1);
            line-height: 40px;
        }
    }
}
.underlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: all;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 12;
}
</style>
<script setup>
import { onClickOutside, useSwipe } from "@vueuse/core";
import { useTeamRequestStore } from "@/store/team-requests";
import { useSessionStore } from "@/store/session";
import Rink from "@/store/models/rink";
    import Player from "@/store/models/player";
import Team from "@/store/models/team";
const props = defineProps({
    modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const open = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit("update:modelValue", val);
    },
});
const $q = useQuasar();
const { logout } = useSession();

const doLogout = () => {
    open.value = false;
    nextTick(() => {
        logout();
    });
};

const { user: userId } = useUser();
const user = computed(() => useRepo(Player).where("id", userId.value).first());
const { userTeamIds } = useTeam();
const userTeams = computed(() =>
    userTeamIds.value
        .map((id) => useRepo(Team).where("id", id).first())
        .filter((t) => !!t)
);
const rink = computed(() =>
    useRepo(Rink).where("id", user.value?.rink_id).first()
);

const requests = computed(() => useTeamRequestStore().requests);

const route = useRoute();
watch(
    () => route.path,
    (val, oldVal) => {
        if (val !== oldVal) {
            setTimeout(() => {
                open.value = false;
            }, 1);
        }
    }
);

const drawer = ref(null);
onClickOutside(drawer, () => {
    if (!open.value) return;

    setTimeout(() => {
        open.value = false;
    }, 1);
});

const { isSwiping, direction } = useSwipe(document);
watch(isSwiping, (val) => {
    if (!val) return;
    if (direction.value === "left" && !!open.value) {
        open.value = false;
    }
});

const onDrawerClick = () => {
    if (open.value) return;
    open.value = true;
};

watch(open, (val) => {
    useSessionStore().toggleDrawer(val);
});
const { setLoading } = useLoading();
const goTo = (path) => {
    setLoading(true)
    open.value = false;
    setTimeout(() => {
 return navigateTo(path)
    }, 250)
   
}
</script>
