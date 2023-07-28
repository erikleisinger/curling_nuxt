<template>
    <NuxtLayout>
        <div class="profile__container items-center" ref="profileContainer">
            <header class="column justify-center items-center profile__header">
                <ProfileAvatar
                    :path="user.avatarUrl"
                    :loading="uploading"
                    :size="8"
                >
                    <input
                        type="file"
                        name="file"
                        id="file"
                        class="upload__input"
                        accept="image/*"
                        @change="uploadAvatar"
                        :disabled="uploading"
                        ref="fileUpload"
                    />
                    <label for="file" class="upload__input--label row justify-center items-center" >
                        <q-icon name="edit"  class="icon"/>
                    </label>    
                </ProfileAvatar>

                <h1 class="text-black text-bold">My Profile</h1>
                <h2 class="text-muted text-lg" aria-roledescription="user name">
                    #{{ user.username }}
                </h2>
            </header>
            <main class="main-content__wrap">
                <section name="timezone" class="section">
                    <label for="timezone" class="label">Timezone</label>
                    <div id="timezone" >{{ user.timezone }}</div>
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
    display: grid;
    grid-template-rows: 1fr auto;
    grid-template-columns: 1fr;
    background-color: rgba(246, 247, 252, 0.1);
    color: rgba(246, 247, 252, 1);
    height: calc(100vh - 50px);
    overflow-y: scroll;
    .profile__header {
        position: relative;
        z-index: 1;
        padding: var(--space-xl);
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
                font-size: var(--text-lg)
            }
            color: rgba(255,255,255,0.8);
        }
    }
    .main-content__wrap {
        background-color: white;
        min-height: calc(60vh - 50px);
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
            margin-bottom: var(--space-md);
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
import { BannerColors } from "@/types/color";
import { MAX_AVATAR_FILE_SIZE } from "@/constants/supabase";
import { useScroll, useElementVisibility } from "@vueuse/core";
const store = useUserStore();

const user = computed(() => {
    const { id, timezone, friendId, username, avatarUrl } = store;
    return { id, timezone, friendId, username, avatarUrl };
});

const { toTimezone } = useTime();

const copyFriendId = () => {
    navigator.clipboard.writeText(friendId);
    const {setBanner} = useBanner();
    setBanner('ID copied', BannerColors.Primary)
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

const avatar = ref(null);
const uploading = ref(false);
const src = ref("");
const files = ref();
const path = ref("");
const fileUpload = ref(null);

const compressFile = async (file) => {
    const options = {
        maxSizeMB: 0.029,
        maxWidthOrHeight: 300,
        useWebWorker: true,
    };
    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.log(error);
    }
};

const uploadAvatar = async (evt) => {
    if (!user.value.id) return;
    const { clearBanner } = useBanner();
    clearBanner();
    files.value = evt.target.files;
    uploading.value = true;
    if (!files.value || files.value.length === 0) {
        const { setBanner } = useBanner();
        setBanner("You must select an image to upload.", BannerColors.Negative);
    }

    let file = files.value[0];
    file = await compressFile(file);
    if (file.size > MAX_AVATAR_FILE_SIZE) {
        const { setBanner } = useBanner();
        setBanner("Image is too large.", BannerColors.Negative);
        uploading.value = false;
        fileUpload.value.value = "";
        return;
    }
    const fileExt = file.name.split(".").pop();
    path.value = `${Math.random()}.${fileExt}`;
    const { client, fetchHandler } = useSupabaseFetch();
    let { data } = await fetchHandler(
        () => client.storage.from("Avatars").upload(path.value, file),
        { onError: "Error uploading file." }
    );

    if (data) {
        const { data: addAvatarData } = await fetchHandler(
            () =>
                client
                    .from("profiles")
                    .update({ avatar_url: path.value })
                    .eq("id", user.value.id),
            { onError: "Error setting avatar for profile" }
        );
        if (addAvatarData) {
            store.setAvatar(path.value);
        }
    }
    uploading.value = false;
};

const profileContainer = ref(null);
const visible = useElementVisibility(profileContainer);
const { y } = useScroll(profileContainer);

watch(visible, () => {
    y.value = 0;
});
</script>
