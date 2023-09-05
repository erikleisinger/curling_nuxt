import { defineStore } from "pinia";
import { useNotificationStore } from "@/store/notification";
export const useUserStore = defineStore("user", {
    state: () => {
        return {
            avatar: null,
            email: null,
            first_name: null,
            id: null,
            last_name: null,
            showNumbers: false,
            timezone: "America/Toronto",
            username: null,
            userTeams: [],
        } as {
            avatar: string | null;
            email: string | null;
            first_name: string | null;
            id: string | null;
            last_name: string | null;
            showNumbers: boolean;
            timezone: string;
            username: string | null;
            userTeams: number[];
        };
    },

    actions: {
        async getCurrentUser() {
            const { client, fetchHandler } = useSupabaseFetch();
            const sesh = await client.auth.getUser();

            const { id: profileId, email = null } = sesh.data.user || {};
            this.setEmail(email);
            const { data } = await fetchHandler(
                () => client.from("profiles").select(`
                    id, 
                    timezone,
                    username,
                    first_name,
                    last_name,
                    avatar
                `).eq('id', profileId),
                { onError: "Error getting current user" }
            );
            const [user] = data;
            if (!user) return;
            Object.assign(this, user);
            // await this.getUserTeams();
        },
        async getUserTeams() {
            const { client, fetchHandler } = useSupabaseFetch();
            const { id: profileId } = this;
            const { data } = await fetchHandler(
                () =>
                    client
                        .from("team_profile_junction")
                        .select("team_id")
                        .eq("profile_id", profileId),
                { onError: "Error getting user teams" }
            );
            if (!data) return;
            const teams = data.map(({ team_id }) => team_id);
            this.setUserTeams(teams);
        },
        setAvatar(path: string) {
            this.avatarUrl = path;
        },
        setEmail(email: string | null) {
            this.email = email;
        },

        setId(id: string) {
            this.id = id;
        },
        setTimezone(timezone: string | null | undefined) {
            if (!timezone) return;
            this.timezone = timezone;
        },
        setUserTeams(teams: number[]) {
            this.userTeams = teams;
        },
        toggleShowNumbers() {
            this.showNumbers = !this.showNumbers;
        },
        async updateUserAvatar(newAvatar) {
            const avatar = typeof newAvatar === 'object' ? JSON.stringify(newAvatar) : newAvatar;

            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: 'pending',
                text: `Updating avatar...`,
            })
            console.log(newAvatar, this.id)

            const client = useSupabaseClient();
            const {errors} = await client.from('profiles').update({avatar}).eq('id', this.id)

            if (errors) {
                notStore.updateNotification(notId, {
                    state: 'failed',
                    text: `Error updating avatar (code: ${errors.code})`
                })
            } else {
                notStore.updateNotification(notId, {
                    state: 'completed',
                    text: `Avatar updated!`
                })
                await this.getCurrentUser();
            }

        }
    }, 
});
