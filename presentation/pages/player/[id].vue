<template>
    <div class="logout-container--floating" v-if="canEdit">
        <q-btn flat round icon="logout" @click="logout" />
    </div>
    <PlayerPageHeader :playerId="player?.id" :canEdit="canEdit" @editAvatar="editingAvatar = true" />
    <q-tabs
        class="tabs"
        ref="tabs"
        v-model="currentIndex"
        outside-arrows
        shrink
       
    >
        <q-tab label="Teams" :name="0" :ripple="false"  @click="navigateTo('#teams')"/>
<q-tab label="Badges" :name="1" :disable="true" :ripple="false" >
   <div class="font-secondary text-caption" style="line-height:1; margin-top: -5px; text-transform: none"> Coming soon</div>
</q-tab>
        <q-tab label="Settings" :name="2" :ripple="false"  v-if="canEdit" @click="navigateTo('#settings')" id="player-page-settings-tab"/>

    </q-tabs>
   
    <main>
        <section class="player-teams__section" v-if="currentIndex === 0">
            <PlayerPageTeams :playerId="player?.id" @loaded="onLoaded" />
        </section>
        <PlayerPageSettings :playerId="player?.id" v-if="currentIndex === 2" @editAvatar="editingAvatar = true"/>
    </main>

    <q-dialog v-model="editingAvatar" persistent v-if="canEdit">
        <q-card style="width: 100%">
            <AvataaarGenerator
                role="main"
                v-model="player.avatar"
                @close="editingAvatar = false"
            />
        </q-card>
    </q-dialog>
</template>
<style lang="scss" scoped>
.tabs {
    @include tabs($app-mint);
        margin-top: var(--space-md);


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
            height: fit-content;
            width: fit-content;
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
import { parseAvatar } from "@/utils/avatar";
import {useSessionStore} from '@/store/session'

const { logout } = useSession();
const { sortBadges } = useBadge();

const currentIndex = ref(0);
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

const { isLoading } = useQuery({
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



const onLoaded = () => {
    const { setLoading } = useLoading();
    setTimeout(() => {
        setLoading(false);
    }, 50);
};

const canEdit = computed(() => useUserStore().id === route.params.id);

const rink = computed(() =>
    useRepo(Rink).where("id", player.value?.rink_id).first()
);
const { toggleGlobalSearch } = useDialogStore();

const { updateHomeRink } = useUserStore();

onMounted(() => {
    const {hash, path} = route;
    if (hash) return navigateTo(path, {replace: true})
    
})
const editingAvatar = ref(false)
watch(editingAvatar, (val) => {
    useSessionStore().toggleAvatarGenerator(val)
})

onBeforeRouteLeave(() => {
    if (editingAvatar.value) {
        editingAvatar.value = false;
        return false;
    }
    return true;
})




</script>
<script>
export default {
    name: "Player",
};
</script>
