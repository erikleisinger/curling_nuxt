<template>
    <div class="profile__container items-center">
        <header class="q-pa-lg column justify-center items-center">
            <ProfileAvatar :path="avatarUrl" :loading="uploading" :size="8"/>
                <input
                    type="file"
                    name="file"
                    id="file"
                    class="upload__input"
                    accept="image/*"
                    @change="uploadAvatar"
                    :disabled="uploading"
                />
                <label for="file" class="upload__input--label" />
            <h1 class="q-mt-xs text-black">My Profile</h1>
            <h2>#{{ username }}</h2>
        </header>
        <main class="main-content__wrap">
            <section name="profile information" class="profile__section">
                <label for="memberSince">Member since</label>
                <div id="memberSince" class="q-mb-sm">
                    {{ toTimezone(created_at) }}
                </div>
                <label for="timezone">Timezone</label>
                <div id="timezone" class="q-mb-sm">{{ timezone }}</div>
                <label for="friendId">Friend ID</label>
                <div id="friendId" class="q-mb-sm">
                    {{ friendId }}
                    <q-btn
                        flat
                        round
                        icon="content_copy"
                        color="primary"
                        @click="copyFriendId"
                    />
                </div>
                <label class="label" for="friendId">Friend ID</label>
                <label class="label sub"
                    >Paste your friend's ID here to add them as a friend</label
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
</template>
<style lang="scss" scoped>
.profile__container {
    display: grid;
    grid-template-rows: 40vh 1fr;
    grid-template-columns: 1fr;
    background-color: rgba(246, 247, 252, 0.1);
    color: rgba(246, 247, 252, 1);
    height: calc(100vh - 50px);
    overflow: scroll;
    header {
        position: relative;
        z-index: 1;
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
            // background-color:red;
            height: 100%;
            width: 100%;
            border-radius: 50%;
        }
    }
    .main-content__wrap {
        background-color: white;
        min-height: calc(60vh - 50px);
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-top-left-radius: 32px;
        border-top-right-radius: 32px;
        margin: 0px 8px 0px 8px;

        .profile__section {
            padding: 32px;
            color: black;
            .label {
                font-weight: bold;
                // width: 100%;
                display: block;
                &.sub {
                    font-size: 0.9em;
                    font-style: italic;
                    font-weight: unset;
                }
            }
        }
    }
}
</style>
<script setup>
import { useUserStore } from "@/store/user";
const store = useUserStore();
const { id, timezone, friendId, username } = store;

const avatarUrl = computed(() => store.avatarUrl)
const { toTimezone } = useTime();

const copyFriendId = () => {
    navigator.clipboard.writeText(friendId);
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
    const client = useSupabaseClient();
    const { error } = await client
        .from("friends")
        .insert({ profile_id_1: id, profile_id_2: friendToAdd.value });
    const { setBanner } = useBanner();
    if (error) {
        setBanner(getError(error.details || error.message), "negative");
    } else {
        setBanner("Friend added successfully!", "positive");
        friendToAdd.value = null;
        const { initData } = useData();
        initData();
    }
};

const avatar = ref(null);
const uploading = ref(false);
const src = ref("");
const files = ref();
const path = ref("");



const uploadAvatar = async (evt) => {
    files.value = evt.target.files;
    try {
        uploading.value = true;
        if (!files.value || files.value.length === 0) {
            throw new Error("You must select an image to upload.");
        }

        const file = files.value[0];
        const fileExt = file.name.split(".").pop();
        path.value = `${Math.random()}.${fileExt}`;
        const client = useSupabaseClient();
        let { error: uploadError } = await client.storage
            .from("Avatars")
            .upload(path.value, file);

        if (uploadError) throw uploadError;
        await client
            .from("profiles")
            .update({ avatar_url: path.value })
            .eq("id", id);

        store.setAvatar(path.value)
        
    } catch (error) {
        alert(error.message);
    } finally {
        uploading.value = false;
    }
};
</script>
