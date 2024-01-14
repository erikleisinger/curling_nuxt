<template>
        <div class="logout-container--floating" v-if="canEdit">
            <q-btn flat round icon="logout" @click="logout" />
        </div>
        <PlayerPageHeader :playerId="player?.id"/>
          <q-tabs
           
            class="tabs"
            ref="tabs"
            v-model="currentIndex"
            outside-arrows
            shrink
            v-if="canEdit"
        >
            <q-tab label="Teams" :name="0" :ripple="false" />

            <q-tab label="Settings" :name="1" :ripple="false" />
        </q-tabs>
        <q-separator v-else class="q-my-lg"/>
        <main >
          
            <section class="player-teams__section" v-if="currentIndex === 0">
          <PlayerPageTeams :playerId="player?.id" @loaded="onLoaded"/>
          </section>
          <PlayerPageSettings :playerId="player?.id" v-if="currentIndex === 1"/>
                <!-- <section
                class="player-teams--section hide-scroll justify-center"
                :class="{ 'col-6': !$q.screen.xs }"
                v-else
                 style="gap: 4px"
                
            >
            <div class="column items-center"  v-for="i in Array.from(Array(3).keys())" :key="i">
                <q-skeleton type="rect" width="100px" height="50px"/>
                   <q-skeleton height="1em" width="75px" style="margin-top: 4px"/>
    
            </div>
            </section> -->



            <!-- <section
                class="player-badges--section"
                :class="{ 'col-6': !$q.screen.xs }"
                v-if="!isLoading"
            >
                <LazyBadge
                    :badge="badge"
                    v-for="badge in [...(badges ?? [])].sort(sortBadges)"
                    :key="badge.id"
                    :showTeam="true"
                />
            </section>
              <section
                class="player-badges--section justify-center"
                :class="{ 'col-6': !$q.screen.xs }"
                v-else
                  style="gap: 4px"
            >
                    <q-skeleton type="rect" width="150px" height="100px"/>
                     <q-skeleton type="rect" width="150px" height="100px"/>
            </section> -->
        </main>
        <q-dialog v-model="editing" persistent v-if="!isLoading">
            <q-card style="width: 100%">
                <AvataaarGenerator
                    role="main"
                    v-model="player.avatar"
                    @close="editing = false"
                />
            </q-card>
        </q-dialog>
</template>
<style lang="scss" scoped>
.tabs {
    margin-top: var(--space-md);
    position: sticky;
    top: 0;
    background-color: transparent;
    transition: all 0.2s;
    font-family: $font-family-header;

    :deep(.q-tab__label) {
        font-size: 18px !important;
    }
    .tab__label {
        font-size: 18px !important;
    }
    :deep(.q-tab) {
        margin: unset;
    }
    :deep(.q-tab--active) {
        color: white;
        background-color: $app-mint;
        border-radius: 2px;
    }
    :deep(.q-tab__indicator) {
        bottom: 12px;
        background-color: $app-mint;
        display: none;
    }
    :deep(.q-focus-helper) {
        display: none;
    }
    :deep(.q-tab) {
        padding: unset;
        // margin: 0px var(--space-xs);
        @include sm {
            padding: 0px var(--space-lg);
        }
    }

}
.player-teams__section {
    padding: var(--space-md);
}
.logout-container--floating {
    position: absolute;
    top: 0;
    right: 0;
    margin: var(--space-sm);
}
.player-page__header {
    .player-avatar__wrap {
        width: min(250px, 50vw);
        margin-bottom: var(--space-sm);
        position: relative;
        .avatar-edit__helper {
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;
            left: 0;
            right: 0;
            height:fit-content;
            width: fit-content
        }
    }
}
.player--info {
    h3 {
        @include smmd-text;
    }
    padding: 0px var(--space-md);
    display: flex;
    flex-direction: column;
    @include sm {
        flex-direction: row;
    }
    margin-top: var(--space-md);
    .player-teams--section,
    .player-badges--section {
        display: flex;
        flex-wrap: nowrap;
        margin-bottom: var(--space-md);
        max-width: 100%;
        @include sm {
            max-width: 50%;

            flex-wrap: wrap;
        }
        overflow: auto;

        box-sizing: border-box;
        flex-grow: 1;
    }
    .player-teams--section {
        @include sm {
            margin-left: var(--space-sm);
        }
        .player-team__container {
            width: min-content;
            padding: var(--space-sm);
            cursor: pointer;
            height: min-content;
        }
    }
    :deep(.player-badges--section) {
        @include sm {
            margin-right: var(--space-sm);
        }
        .badge__container {
            margin-right: var(--space-sm);
        }
    }
}
</style>
<script setup>
import Player from "@/store/models/player";
import TeamPlayer from "@/store/models/team-player";
import Team from "@/store/models/team";
import Rink from "@/store/models/rink";
import { useUserStore } from "@/store/user";
import { useQuery } from "@tanstack/vue-query";
import { useDialogStore } from "@/store/dialog";
import {parseAvatar} from '@/utils/avatar'

const { logout } = useSession();
const { sortBadges } = useBadge();

const currentIndex = ref(0)
const route = useRoute();
const client = useSupabaseClient();
const $q = useQuasar();

// PLAYER INFO
const player = computed(() =>
    useRepo(Player).where("id", route.params.id).first()
);

const getPlayer = async () => {
    const { data } = await client
        .from("profiles")
        .select("*")
        .eq("id", route.params.id)
        .single();
    useRepo(Player).save(data);
    return data;
};


const {isLoading} = useQuery({
    queryKey: ["player", route.params.id],
    queryFn: getPlayer,
});



const { sortAlphabetically } = useSort();



//BADGES

const dayjs = useDayjs();
const { toTimezone } = useTime();
const getBadges = async () => {
    const { data } = await client
        .from("badges")
        .select("*")
        .or(
            `team_id.in.(${teams.value
                .map(({ id }) => id)
                .join(",")}),profile_id.eq.${route.params.id}`
        )
        .eq("earned", true);
    const e = data

        .reduce((all, current) => {
            const duplicate = all.find(({ name }) => name === current.name);

            if (duplicate) {
                const { team_id, created_at } = duplicate;
                const isDuplicateArray = typeof team_id === "object";
                return [
                    ...all.filter(({ name }) => name !== current.name),
                    {
                        ...current,
                        team_id: [
                            ...(isDuplicateArray ? team_id : [team_id]),
                            ...((isDuplicateArray &&
                                duplicate.team_id?.includes(current.team_id)) ||
                            duplicate.team_id === current.team_id
                                ? []
                                : [current.team_id]),
                        ],
                        created_at:
                            toTimezone(
                                current.created_at,
                                null,
                                false,
                                true
                            ).unix() >
                            toTimezone(created_at, null, false, true).unix()
                                ? current.created_at
                                : created_at,
                    },
                ];
            }
            return [...all, current];
        }, [])
        .sort(
            (a, b) => dayjs(b.created_at).unix() - dayjs(a.created_at).unix()
        );
    return e;
};

// const badgesEnabled = computed(() => !!teamsDone.value);
// const badgesDone = ref(false);

// const { isLoading: isLoadingBadges, data: badges } = useQuery({
//     queryKey: ["player", "team", "badges", route.params.id],
//     queryFn: getBadges,
//     enabled: badgesEnabled,
//     select: (val) => {
//         badgesDone.value = true;
//         return val;
//     },
//     refetchOnWindowFocus: false,
// });

// const pageLoaded = computed(
//     () => !!teamsDone.value
// );

const onLoaded = () => {
const { setLoading } = useLoading();
        setTimeout(() => {
            setLoading(false);
        }, 50);
}


const canEdit = computed(() => useUserStore().id === route.params.id);
const editing = ref(false);

const rink = computed(() =>
    useRepo(Rink).where("id", player.value?.rink_id).first()
);

const { toggleGlobalSearch } = useDialogStore();

const {updateHomeRink} = useUserStore();



const onClickAvatar = () => {
    if (!canEdit.value) return;
    editing.value = true;
};
</script>
<script>
export default {
    name: "Player",
};
</script>
