<template>
    <NuxtLayout>
        <div class="team-creation__container">
            <TeamProfile
                showPlayers
                :canEdit="!saving"
                create
                @update="onUpdate"
                :teamId="0"
            />
        </div>
        <div class="full-width row justify-center items-center q-mt-lg">
            <q-btn
                color="green"
                outline
                rounded
                icon="check"
                @click="save"
                :disable="saving"
                :loading="saving"
                >Save</q-btn
            >
        </div>
    </NuxtLayout>
</template>
<style lang="scss" scoped>
.team-creation__container {
    padding: 0px var(--space-md);
}
</style>
<script setup>
import Team from "@/store/models/team";
import TeamPlayer from "@/store/models/team-player";
import { useStorageStore } from "@/store/storage";
import { useTeamStore } from "@/store/teams";
import { useTeamRequestStore } from "@/store/team-requests";
import { useUserTeamStore } from "@/store/user-teams";

const editedItem = {
    id: 0,
    name: null,
    team_avatar: null,
    avatar_type: null,
    avatar_url: null,
    players: [],
};

const onUpdate = (update) => {
    if (update.players) {
        console.log('new playeres: ', update.players)
        editedItem.players = update.players;
    } else if (update.avatar) {
        if (update.avatar.path) {
            editedItem.avatar_type = "upload";
            editedItem.avatar_url = update.avatar.path;
            useStorageStore().addAvatar(update.avatar.file, 0);
        }
    } else if (update.name) {
        editedItem.name = update.name;
    }
    useRepo(Team).where("id", 0).save(editedItem);
};

const mod = 10000000000;

onMounted(() => {
    const { user: userId } = useUser();
    useRepo(Team).save({ id: 0 });
    setTimeout(() => {
        useRepo(TeamPlayer).save({
            id: mod,
            team_id: 0,
            player_id: userId.value,
            status: "create",
            position: null,
        });
    }, 500);
});

const saving = ref(false);

const save = async () => {
    if (!editedItem.name) return;
    saving.value = true;
    const { players: oldPlayers, id: oldId, ...rest } = editedItem;
    const { data, errors } = await useSupabaseClient()
        .from("teams")
        .insert({
            ...rest,
            avatar_type: rest.avatar_type ?? 'avataaar'
        })
        .select("id")
        .single();
    const { id } = data || {};
    if (!id) return;
    if (editedItem.avatar_url) {
        const url = await fetch(useStorageStore().teamAvatars[0]).then((r) =>
            r.blob()
        );
        await useTeamStore().uploadAvatarToTeam(editedItem.avatar_url, url, id);
    } 
   

    if (editedItem.players.length) {
        const { user: userId } = useUser();
        const { players } = useRepo(Team)
            .with("players")
            .where("id", 0)
            .first();
        await useSupabaseClient().from("team_profile_junction").insert({
            profile_id: userId.value,
            is_admin: true,
            team_id: id,
        });

        players
            .filter(({ id }) => id !== userId.value)
            .forEach((player) => {
                useTeamRequestStore().sendTeamRequest({
                    team_id: id,
                    requestee_profile_id: player.id,
                });
            });
    }
    useStorageStore().removeAvatar(0);
    await useUserTeamStore().fetchUserTeams(true);

    return navigateTo(`/teams/${id}`);
};

onBeforeUnmount(() => {
    useRepo(Team).where("id", 0).delete();
    useRepo(TeamPlayer).where("team_id", 0).delete();
});
</script>
