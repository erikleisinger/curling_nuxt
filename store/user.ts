import { defineStore } from "pinia";
import { BasicPlayer } from "@/types/player";
export const useUserStore = defineStore("user", {
    state: () => {
        return {
            avatar: null,
            email: null,
            firstName: null,
            friendId: null,
            id: null,
            lastName: null,
            player: {
                id: null,
                name: null,
            },
            showNumbers: false,
            timezone: "America/Toronto",
            username: null,
            userTeams: [],
        } as {
            avatar: string | null;
            email: string | null;
            firstName: string | null;
            friendId: string | null;
            id: string | null;
            lastName: string | null;
            player: BasicPlayer | null;
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
            const { data: user } = await fetchHandler(
                () => client.rpc("get_profile", {profile_id_param: profileId}),
                { onError: "Error getting current user" }
            );
            if (!user) return;

            const {
                timezone,
                id,
                friend_id: friendId,
                username,
                player,
                first_name: firstName,
                last_name: lastName
            } = user || {};
            const { f1: player_id, f2: name, f3: avatar } = player || {};
            this.setData({
                timezone,
                id,
                friendId,
                username,
                avatar,
                email,
                player: { id: player_id, name },
                firstName,
                lastName
            });
            await this.getUserTeams();
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
            // const [user] = data || [];
            // const {timezone, id, friend_id:friendId, username, avatar_url: avatarUrl} = user || {};
            // this.setData({timezone, id, friendId, username, avatarUrl, email})
        },
        setAvatar(path: string) {
            this.avatarUrl = path;
        },
        setEmail(email: string | null) {
            this.email = email;
        },
        setData(data: {
            timezone: string | null;
            id: string | null;
            friendId: string | null;
            username: string | null;
            avatar: string | null;
            email: string | null;
            player: { id: number | null; name: string | null };
            firstName: string | null;
            lastName: string | null;
        }) {
            Object.assign(this, data);
        },
        setFriendId(id: string) {
            this.friendId = id;
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
    },
});
