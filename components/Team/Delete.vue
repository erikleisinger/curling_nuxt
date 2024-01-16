<template>
    <DialogConfirmation
        confirmButtonText="Delete Team"
        cancelButtonText="Cancel"
        @confirm="deleteTeam"
        @close="emit('close')"
        cancelColor=""
        confirmColor="negative"
        :disableConfirm="deleting || !teamNameMatch"
        :disableCancel="deleting"
    >
        <h3 class="text-bold text-md">Delete {{ teamName }}?</h3>
        <p class="text-red q-mt-sm">
            This action cannot be undone. All games, badges, and stats will be
            <strong>permanently</strong> removed. Forever!
        </p>
        <p>
            To delete this team, please type the team name into the input below.
        </p>
        <q-input
            outlined
            dense
            :placeholder="teamName"
            v-model="teamDeletionVerification"
        >
        </q-input>
    </DialogConfirmation>
</template>
<script setup>
import Team from '@/store/models/team';
import {useNotificationStore} from '@/store/notification';
import {useUserTeamStore} from '@/store/user-teams'
    const props = defineProps({
        teamId: Number,
    })
    
    const emit = defineEmits(['close'])

    const teamDeletionVerification = ref(null);

    const teamName = computed(() => useRepo(Team).where('id', props.teamId).first()?.name);

    const teamNameMatch = computed(
    () => teamDeletionVerification.value === teamName.value
);

    const deleting = ref(false);
const deleteTeam = async () => {
    const { setLoading } = useLoading();
    setLoading(true);
    const name = teamName.value;
    const notStore = useNotificationStore();
    const notId = notStore.addNotification({
        text: `Deleting ${name}`,
        state: "pending",
    });
    try {
        const client = useSupabaseClient();

        await client.from("teams").delete().eq("id", props.teamId);

        await useUserTeamStore().fetchUserTeams(true);

        notStore.updateNotification(notId, {
            state: "completed",
            text: `${name} was deleted.`,
        });
    } catch (error) {
        notStore.updateNotification(notId, {
            state: "failed",
            text: `Error deleting: ${error}`,
        });
    }

    

    setTimeout(() => {
        useRepo(Team).where("id", props.teamId).delete();
        setLoading(false);
    }, 1000);

    return navigateTo("/");
};
</script>