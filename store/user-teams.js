import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { useNotificationStore } from "@/store/notification";
import Team from '@/store/models/team'
import Rink from '@/store/models/rink'

export const useUserTeamStore = defineStore("user-teams", {
    state: () => {
        return {
            userTeams: useStorage("user-teams", []),
        };
    },
    actions: {
        async addTeam({ team, type = "fan", is_admin = false }) {
            const notStore = useNotificationStore();
            const { name, id } = team;
            const notificationId = notStore.addNotification({
                state: "pending",
                text: `Adding ${name} to your teams...`,
                timeout: -1,
            });
            const { user: profile_id } = useUser();
            const client = useSupabaseClient();
            const { error } = await client
                .from("team_profile_junction")
                .upsert({
                    profile_id: profile_id.value,
                    team_id: id,
                    type,
                    is_admin,
                });

            if (error) {
                notStore.updateNotification(notificationId, {
                    state: "failed",
                    text: `Error adding ${name} to your teams (code: ${error.code}).`,
                    timeout: 5000,
                });
            } else {
                notStore.updateNotification(notificationId, {
                    state: "completed",
                    text: `${name} was added to your teams.`,
                    timeout: 5000,
                });
                await this.fetchUserTeams(true);
            }
        },
        async fetchUserTeams(force = false) {
            if (this.userTeams?.length && !force) return;
            const { user: userId } = useUser();
            const client = useSupabaseClient();
            const {data} = await client.from('team_profile_junction').select(`
                team:team_id (
                    id,
                    name,
                    avatar_url,
                    rink_id
                )
            `).eq('profile_id', userId.value)
            
            useRepo(Team).save(data.map(({team: t}) => {
                return    {
                    id: t.id,
                    name: t.name,
                    avatar_url: t.avatar_url,
                    rink_id: t.rink_id
                }
            }


          
            ))

            // await useRepo(Rink).save(data.filter((t) => !!t.rink).map((t) => t.rink))

           
            this.userTeams = [...(data ?? [])].map(({team}) => team)
        },
        async removeTeam(team) {
            const notStore = useNotificationStore();
            const { name, id } = team;
            const notificationId = notStore.addNotification({
                state: "pending",
                text: `Removing ${name} from your teams...`,
                timeout: -1,
            });
            const { user: profile_id } = useUser();
            const client = useSupabaseClient();
            const { error } = await client
                .from("team_profile_junction")
                .delete()
                .eq("profile_id", profile_id.value)
                .eq("team_id", id);

            if (error) {
                notStore.updateNotification(notificationId, {
                    state: "failed",
                    text: `Error removing ${name} from your teams (code: ${error.code}).`,
                    timeout: 5000,
                });
            } else {
                notStore.updateNotification(notificationId, {
                    state: "completed",
                    text: `${name} was removed from your teams.`,
                    timeout: 5000,
                });
                await this.fetchUserTeams(true);
            }
        },
        async updateTeamProfile(id, updates) {
            const notStore = useNotificationStore();
            const notificationId = notStore.addNotification({
                state: "pending",
                text: `Updating player...`,
                timeout: -1,
            });
            const client = useSupabaseClient();
            const { data, error } = await client
                .from("team_profile_junction")
                .update({ ...updates, position: "lead" })
                .select("is_admin")
                .eq("id", id);
            if (error) {
                notStore.updateNotification(notificationId, {
                    state: "failed",
                    text: `Error updating player(code: ${error.code}).`,
                    timeout: 5000,
                });
            } else {
                notStore.updateNotification(notificationId, {
                    state: "completed",
                    text: `Player updated.`,
                    timeout: 5000,
                });
            }
            await this.fetchUserTeams(true);
        },
    },
});
