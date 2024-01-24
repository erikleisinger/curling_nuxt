<template>
    <NuxtLayout name="login">
        <header class="q-pa-md">
            <h1 class="text-center smmd-text">Update password</h1>
            <h2 class="font-secondary text-caption text-center">
                Enter and verify a new password for your account.
            </h2>
        </header>
        <q-form @submit="onSubmit">
            <q-card-section>
                <LoginSetPassword v-model="newPassword" />
            </q-card-section>
            <q-card-actions class="row justify-center q-mb-md">
                <Button
                    color="mint"
                    style="padding: 0px 32px; min-width: 125px"
                    type="submit"
                    :loading="loading"
                    :disable="loading"
                >
                    Submit
                </Button>
            </q-card-actions>
           
        </q-form>
    </NuxtLayout>
</template>
<script setup>
import { useNotificationStore } from "@/store/notification";
const route = useRoute();
const newPassword = ref(null);
const loading = ref(false);
const notStore = useNotificationStore();

const onSubmit = async () => {
    loading.value = true;
    const notId = notStore.addNotification({
        status: "pending",
        text: "Updating password...",
    });
    const client = useSupabaseClient();
    const { error } = await client.auth.updateUser({
        password: newPassword.value,
    });

    if (error) {
        notStore.updateNotification(notId, {
            status: "failed",
            text: `Error updating password: ${error?.message}`,
        });
    } else {
        notStore.updateNotification(notId, {
            status: "completed",
            text: `Password updated!`,
        });
        return navigateTo("/gateway");
    }

    loading.value = false;
};
</script>
