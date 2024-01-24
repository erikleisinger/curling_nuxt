<template>
    <div class="password-recovery__container">
        <h1 class="smmd-text text-center">Reset password</h1>
        <h2 class="font-secondary text-caption text-center">
            Enter the email associated with your account and we'll send you a
            link to reset your password.
        </h2>
        <q-input
            name="email"
            label="Email"
            v-model="email"
            lazy-rules
            filled
            outlined
            standout
            dark
        ></q-input>
        <footer class="full-width row justify-center">
            <Button
                color="mint"
                @click="sendLink"
                :disable="!email"
                :loading="loading"
                >Email me a link</Button
            >
            <div
                class="full-width text-center text-caption q-mt-sm text-underline clickable"
                @click="emit('close')"
            >
                Back
            </div>
        </footer>
    </div>
</template>
<style lang="scss" scoped>
.password-recovery__container {
    padding: var(--space-sm);
    h2 {
        margin-bottom: var(--space-md);
    }
    footer {
        margin-top: var(--space-md);
    }
}
</style>
<script setup>
import { useNotificationStore } from "@/store/notification";
const notStore = useNotificationStore();
const email = ref(null);
const loading = ref(false);
const emit = defineEmits(["close"]);
const sendLink = async () => {
    loading.value = true;
    const { origin } = window.location;
    const client = useSupabaseClient();
    const { data, error } = await client.auth.resetPasswordForEmail(
        email.value,
        {
            redirectTo: `${origin}/update-password`,
        }
    );
    if (error) {
        notStore.addNotification({
            status: "failed",
            text: "There was an error resetting your password. Please try again or contact support.",
        });
    } else {
        notStore.addNotification({
            status: "completed",
            text: "Check your email for instructions on how to change your password.",
        });
    }
    loading.value = false;
    emit("close");
};
</script>
