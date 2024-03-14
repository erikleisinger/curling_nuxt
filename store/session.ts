import { defineStore } from "pinia";

export const useSessionStore = defineStore("session", {
    state: () => ({
        addTeamMenuOpen: false,
        avatarGeneratorOpen: false,
        drawerOpen: false,
        loading: false,
        ringsMenuOpen: false,

    }),
    actions: {
        setLoading(bool: boolean) {
            this.loading = bool;
        },
        toggleAddTeamMenu(open: boolean) {
            this.addTeamMenuOpen = open;
        },
        toggleAvatarGenerator(open: boolean) {
            this.avatarGeneratorOpen = open;
        },
        toggleDrawer(open: boolean) {
            this.drawerOpen = open;
        },
        toggleRingsMenu(open: boolean) {
            this.ringsMenuOpen = open;
        },
    },
});
