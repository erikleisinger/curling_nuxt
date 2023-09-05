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
    </main>

        
        <AvataaarGenerator v-else-if="tab === TAB_NAMES.PLAYER.value && user.id" role="main" v-model="user.avatar" :onSave="updateAvatar"/>

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
    }
}
</style>
<script setup>
import { useUserStore } from "@/store/user";
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

const getUser = () => {
const {
        id,
        timezone,
        username,
        player,
        first_name,
        last_name,
        avatar,
    } = store;

    user.value = {
        id,
        timezone,
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

</script>
<script>
export default {
    name: "Profile",
};
</script>

