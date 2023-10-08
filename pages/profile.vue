<template>
<NuxtLayout>
<div class="profile__scroll">
    <!-- <ProfileCard :avatar="JSON.stringify(user.avatar)" v-if="user?.id">
           {{ user.first_name }} {{ user.last_name }}
        <template v-slot:subtitle> @{{ user.username }} </template>
   
    </ProfileCard> -->
    <header class="column items-center" ref="header" v-if="!editing">
        <div class="avatar__container">
        <Avataaar v-bind="user.avatar" v-if="user?.id"/>
        </div>
        <div class="name__container">
            <h1 class="text-lg text-center">{{user.first_name}} {{user.last_name}}</h1>
            <h2 class="text-sm text-center">@{{user.username}}</h2>
        </div>
    </header>
    <!-- <nav class="bg-white profile__nav">
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
    </nav> -->
    <main
        class="main-content__wrap settings" v-if="!editing"
      
    >
        <section name="timezone" class="section">
            <!-- <label for="timezone" class="label">Timezone</label>
            <div id="timezone">{{ user.timezone }}</div> -->
             <q-btn class="q-mt-lg" color="primary" @click="editing = true">Edit avatar</q-btn>
        </section>
    </main>

        
        <AvataaarGenerator role="main" v-model="user.avatar"  v-if="editing" @close="editing = false"/>

</div>
</NuxtLayout>
</template>
<style lang="scss" scoped>
.avatar__container {
    width: 10em;
}
.name__container {
    margin-bottom: var(--space-md);
    margin-top: var(--space-sm);
}
.profile__scroll {
    height: 100%;
    overflow: auto;
    display: grid;
    grid-template-rows: auto 1fr;
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
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    box-shadow: $pretty-shadow;

    border: 1px solid rgba(0,0,0,0.1);
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

import {parseAvatar} from '@/utils/avatar'
import Player from '@/store/models/player'


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
const editing = ref(false)





const {user: userId} = useUser()

const user = computed(() => useRepo(Player).where('id', userId.value).first())


const { toTimezone } = useTime();



</script>
<script>
export default {
    name: "Profile",
};
</script>

