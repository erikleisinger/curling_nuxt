<template>
    <div v-if="ready">
          <TutorialHighlight
            v-if="!isPlayerPage && (!hasRink || !hasAvatar) && !drawerOpen"
            elementId="global-menu-toggle"
            tutorialText="Let's get your profile set up! Click on the menu button to open the navigation drawer."
        />
        <TutorialHighlight
            v-else-if="
                !isPlayerPage && (!hasRink || !hasAvatar) && !!drawerOpen
            "
            elementId="global-drawer-user-avatar"
            tutorialText="Click your avatar to go to your player page."
            bottom
        />
        <TutorialHighlight
            v-else-if="showAddTeam"
            elementId="dashboard-add-team-button"
            tutorialText="Looks like you aren't on any teams! Click the add button to get started."
            bottom
        />
         <TutorialHighlight
            v-else-if="showAddTeamMenu"
            elementId="dashboard-add-team-menu"
            tutorialText="If your team already exists on pebble, you can search for it and request to join. Otherwise, add your team by clicking Create new team!"
            bottom
        />
           <TutorialHighlight
            v-else-if="showTeamRequest"
            elementId="team-page-requests-handler"
            tutorialText="If you'd like to join this team, click on Request to Join Team!"
            bottom
        />
                <TutorialHighlight
            v-else-if="showTeamRequestDone"
            elementId="global-logo"
            tutorialText="Great! You've requested to join the team. while you wait for a member of the team to approve your request, you can head back to the dashboard to check out your team statistics."
            bottom
        />
                 <TutorialHighlight
            v-else-if="showTeamCreateDone"
            elementId="global-logo"
            tutorialText="Great! You've created a team. Now let's go back to dashboard to view your stats."
            bottom
        />
      
        <TutorialHighlight
            v-else-if="showSettingsHighlight"
            elementId="player-page-settings-tab"
            tutorialText="Click your settings to modify your profile."
            bottom
        />
        <TutorialHighlight
            v-else-if="showRinkHighlight"
            elementId="edit-player-rink-btn"
            tutorialText="Click the edit button to select a home rink."
            bottom
        />
        <TutorialHighlight
            v-else-if="showAvatarHighlight"
            elementId="player-page-edit-avatar"
            tutorialText="Click to customize your personal avatar"
            bottom
        />
         <TutorialHighlight
            v-else-if="showBackFromProfile"
            elementId="global-logo"
            tutorialText="Great! Now lets go back to the dashboard and get you on a team."
            bottom
        />
         <TutorialHighlight
            v-else-if="showAddGame"
            elementId="global-rings-menu"
            tutorialText="To see your team stats, you'll first need to add a game. To do that, click on the rings menu and select 'New game'."
            bottom
        />
    </div>
</template>
<script setup>
import { useSessionStore } from "@/store/session";
import { useDialogStore } from "@/store/dialog";
import {useUserStore} from '@/store/user'
import {useTeamRequestStore} from '@/store/team-requests'
import Player from "@/store/models/player";
import GameTeam from '@/store/models/game-team'
import { useElementVisibility } from "@vueuse/core";
const route = useRoute();
const DISABLE_ON_ROUTES = ["gateway"];
const ready = computed(() => !DISABLE_ON_ROUTES.includes(route.name));

const { user: userId } = useUser();
const { userTeamIds } = useTeam();
const requests = computed(() => useTeamRequestStore().requests)

const player = computed(() =>
    useRepo(Player).where("id", userId.value).first()
);

const games = computed(() => useRepo(GameTeam).query().whereIn('team_id', userTeamIds.value).get())

const hasGames = computed(() => !!games.value?.length)

const hasRink = computed(() => !!player.value?.rink_id);
const hasAvatar = computed(() => {
    try {
        return !!Object.values(player.value?.avatar)?.length;
    } catch {
        return false;
    }
});

const drawerOpen = computed(() => useSessionStore().drawerOpen);
const isSearchOpen = computed(() => useDialogStore().globalSearch.open);
const isAvatarGeneratorOpen = computed(() => useSessionStore().avatarGeneratorOpen)
const isRingsMenuOpen = computed(() => useSessionStore().ringsMenuOpen)

const routeName = computed(() => route.name);

const isPlayerPage = computed(() => routeName.value === "player-id");
const isTeamPage = computed(() => route.name === 'teams-id')
const isDashboard = computed(() => route.name === 'index')

const routeHash = computed(() => route.hash);

const isPlayerSettings = computed(() => route.hash === "#settings");

const showSettingsHighlight = computed(
    () =>
        (!hasRink.value || !hasAvatar.value) &&
        !drawerOpen.value &&
        isPlayerPage.value &&
        !isPlayerSettings.value
);

const showRinkHighlight = computed(
    () => !hasRink.value && isPlayerPage.value && isPlayerSettings.value
);
const showAvatarHighlight = computed(
    () => !hasAvatar.value && isPlayerPage.value && isPlayerSettings.value && !isAvatarGeneratorOpen.value
);

const hasTeams = computed(() => !!userTeamIds?.value?.length)

const showAddTeam = computed(() => !isSearchOpen.value && !isPlayerPage.value && !hasTeams.value && !isAddMenuVisible.value);
const showAddTeamMenu = computed(() => !isSearchOpen.value && !isPlayerPage.value && !hasTeams.value && !!isAddMenuVisible.value && menuReady.value)
const showTeamRequest = computed(() => isTeamPage.value && !userTeamIds.value?.length)
const showTeamRequestDone = computed(() => isTeamPage.value && !!userTeamIds.value?.length && !!requests.value.length)
const showTeamCreateDone = computed(() => isTeamPage.value && !!userTeamIds.value?.length && !requests.value.length)

const showBackFromProfile = computed(() => isPlayerPage.value && !!hasRink.value && !!hasAvatar.value && !isAvatarGeneratorOpen.value)

const showAddGame = computed(() => !games.value?.length && !isPlayerPage.value && !isTeamPage.value && !isRingsMenuOpen.value && isDashboard.value)

const isAddMenuVisible = computed(() => useSessionStore().addTeamMenuOpen);

const menuReady = ref(false);

watch(isAddMenuVisible, (val) => {
    setTimeout(() => {
        menuReady.value = val;
    }, 1)
})

const isTutorialDone = computed(() => !!hasAvatar.value && !!hasRink.value && !!userTeamIds.value?.length && !!hasGames.value)

const markTutorialDone = async () => {
    const client = useSupabaseClient();
    await client.from('profiles').update({has_completed_tutorial: true}).eq('id', userId.value)
    useUserStore().getCurrentUser();
}

watch(routeName, () => {
    if (!isTutorialDone.value || isTeamPage.value || isPlayerPage.value) return;
    markTutorialDone();

}, {immediate: true})
</script>
