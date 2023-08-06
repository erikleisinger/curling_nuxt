<template>
    <NuxtLayout>
        <q-btn icon="logout" @click="logout"/>
        <div class="profile__container items-center">
            <header
                class="column justify-center items-center profile__header col-grow">
                <div style="width: 50vw">
                <PlayerAvatar :parsedAvatar="parseAvatar(player.avatar)" :player="player" popoutPosition="bottom right" hidePlayerIcon showStats>
                    <template v-slot:deleteButton>
                        <q-btn
                            color="deep-purple"
                            size="sm"
                            round
                            @click="openPlayerSelector"
                            ><q-icon color="white" name="swap_horiz" size="xs"
                        /></q-btn>
                    </template>
                </PlayerAvatar> 
                </div>
                <h1 class="text-black text-bold">{{`${user.firstName} ${user.lastName}`}}</h1>
                <h2 class="text-muted text-lg" aria-roledescription="user name">
                    #{{ user.username }}
                </h2>
            </header>
            <main class="main-content__wrap">
                <section name="timezone" class="section">
                    <label for="timezone" class="label">Timezone</label>
                    <div id="timezone">{{ user.timezone }}</div>
                </section>
                <section name="timezone" class="section">
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
                        >Paste your friend's ID here to add them as a
                        friend</label
                    >
                    <div>
                        <q-input
                            v-model="friendToAdd"
                            rounded
                            outlined
                            class="q-mt-sm"
                        >
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
                </section>
            </main>
        </div>
    </NuxtLayout>
</template>
<style lang="scss" scoped>
.profile__container {
    height: calc(100vh - (64px + 0.75 * 1em * 2));
    height: calc(var(--vh, 1vh) * 100 - (64px + 0.75 * 1em * 2));
    overflow: auto;
    .profile__header {
        position: relative;
        z-index: 1;
        padding: var(--space-xl) !important;

        h1 {
            margin-top: var(--space-sm);
        }
        .upload__input {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }
        .upload__input--label {
            position: absolute;
            background-color: var(--transparent-light);
            height: 100%;
            width: 100%;
            border-radius: 50%;
            .icon {
                font-size: var(--text-lg);
            }
            color: rgba(255, 255, 255, 0.8);
        }
    }
    .main-content__wrap {
        background-color: white;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        margin: 0 var(--space-sm) 0 var(--space-sm);
        border-top-left-radius: 32px;
        border-top-right-radius: 32px;
        padding: var(--space-lg);

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
}
</style>
<script setup>
import imageCompression from "browser-image-compression";
import { useUserStore } from "@/store/user";
import {usePlayerStore} from '@/store/players'
import {useEditorStore} from '@/store/editor'
import { BannerColors } from "@/types/color";
import {useNotificationStore} from '@/store/notification'
import { MAX_AVATAR_FILE_SIZE } from "@/constants/supabase";

import {parseAvatar} from '@/utils/avatar'

const {logout} = useSession();

const store = useUserStore();

const user = computed(() => {
    const { id, timezone, friendId, username, player, firstName, lastName } = store;
    return { id, timezone, friendId, username,  player, firstName, lastName};
});
 

const playerStore = usePlayerStore();

const player = computed(() => {
       const player = playerStore.players.find((p) => user.value.player.id === p.id)
return {...player, profile_id_for_player: {id: user.value.id}}
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

const openPlayerSelector = () => {
    const editorStore = useEditorStore();
  
    editorStore.togglePlayerSelect({open: true, onSelect: async (playerId) => {
  const notificationStore = useNotificationStore();
  const notId = notificationStore.addNotification({
    state: 'pending',
    text: 'Updating...'
  })
  try {
 await playerStore.updatePlayerLink({
            playerId: player.value.id,
            profileId: null
        })
        await playerStore.updatePlayerLink({
            playerId: playerId,
            profileId: user.value.id
        })
        await store.getCurrentUser();
         notificationStore.updateNotification(notId, {
            state: 'completed',
            text: 'Player linked!',

        })
  } catch(e) {
     notificationStore.updateNotification(notId, {
            state: 'failed',
            text: `Issue linking player: ${e}`,

        })
  }
       

       
    }})
};
</script>
