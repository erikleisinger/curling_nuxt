<template>
<NuxtLayout>
<div class="profile__scroll">
    <ProfileCard :avatar="JSON.stringify(user.avatar)" v-if="user?.id">
           {{ user.first_name }} {{ user.last_name }}
        <template v-slot:subtitle> @{{ user.username }} </template>
        <template v-slot:append>
            <q-btn
                flat
                round
                icon="logout"
                @click="logout"
                color="deep-purple"
            />
        </template>
    </ProfileCard>
    <nav class="bg-white profile__nav">
        <q-tabs
            v-model="tab"
            inline-label
            outside-arrows
            stretch
            active-bg-color="deep-purple"
            active-color="white"
            color="deep-purple"
            class="profile__tabs text-deep-purple"
        >
            <q-tab
                :label="TAB_NAMES.PLAYER.label"
                :name="TAB_NAMES.PLAYER.value"
                icon="face"
            >
                <q-badge
                    color="red"
                    floating
                    rounded
                    v-if="requestsNotifications"
                ></q-badge>
            </q-tab>
            <q-tab
                :name="TAB_NAMES.SETTINGS.value"
                icon="settings"
                :label="TAB_NAMES.SETTINGS.label"
            />
        </q-tabs>
    </nav>
    <main
        class="main-content__wrap settings"
        v-if="tab === TAB_NAMES.SETTINGS.value"
    >
        <section name="timezone" class="section">
            <label for="timezone" class="label">Timezone</label>
            <div id="timezone">{{ user.timezone }}</div>
        </section>
        <!-- <section name="timezone" class="section">
            <label for="friendId" class="label">Friend ID</label>
            <div class="row no-wrap items-center">
                <div id="friendId" class="friend__id">
                    {{ user.friendId }}
                </div>
                <q-icon
                    flat
                    round
                    name="content_copy"
                    color="primary"
                    @click="copyFriendId"
                    size="1em"
                />
            </div>
        </section>
        <section name="timezone" class="section">
            <label class="label" for="friendId">Add a friend</label>
            <label class="label sub"
                >Paste your friend's ID here to add them as a friend</label
            >
            <div>
                <q-input v-model="friendToAdd" rounded outlined class="q-mt-sm">
                    <template v-slot:after>
                        <q-btn
                            color="primary"
                            round
                            icon="person_add"
                            :disable="!friendToAdd"
                            @click="addFriend"
                        />
                    </template>
                </q-input>
            </div>
        </section> -->
    </main>

        
        <PlayerGenerator v-else-if="tab === TAB_NAMES.PLAYER.value && user.id" role="main" v-model="user.avatar" :onSave="updateAvatar"/>

</div>
</NuxtLayout>
</template>
<style lang="scss" scoped>
.profile__scroll {
    height: 100%;
    overflow: auto;
    .profile__nav {
        position: sticky;
        top: 0;
        z-index: $z-tools;
    }
}
.profile__header--container {
    padding: var(--space-xs) var(--space-xxxs);
    position: relative;
    color: black;
}
.profile__tabs {
    :deep(.q-tab__indicator) {
        display: none !important;
    }
}

.main-content__wrap {
    &.settings {
        padding: var(--space-sm);
    }

    background-color: white;
    // height: calc(100% - 48px);
    overflow-x: hidden;
    overflow-y: auto;
    max-width: 100%;
    position: relative;

    color: black;
    .section {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;

        &:not(:last-child) {
            margin-bottom: var(--space-md);
        }
        .label {
            font-weight: bold;
            margin-bottom: var(--space-xxxxs);
            display: block;
            font-size: var(--text-md);
            &.sub {
                font-size: 0.9em;
                font-style: italic;
                font-weight: unset;
                margin-bottom: var(--space-sm);
            }
        }
        .friend__id {
            margin-right: var(--space-sm);
        }
    }
}
</style>
<script setup>
import { useUserStore } from "@/store/user";
import { BannerColors } from "@/types/color";
import { useNotificationStore } from "@/store/notification";
import { useTeamRequestStore } from "@/store/team-requests";
import { MAX_AVATAR_FILE_SIZE } from "@/constants/supabase";
import {parseAvatar} from '@/utils/avatar'

const { logout } = useSession();

const TAB_NAMES = ref({
    PLAYER: {
        label: "Player",
        value: "player",
    },
    SETTINGS: {
        label: "Settings",
        value: "settings",
    },
});

const tab = ref("player");

const store = useUserStore();

const user = ref({})

const profileAvatar = ref({})

const getUser = () => {
const {
        id,
        timezone,
        friendId,
        username,
        player,
        first_name,
        last_name,
        avatar,
    } = store;

    user.value = {
        id,
        timezone,
        friendId,
        username,
        player,
        first_name,
        last_name,
        avatar: avatar ? parseAvatar(avatar) : {},
    }
}

onBeforeMount(() => {
    getUser();
})

const { toTimezone } = useTime();

const copyFriendId = () => {
    navigator.clipboard.writeText(friendId);
    const { setBanner } = useBanner();
    setBanner("ID copied", BannerColors.Primary);
};

const friendToAdd = ref(null);

const getError = (msg) => {
    const keyNotFound = new RegExp("Key is not present");
    if (keyNotFound.test(msg)) {
        return "Player does not exist.";
    }
    const invalidInput = new RegExp("invalid input");
    if (invalidInput.test(msg)) {
        return "Friend ID is invalid. Please double-check that you entered it correctly.";
    }
    const alreadyFriend = new RegExp("friend already added");
    if (alreadyFriend.test(msg)) {
        return "You are already friends!";
    }

    const samePerson = new RegExp("check_different_profiles");
    if (samePerson.test(msg)) {
        return "You cannot add yourself as a friend! (That is, in the context of this app. In life, we must all be friends to ourselves)";
    }
};

const addFriend = async () => {
    const { client, fetchHandler } = useSupabaseFetch();
    const { data } = await fetchHandler(
        () =>
            client
                .from("friends")
                .insert({ profile_id_1: id, profile_id_2: friendToAdd.value }),
        { onError: (error) => getError(error.details || error.message) }
    );
    const { setBanner } = useBanner();
    if (data) {
        setBanner("Friend added successfully!", "positive");
        friendToAdd.value = null;
        const { initData } = useData();
        initData();
    }
};


/**
 * Team requests
 */

const teamRequestStore = useTeamRequestStore();
const requestsNotifications = computed(() => teamRequestStore.requestsToRespond);



/**
 * Avatar save
 */

const updatingAvatar = ref(false)
const updateAvatar = async () => {
    updatingAvatar.value = true;
    await store.updateUserAvatar(user.value.avatar)
    getUser();
    updatingAvatar.value = false;
}

</script>
<script>
export default {
    name: "Profile",
};
</script>

