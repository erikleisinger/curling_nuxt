import { defineStore } from "pinia";
import { useNotificationStore } from "@/store/notification";
import Player from '@/store/models/player'
import Rink from '@/store/models/rink'
export const useUserStore = defineStore("user", {
    state: () => {
        return {
            avatar: null,
            email: null,
            first_name: null,
            has_completed_tutorial: false,
            id: null,
            is_new: false,
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
                    avatar,
                    is_new,
                    rink_id,
                    has_completed_tutorial
                `).eq('id', profileId),
                { onError: "Error getting current user" }

               
            );
            const [user] = data;
            if (!user) return;
            Object.assign(this, user);
            useRepo(Player).save(user)
            if (user.rink_id) {
                const {data:rink} = await client.from('rinks').select('*').eq('id', user.rink_id).single();
                useRepo(Rink).save(rink)
            }
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
        toggleShowNumbers() {
            this.showNumbers = !this.showNumbers;
        },
        async updateHomeRink(rink_id: number) {
            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: 'pending',
                text: `Updating home rink...`,
            })

            const client = useSupabaseClient();
        const {errors} = await client
        .from("profiles")
        .update({
            rink_id,
        })
        .eq("id", this.id);

        if (errors) {
            notStore.updateNotification(notId, {
                state: 'failed',
                text: `Error updating home rink (code: ${errors.code})`
            })
        } else {
            await  this.getCurrentUser();
            notStore.updateNotification(notId, {
                state: 'completed',
                text: `Home rink updated!`
            })
        
        }

        },
        async updateUserAvatar(newAvatar) {
            const avatar = typeof newAvatar === 'object' ? JSON.stringify(newAvatar) : newAvatar;

            const notStore = useNotificationStore();
            const notId = notStore.addNotification({
                state: 'pending',
                text: `Updating avatar...`,
            })

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
                useRepo(Player).where('id', this.id).update({avatar})
            }

        }
    }, 
});
